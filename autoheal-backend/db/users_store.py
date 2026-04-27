"""
Simple JSON-based persistent user store.
In production, swap this out for a real database (PostgreSQL, etc.).
"""
import json
import os
from typing import Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "users.json")


def _load() -> list[dict]:
    if not os.path.exists(DB_PATH):
        return []
    with open(DB_PATH, "r") as f:
        return json.load(f)


def _save(users: list[dict]) -> None:
    with open(DB_PATH, "w") as f:
        json.dump(users, f, indent=2)


def get_user_by_email(email: str) -> Optional[dict]:
    users = _load()
    for u in users:
        if u["email"].lower() == email.lower():
            return u
    return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    users = _load()
    for u in users:
        if u["id"] == user_id:
            return u
    return None


def create_user(user: dict) -> dict:
    users = _load()
    users.append(user)
    _save(users)
    return user


def update_user(user_id: str, updates: dict) -> Optional[dict]:
    users = _load()
    for i, u in enumerate(users):
        if u["id"] == user_id:
            users[i].update(updates)
            _save(users)
            return users[i]
    return None


def delete_user(user_id: str) -> bool:
    users = _load()
    new_users = [u for u in users if u["id"] != user_id]
    if len(new_users) == len(users):
        return False
    _save(new_users)
    return True
