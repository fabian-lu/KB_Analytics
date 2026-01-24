"""
Pydantic models for parsing Kickbase lineup responses.

For API response models (what we return to frontend), see app/models/
"""

from pydantic import BaseModel, Field


class KickbaseLineupPlayer(BaseModel):
    """Single player from /leagues/{id}/lineup"""
    id: str = Field(alias="i")
    name: str = Field(alias="n")
    avg_points: int = Field(default=0, alias="ap")
    # lineup_order: None = bench, 0 = goalkeeper, 1-10 = starting position
    lineup_order: int | None = Field(default=None, alias="lo")
    status: int = Field(default=0, alias="st")
    last_status: int = Field(default=0, alias="lst")
    matchday_status: int = Field(default=0, alias="mdst")
    team_id: str = Field(alias="tid")
    position: int = Field(alias="pos")  # 1=GK, 2=DEF, 3=MID, 4=FWD
    opponent_short: str = Field(default="", alias="os")  # e.g., "FCH"
    is_home_team: bool = Field(default=False, alias="ht")
    profile_image: str = Field(alias="pim")
    probability: int = Field(default=0, alias="prob")

    model_config = {"populate_by_name": True}


class KickbaseLineupResponse(BaseModel):
    """Response from /leagues/{id}/lineup"""
    players: list[KickbaseLineupPlayer] = Field(alias="it")

    model_config = {"populate_by_name": True}


class KickbaseLineupOverviewPlayer(BaseModel):
    """Single player from /leagues/{id}/lineup/overview"""
    player_id: str = Field(alias="pi")
    name: str = Field(alias="n")
    status: int = Field(default=0, alias="st")
    last_status: int = Field(default=0, alias="lst")
    matchday_status: int = Field(default=0, alias="mdst")
    position: int = Field(alias="pos")
    lineup_order: int = Field(alias="lo")
    team_id: str = Field(alias="tid")
    avg_points: int = Field(default=0, alias="ap")
    market_value: int = Field(default=0, alias="mv")
    profile_image: str = Field(alias="pim")
    # Match info
    team1_id: str = Field(default="", alias="t1")
    team2_id: str = Field(default="", alias="t2")
    team1_image: str = Field(default="", alias="t1im")
    team2_image: str = Field(default="", alias="t2im")

    model_config = {"populate_by_name": True}


class KickbaseLineupOverviewResponse(BaseModel):
    """Response from /leagues/{id}/lineup/overview (undocumented)"""
    # b = bench count? or something else
    bench_count: int = Field(default=0, alias="b")
    lineup_players: list[KickbaseLineupOverviewPlayer] = Field(alias="lp")
    # lt = lineup teams?
    lineup_teams: list = Field(default_factory=list, alias="lt")
    # t = formation
    formation: str = Field(alias="t")
    # lpc = lineup player count
    lineup_player_count: int = Field(alias="lpc")
    # clpc = ? (challenge lineup player count?)
    clpc: int = Field(default=0, alias="clpc")

    model_config = {"populate_by_name": True}
