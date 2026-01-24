"""
Authentication API endpoints.

This module handles user authentication via Kickbase.
"""

from fastapi import APIRouter

# Kickbase client + models for parsing their API responses
from app.kickbase import KickbaseClient, KickbaseLoginResponse

# Our API models (clean format for frontend)
from app.models.auth import (
    LoginRequest,
    LoginResponse,
    User,
    League,
)

# Create a router - groups related endpoints together
# This router is imported in main.py and added to the app
router = APIRouter()


@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        # These appear in Swagger UI under "Responses"
        401: {"description": "Invalid email or password"},
        502: {"description": "Kickbase API error (network, server down, etc.)"},
    },
)
async def login(request: LoginRequest) -> LoginResponse:
    """
    Authenticate with Kickbase.

    - **email**: Your Kickbase account email
    - **password**: Your Kickbase account password

    Returns a token that should be stored by the frontend and sent with future requests.

    The token is NOT stored on our server - we just pass it through from Kickbase.
    """
    # Create a fresh client (no token yet - we're logging in)
    client = KickbaseClient()

    # Call Kickbase login endpoint
    # Kickbase expects: {"em": email, "pass": password, "ext": false}
    # If this fails, global exception handlers in main.py catch it
    raw_response = await client.post(
        "/user/login",
        data={
            "em": request.email,
            "pass": request.password,
            "ext": False,  # Don't extend session (we manage our own)
        },
    )

    # Parse Kickbase's response
    # raw_response is a dict with weird short field names like {"tkn": "...", "u": {...}}
    # KickbaseLoginResponse knows how to parse these (via Field aliases)
    kickbase_response = KickbaseLoginResponse.model_validate(raw_response)

    # Transform to our clean response format
    # We convert from Kickbase's format to our own clean format for the frontend
    return LoginResponse(
        token=kickbase_response.token,
        user=User(
            id=kickbase_response.user.id,
            name=kickbase_response.user.name,
            email=kickbase_response.user.email,
            profile_image=kickbase_response.user.profile_image,
        ),
        leagues=[
            League(
                id=league.id,
                name=league.name,
                member_count=league.member_count,
            )
            for league in kickbase_response.leagues
        ],
    )
