"""
Kickbase API response models package.

These models parse Kickbase's compressed JSON field names.
For API response models (what we return to frontend), see app/models/
"""

from app.kickbase.models.auth import (
    KickbaseLeague,
    KickbaseLoginResponse,
    KickbaseUser,
)
from app.kickbase.models.league import (
    KickbaseLeagueMe,
    KickbaseRankingResponse,
    KickbaseRankingUser,
    KickbaseTeamPlayerCount,
)
from app.kickbase.models.lineup import (
    KickbaseLineupOverviewPlayer,
    KickbaseLineupOverviewResponse,
    KickbaseLineupPlayer,
    KickbaseLineupResponse,
)
from app.kickbase.models.squad import (
    KickbaseSquadPlayer,
    KickbaseSquadResponse,
)

__all__ = [
    # Auth models
    "KickbaseUser",
    "KickbaseLeague",
    "KickbaseLoginResponse",
    # League models
    "KickbaseLeagueMe",
    "KickbaseTeamPlayerCount",
    "KickbaseRankingUser",
    "KickbaseRankingResponse",
    # Squad models
    "KickbaseSquadPlayer",
    "KickbaseSquadResponse",
    # Lineup models
    "KickbaseLineupPlayer",
    "KickbaseLineupResponse",
    "KickbaseLineupOverviewPlayer",
    "KickbaseLineupOverviewResponse",
]
