"""
Pydantic models for OpenLigaDB table responses.

Endpoint: /getbltable/{league}/{season}
"""

from pydantic import BaseModel, Field


class OpenLigaTeamStanding(BaseModel):
    """Single team from /getbltable/{league}/{season}"""

    team_id: int = Field(alias="teamInfoId")
    team_name: str = Field(alias="teamName")
    short_name: str = Field(alias="shortName")
    team_icon_url: str = Field(alias="teamIconUrl")

    points: int
    matches: int
    won: int
    draw: int
    lost: int
    goals: int
    opponent_goals: int = Field(alias="opponentGoals")
    goal_diff: int = Field(alias="goalDiff")

    model_config = {"populate_by_name": True}
