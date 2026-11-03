import os
from typing import Any, Dict

import httpx
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from cachetools import TTLCache

from app.core.config import settings

security = HTTPBearer(auto_error=False)

_jwks_cache = TTLCache(maxsize=1, ttl=300)
_jwks_lock = None


def _get_jwks_lock():
    import asyncio

    global _jwks_lock
    if _jwks_lock is None:
        _jwks_lock = asyncio.Lock()
    return _jwks_lock


async def _fetch_jwks() -> Dict[str, Any]:
    if not settings.CLERK_JWKS_URL:
        raise HTTPException(status_code=503, detail="JWKS not configured")
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(3.0, connect=2.0)) as client:
            resp = await client.get(settings.CLERK_JWKS_URL)
            resp.raise_for_status()
            return resp.json()
    except Exception:
        raise HTTPException(status_code=503, detail="Unable to fetch JWKS")


async def get_jwks() -> Dict[str, Any]:
    if "jwks" in _jwks_cache:
        return _jwks_cache["jwks"]
    lock = _get_jwks_lock()
    async with lock:
        if "jwks" in _jwks_cache:
            return _jwks_cache["jwks"]
        jwks = await _fetch_jwks()
        _jwks_cache["jwks"] = jwks
        return jwks


def _get_key(kid: str, jwks: Dict[str, Any]):
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    return None


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = credentials.credentials
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        jwks = await get_jwks()
        key = _get_key(kid, jwks) if kid else None
        if not key:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        payload = jwt.decode(
            token,
            key,
            algorithms=[key.get("alg", "RS256")],
            issuer=settings.CLERK_ISSUER or None,
            audience=settings.CLERK_AUDIENCE or None,
            options={"verify_aud": bool(settings.CLERK_AUDIENCE)},
        )
        return payload
    except HTTPException:
        raise
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth unavailable")
