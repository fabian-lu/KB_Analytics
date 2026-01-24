"""
Pydantic models for parsing Kickbase authentication responses.

These models handle Kickbase's compressed field names (e.g., "i" for id, "tkn" for token).
They are INTERNAL - used to parse Kickbase responses, not returned to our frontend.

For API response models (what we return to frontend), see app/models/
"""

from pydantic import BaseModel, Field


class KickbaseUser(BaseModel):
    """User info from Kickbase login response."""

    # Field(alias="x") maps Kickbase's short names to readable names
    # e.g., Kickbase sends {"i": "123"} → we access it as user.id
    id: str = Field(alias="i")
    name: str = Field(alias="n")
    email: str | None = Field(default=None, alias="em")
    profile_image: str | None = Field(default=None, alias="pi")

    # populate_by_name=True allows using EITHER alias or field name:
    # KickbaseUser(**{"i": "123"})  → works (from Kickbase JSON)
    # KickbaseUser(id="123")        → also works (in our own code)
    model_config = {"populate_by_name": True}


class KickbaseLeague(BaseModel):
    """League summary from Kickbase login response."""

    id: str = Field(alias="i")
    name: str = Field(alias="n")
    member_count: int | None = Field(default=None, alias="mc")

    model_config = {"populate_by_name": True}


class KickbaseLoginResponse(BaseModel):
    """Raw response from Kickbase /user/login endpoint."""

    token: str = Field(alias="tkn")
    token_exp: str | None = Field(default=None, alias="tknExp")
    user: KickbaseUser = Field(alias="u")
    leagues: list[KickbaseLeague] = Field(default_factory=list, alias="srvl")

    model_config = {"populate_by_name": True}
