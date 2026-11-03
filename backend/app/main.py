from fastapi import FastAPI, Request
from app.core.logging import configure_logging
configure_logging()
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import router as api_router
from app.core.config import settings
from app.core.errors import APIError
from app.core import redis as redis_core
from app.core import db as db_core

app = FastAPI(
    title="EdTech Assistant API",
    version="0.1.0",
    description="API for EdTech Assistant - AI-powered math tutoring platform",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)


@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            },
            "request_id": getattr(request.state, "request_id", None),
        },
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    import logging

    logging.getLogger("app").exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
            },
            "request_id": getattr(request.state, "request_id", None),
        },
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/livez")
def livez():
    return {"status": "ok"}


@app.get("/readyz")
def readyz():
    db_ok = True
    try:
        with db_core.engine.connect() as conn:
            conn.execute(db_core.Base.metadata.tables.get('users') and __import__('sqlalchemy').text('SELECT 1') or __import__('sqlalchemy').text('SELECT 1'))
    except Exception:
        db_ok = False
    redis_ok = True
    try:
        r = redis_core.get_redis()
        if r is None:
            redis_ok = False
        else:
            r.ping()
    except Exception:
        redis_ok = False
    if not db_ok or not redis_ok:
        return JSONResponse(status_code=503, content={"status": "unhealthy", "db": db_ok, "redis": redis_ok})
    return {"status": "ok", "db": True, "redis": True}


@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    import uuid
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


@app.on_event("startup")
async def startup():
    try:
        settings.validate()
    except Exception:
        if settings.ENVIRONMENT == "production":
            raise


from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from fastapi.responses import Response


@app.get("/metrics")
def metrics():
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)
