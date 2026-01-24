"""
Pydantic models for parsing Kickbase league responses.

For API response models (what we return to frontend), see app/models/
"""

from pydantic import BaseModel, Field


class KickbaseTeamPlayerCount(BaseModel):
    """Team player count from /leagues/{id}/me"""
    team_id: str = Field(alias="tid")
    player_count: int = Field(alias="npt")
    team_image: str = Field(alias="tim")

    model_config = {"populate_by_name": True}


class KickbaseLeagueMe(BaseModel):
    """Response from /leagues/{id}/me - user's league info."""
    budget: float = Field(alias="b")
    budget_status: int = Field(alias="bs")  # 1 = positive, other = negative?
    user_number: int = Field(alias="un")  # user's number in league?
    is_admin: bool = Field(alias="adm")
    competition_id: str = Field(alias="cpi")
    league_name: str = Field(alias="lnm")
    team_player_counts: list[KickbaseTeamPlayerCount] = Field(alias="tpc")
    game_point_multiplier: int = Field(alias="gpm")

    model_config = {"populate_by_name": True}


class KickbaseRankingUser(BaseModel):
    """Single user from /leagues/{id}/ranking"""
    id: str = Field(alias="i")
    name: str = Field(alias="n")
    is_admin: bool = Field(alias="adm")
    season_points: int = Field(alias="sp")
    matchday_points: int = Field(alias="mdp")
    # shp = ? (maybe show points)
    team_value: float = Field(alias="tv")
    season_placement: int = Field(alias="spl")
    matchday_placement: int = Field(alias="mdpl")
    # profile active
    profile_active: bool = Field(default=True, alias="pa")
    # lineup player IDs
    lineup_player_ids: list[int | None] = Field(default_factory=list, alias="lp")
    # is auto-pilot?
    is_auto_pilot: bool = Field(default=False, alias="iapl")

    model_config = {"populate_by_name": True}


class KickbaseRankingResponse(BaseModel):
    """Response from /leagues/{id}/ranking"""
    users: list[KickbaseRankingUser] = Field(alias="us")
    matchday: int = Field(alias="day")
    competition_id: str = Field(alias="cpi")
    league_name: str = Field(default="", alias="ti")
    # Other fields we might need later
    season: str = Field(default="", alias="sn")  # e.g. "25/26"
    is_live: bool = Field(default=False, alias="il")

    model_config = {"populate_by_name": True}
