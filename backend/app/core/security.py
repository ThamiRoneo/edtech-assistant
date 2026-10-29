import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from functools import lru_cache

from app.core.config import settings
from app.core.errors import UnauthorizedError

security = HTTPBearer()


@lru_cache
def get_jwks():
    if not settings.CLERK_JWKS_URL:
        raise HTTPException(status_code=500, detail="CLERK_JWKS_URL not configured")
    resp = httpx.get(settings.CLERK_JWKS_URL)
    resp.raise_for_status()
    return resp.json()


async def get_current_user(clerk_data: HTTPAuthorizationCredentials = Depends(security)):
    token = clerk_data.credentials
    try:
        jwks = get_jwks()
        unverified_header = jwt.get_unverified_header(token)
        key = next((k for k in jwks.get("keys", []) if k["kid"] == unverified_header["kid"]), None)
        if not key:
            raise UnauthorizedError("Invalid token")
        payload = jwt.decode(token, key, algorithms=["RS256"], options={"verify_aud": False})
        return payload
    except UnauthorizedError:
        raise
    except Exception as e:
        raise UnauthorizedError("Invalid or expired token")
