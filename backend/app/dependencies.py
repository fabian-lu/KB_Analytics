"""
FastAPI dependencies.

Dependencies are reusable functions that run before endpoints.
Use them with: token: str = Depends(get_token)
"""

from fastapi import Header, HTTPException


async def get_token(authorization: str = Header(...)) -> str:
    """
    Extract and validate token from Authorization header.

    Expects header format: "Bearer <token>"

    Usage:
        @router.get("/something")
        async def endpoint(token: str = Depends(get_token)):
            # token is ready to use
            client = KickbaseClient(token=token)

    Raises:
        HTTPException 401 if header is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization header format. Expected: Bearer <token>"
        )

    # Extract token (remove "Bearer " prefix)
    token = authorization[7:]  # len("Bearer ") = 7

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Empty token"
        )

    return token
