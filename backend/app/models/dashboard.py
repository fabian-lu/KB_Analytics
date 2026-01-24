"""
API response models for the dashboard endpoint.

These models define what we return to the frontend - clean, readable field names.
For parsing Kickbase responses, see app/kickbase/models/
"""

from pydantic import BaseModel


class PlayerSummary(BaseModel):
    """
    Player info for dashboard display.

    Used in lineup, best/worst value lists, etc.
    """
    id: str
    name: str
    position: int  # 1=GK, 2=DEF, 3=MID, 4=FWD
    team_id: str
    profile_image: str
    market_value: int
    total_points: int
    avg_points: float
    euros_per_point: float | None  # None if avg_points is 0


class DashboardOverview(BaseModel):
    """
    Overview stats shown at top of dashboard.
    """
    rank: int
    total_managers: int
    avg_points_per_matchday: float
    team_value: int
    budget: int


class DashboardLineup(BaseModel):
    """
    Lineup section of the dashboard.
    """
    formation: str  # e.g., "4-4-2"
    starting: list[PlayerSummary]  # 11 players
    bench: list[PlayerSummary]  # remaining players


class DashboardResponse(BaseModel):
    """
    Complete dashboard response.

    This is what GET /api/leagues/{league_id}/dashboard returns.
    """
    overview: DashboardOverview
    best_value_players: list[PlayerSummary]  # top 3 by €/point
    worst_value_players: list[PlayerSummary]  # bottom 3 by €/point
    lineup: DashboardLineup
