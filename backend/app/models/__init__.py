"""
API response models package.

These models define what we return to the frontend - clean, readable field names.
For parsing external data sources (Kickbase, RSS, etc.), see each source's models/
"""

from app.models.auth import (
    League,
    LoginRequest,
    LoginResponse,
    User,
)
from app.models.dashboard import (
    DashboardLineup,
    DashboardOverview,
    DashboardResponse,
    PlayerSummary,
)
from app.models.public import (
    BundesligaTableResponse,
    TeamStanding,
)

__all__ = [
    # Auth
    "LoginRequest",
    "LoginResponse",
    "User",
    "League",
    # Dashboard
    "DashboardResponse",
    "DashboardOverview",
    "DashboardLineup",
    "PlayerSummary",
    # Public
    "BundesligaTableResponse",
    "TeamStanding",
]
