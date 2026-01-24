"""API endpoints package."""

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.public import router as public_router

__all__ = ["auth_router", "dashboard_router", "public_router"]
