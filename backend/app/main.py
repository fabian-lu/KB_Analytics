"""
FastAPI application entry point.

This is where everything comes together:
- Create the FastAPI app
- Include routers (groups of endpoints from other files)
- Define any top-level routes
- Register global exception handlers
- Configure logging

When uvicorn runs "app.main:app", it loads this file and uses the `app` object.
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api import auth_router, dashboard_router, public_router

# --- Logging Configuration ---
# LOG_LEVEL env var controls verbosity: DEBUG (dev) or INFO (prod)
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

from app.kickbase import (
    AuthenticationError,
    AuthorizationError,
    KickbaseError,
    NotFoundError,
    RateLimitError,
)
from app.openliga.exceptions import OpenLigaError

# --- Lifespan (startup/shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    logger.info(f"Backend starting up (log_level={log_level})")
    yield
    logger.info("Backend shutting down")


# Create the FastAPI application
# These settings appear in the Swagger UI at /docs
app = FastAPI(
    title="Kickbase Analytics API",
    description="Backend for Kickbase fantasy football analytics",
    version="0.1.0",
    lifespan=lifespan,
)

# --- Global Exception Handlers ---
# These catch exceptions from ANY endpoint, so we don't repeat try/except everywhere


@app.exception_handler(AuthenticationError)
async def auth_error_handler(request: Request, exc: AuthenticationError):
    """Handle 401 - invalid credentials or expired token."""
    logger.error(f"Auth error on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=401,
        content={"detail": "Invalid credentials or token expired"}
    )


@app.exception_handler(AuthorizationError)
async def authz_error_handler(request: Request, exc: AuthorizationError):
    """Handle 403 - not allowed to access resource."""
    logger.error(f"Access denied on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=403,
        content={"detail": "Access denied"}
    )


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError):
    """Handle 404 - resource not found in Kickbase."""
    logger.error(f"Not found on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )


@app.exception_handler(RateLimitError)
async def rate_limit_handler(request: Request, exc: RateLimitError):
    """Handle 429 - Kickbase rate limit hit."""
    logger.error(f"Rate limit on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Try again later."}
    )


@app.exception_handler(KickbaseError)
async def kickbase_error_handler(request: Request, exc: KickbaseError):
    """Handle any other Kickbase error (network, server, etc.)."""
    logger.error(f"Kickbase error on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=502,
        content={"detail": f"Kickbase error: {exc.message}"}
    )


@app.exception_handler(OpenLigaError)
async def openliga_error_handler(request: Request, exc: OpenLigaError):
    """Handle any OpenLigaDB error (network, server, etc.)."""
    logger.error(f"OpenLigaDB error on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=502,
        content={"detail": f"OpenLigaDB error: {exc.message}"}
    )


# --- Routers ---
# Include routers from api/ folder
# tags=[] groups endpoints in Swagger UI
# prefix="" adds URL prefix (e.g., /api/dashboard)
app.include_router(auth_router, tags=["auth"])
app.include_router(dashboard_router, prefix="/api", tags=["dashboard"])
app.include_router(public_router, prefix="/api", tags=["public"])


# --- Health Check ---
@app.get("/health")
async def health_check():
    """Check if the API is running."""
    return {"status": "ok"}
