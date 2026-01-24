"""
API models for authentication.

These are the models we RETURN to our frontend - clean, readable field names.
For parsing Kickbase's raw responses, see app/kickbase/models.py
"""

from pydantic import BaseModel


# --- Request Models (what frontend sends to us) ---


class LoginRequest(BaseModel):
    """Login request from frontend."""

    email: str
    password: str


# --- Response Models (what we return to frontend) ---


class User(BaseModel):
    """User info we return to frontend (clean field names)."""

    id: str
    name: str
    email: str | None = None
    profile_image: str | None = None


class League(BaseModel):
    """League info we return to frontend (clean field names)."""

    id: str
    name: str
    member_count: int | None = None


class LoginResponse(BaseModel):
    """Login response we return to frontend."""

    token: str
    user: User
    leagues: list[League]
