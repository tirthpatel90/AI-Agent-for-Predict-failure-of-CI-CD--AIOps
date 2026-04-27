"""
Auth router — handles register, login, /me, logout, profile update, delete account.

Security guarantees:
- Passwords hashed with bcrypt (via passlib) — never stored plain
- Sessions via JWT signed with HS256 (python-jose) stored in httpOnly cookies
- Tokens expire after 7 days
- CORS restricts origins to localhost:3000 (set in main.py)
"""
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Response, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from passlib.context import CryptContext
from jose import JWTError, jwt

from db.users_store import (
    get_user_by_email,
    get_user_by_id,
    create_user,
    update_user,
    delete_user,
)

router = APIRouter()

# ─── Security config ───────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-production-use-strong-random-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7
COOKIE_NAME = "autoheal_token"

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─── Pydantic models ───────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()


class LoginRequest(BaseModel):
    email: str
    password: str


class OAuthRequest(BaseModel):
    provider: str          # "google" | "github"
    provider_id: str       # unique ID from the provider
    name: str
    email: str
    avatar_url: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None


# ─── JWT helpers ───────────────────────────────────────────────────────────────
def _create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def _get_current_user(request: Request) -> dict:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def _safe_user(user: dict) -> dict:
    """Return user dict without the password hash."""
    return {k: v for k, v in user.items() if k != "password_hash"}


def _set_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,          # JS cannot access — prevents XSS token theft
        secure=False,           # Set to True in production (HTTPS only)
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 86400,
        path="/",
    )


# ─── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register", status_code=201)
def register(body: RegisterRequest, response: Response):
    if get_user_by_email(body.email):
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user = {
        "id": str(uuid.uuid4()),
        "name": body.name,
        "email": body.email,
        "password_hash": pwd_ctx.hash(body.password),
        "provider": "email",
        "provider_id": None,
        "avatar_url": None,
        "joined_at": datetime.now(timezone.utc).isoformat(),
        "connected_providers": ["email"],
    }
    create_user(user)
    token = _create_token(user["id"])
    _set_cookie(response, token)
    return {"user": _safe_user(user)}


@router.post("/login")
def login(body: LoginRequest, response: Response):
    user = get_user_by_email(body.email)
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not pwd_ctx.verify(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = _create_token(user["id"])
    _set_cookie(response, token)
    return {"user": _safe_user(user)}


@router.post("/oauth")
def oauth_login(body: OAuthRequest, response: Response):
    """
    Called after a real OAuth redirect completes on the client.
    If user exists → log in. If not → create account.
    """
    existing = get_user_by_email(body.email)
    if existing:
        # Link provider if not already linked
        providers = existing.get("connected_providers", [])
        if body.provider not in providers:
            providers.append(body.provider)
            update_user(existing["id"], {
                "connected_providers": providers,
                "avatar_url": existing.get("avatar_url") or body.avatar_url,
            })
            existing = get_user_by_id(existing["id"])
        token = _create_token(existing["id"])
        _set_cookie(response, token)
        return {"user": _safe_user(existing)}

    # New user via OAuth
    user = {
        "id": str(uuid.uuid4()),
        "name": body.name,
        "email": body.email,
        "password_hash": None,
        "provider": body.provider,
        "provider_id": body.provider_id,
        "avatar_url": body.avatar_url,
        "joined_at": datetime.now(timezone.utc).isoformat(),
        "connected_providers": [body.provider],
    }
    create_user(user)
    token = _create_token(user["id"])
    _set_cookie(response, token)
    return {"user": _safe_user(user)}


@router.get("/me")
def get_me(request: Request):
    user = _get_current_user(request)
    return {"user": _safe_user(user)}


@router.patch("/profile")
def update_profile(body: UpdateProfileRequest, request: Request):
    user = _get_current_user(request)
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updated = update_user(user["id"], updates)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": _safe_user(updated)}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"message": "Logged out successfully"}


@router.delete("/account")
def delete_account(request: Request, response: Response):
    user = _get_current_user(request)
    deleted = delete_user(user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"message": "Account deleted"}
