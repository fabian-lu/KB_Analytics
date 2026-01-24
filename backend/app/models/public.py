"""
API response models for public endpoints (no auth required).

These are the clean models returned to the frontend.
"""

from pydantic import BaseModel


class TeamStanding(BaseModel):
    """Team in the Bundesliga table."""

    position: int
    team_name: str
    short_name: str
    team_icon_url: str
    points: int
    matches: int
    won: int
    draw: int
    lost: int
    goals: int
    opponent_goals: int
    goal_diff: int


class BundesligaTableResponse(BaseModel):
    """Response for GET /api/table"""

    season: str
    standings: list[TeamStanding]
