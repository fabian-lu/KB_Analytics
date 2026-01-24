"""
Pydantic models for parsing Kickbase squad responses.

For API response models (what we return to frontend), see app/models/
"""

from pydantic import BaseModel, Field


class KickbaseSquadPlayer(BaseModel):
    """Single player from /leagues/{id}/squad"""
    id: str = Field(alias="i")
    name: str = Field(alias="n")
    position: int = Field(alias="pos")  # 1=GK, 2=DEF, 3=MID, 4=FWD
    market_value: int = Field(alias="mv")
    market_value_trend: int = Field(default=0, alias="mvt")  # 0=same, 1=up, 2=down
    market_value_gain_loss: int = Field(default=0, alias="mvgl")  # total gain/loss since purchase
    total_points: int = Field(default=0, alias="p")
    avg_points: int = Field(default=0, alias="ap")
    team_id: str = Field(alias="tid")
    profile_image: str = Field(alias="pim")

    # Status fields
    status: int = Field(default=0, alias="st")  # injury/suspension status
    last_status: int = Field(default=0, alias="lst")
    matchday_status: int = Field(default=0, alias="mdst")
    status_list: list[int] = Field(default_factory=list, alias="stl")

    # Lineup order (0 = not in lineup, 1-11 = starting position)
    lineup_order: int = Field(default=0, alias="lo")

    # Other fields
    is_on_transfer_market: bool = Field(default=False, alias="iotm")
    offer_count: int = Field(default=0, alias="ofc")
    probability: int = Field(default=0, alias="prob")  # probability to play?

    model_config = {"populate_by_name": True}


class KickbaseSquadResponse(BaseModel):
    """Response from /leagues/{id}/squad"""
    players: list[KickbaseSquadPlayer] = Field(alias="it")

    model_config = {"populate_by_name": True}
