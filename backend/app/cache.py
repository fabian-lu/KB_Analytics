"""
Redis caching utilities.

Provides:
- Redis connection management
- @cached decorator for easy function caching
"""

import hashlib
import json
import logging
import os
from functools import wraps
from typing import Any, Callable, get_args, get_origin, get_type_hints

import redis.asyncio as redis
from pydantic import BaseModel

logger = logging.getLogger(__name__)

# Redis connection (created on first use)
_redis_client: redis.Redis | None = None


async def get_redis() -> redis.Redis:
    """
    Get Redis connection (creates one if needed).

    Uses REDIS_URL from environment, defaults to localhost.
    """
    global _redis_client

    if _redis_client is None:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        _redis_client = redis.from_url(redis_url, decode_responses=True)

    return _redis_client


def _make_cache_key(func_name: str, args: tuple, kwargs: dict) -> str:
    """
    Generate a unique cache key from function name and arguments.

    Example: "get_squad:league123:abc123hash"
    """
    # Combine args and kwargs into a string
    key_parts = [func_name]

    # Add positional args
    for arg in args:
        key_parts.append(str(arg))

    # Add keyword args (sorted for consistency)
    for k, v in sorted(kwargs.items()):
        # Skip 'token' - we don't want to cache per-token
        # (same data regardless of who requests it)
        if k == "token":
            continue
        key_parts.append(f"{k}:{v}")

    # Join with colons
    key = ":".join(key_parts)

    # If key is too long, hash it
    if len(key) > 200:
        key_hash = hashlib.md5(key.encode()).hexdigest()
        key = f"{func_name}:{key_hash}"

    return key


def cached(ttl: int = 300):
    """
    Decorator to cache function results in Redis.

    Args:
        ttl: Time to live in seconds (default 5 minutes)

    Usage:
        @cached(ttl=300)
        async def get_squad(league_id: str, token: str) -> KickbaseSquadResponse:
            ...

    The cache key is generated from the function name and arguments.
    The 'token' argument is excluded from the key (same data for all users).

    Supports Pydantic models: if the return type is a Pydantic BaseModel,
    it will be properly serialized/deserialized.
    """
    def decorator(func: Callable) -> Callable:
        # Get return type hint to reconstruct Pydantic models on cache hit
        hints = get_type_hints(func)
        return_type = hints.get("return")

        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            # Generate cache key
            cache_key = _make_cache_key(func.__name__, args, kwargs)

            try:
                # Try to get from cache
                redis_client = await get_redis()
                cached_value = await redis_client.get(cache_key)

                if cached_value is not None:
                    # Cache hit - return cached data
                    logger.debug(f"Cache hit: {cache_key}")
                    data = json.loads(cached_value)

                    # If return type is a Pydantic model, reconstruct it
                    if return_type and isinstance(return_type, type) and issubclass(return_type, BaseModel):
                        return return_type.model_validate(data)

                    # If return type is list[PydanticModel], reconstruct each item
                    if get_origin(return_type) is list:
                        item_type = get_args(return_type)[0] if get_args(return_type) else None
                        if item_type and isinstance(item_type, type) and issubclass(item_type, BaseModel):
                            return [item_type.model_validate(item) for item in data]

                    return data

                logger.debug(f"Cache miss: {cache_key}")

            except Exception as e:
                # Redis error - just continue without cache
                logger.warning(f"Redis read error (continuing without cache): {e}")

            # Cache miss - call the actual function
            result = await func(*args, **kwargs)

            try:
                # Store in cache
                redis_client = await get_redis()

                # Serialize result to JSON
                if isinstance(result, BaseModel):
                    # Single Pydantic model
                    cache_data = json.dumps(result.model_dump())
                elif isinstance(result, list) and result and isinstance(result[0], BaseModel):
                    # List of Pydantic models
                    cache_data = json.dumps([item.model_dump() for item in result])
                else:
                    cache_data = json.dumps(result, default=str)

                await redis_client.setex(cache_key, ttl, cache_data)
            except Exception as e:
                # Redis error - just continue without caching
                logger.warning(f"Redis write error (continuing without caching): {e}")

            return result

        return wrapper
    return decorator


async def clear_cache(pattern: str = "*") -> int:
    """
    Clear cached entries matching a pattern.

    Args:
        pattern: Redis key pattern (e.g., "squad:*" to clear all squad caches)

    Returns:
        Number of keys deleted
    """
    redis_client = await get_redis()
    keys = []

    async for key in redis_client.scan_iter(match=pattern):
        keys.append(key)

    if keys:
        return await redis_client.delete(*keys)

    return 0
