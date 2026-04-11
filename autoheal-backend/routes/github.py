from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

def get_github_token(authorization: str = Header(None)):
    """
    Safely retrieves the GitHub token. It prioritizes the secure `.env` file first.
    If not found, it checks if the frontend passed a Bearer token in the request header.
    Never logs the token to the console.
    """
    env_token = os.getenv("GITHUB_ACCESS_TOKEN")
    if env_token:
        return env_token
    
    if authorization and authorization.startswith("Bearer "):
        return authorization.split("Bearer ", 1)[1]
        
    raise HTTPException(status_code=401, detail="No GitHub access token provided in .env or Request Headers.")

@router.get("/user")
async def get_user_profile(token: str = Depends(get_github_token)):
    """Fetches the user's Github profile securely."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Invalid GitHub Token")
        return response.json()

@router.get("/repos")
async def get_user_repos(token: str = Depends(get_github_token)):
    """Fetches the user's GitHub repositories."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user/repos?sort=updated&per_page=20",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch repositories")
        return response.json()
