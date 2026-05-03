from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routes.chat import router as chat_router
from app.routes.lessons import router as lessons_router
from app.routes.personas import router as personas_router
from app.routes.progress import router as progress_router
from app.routes.voice import router as voice_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="JARQ AI Tutor API",
        version="0.1.0",
        description="Personal AI tutor backend with memory, personas and pluggable AI providers.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_prefix = "/api/v1"
    app.include_router(chat_router, prefix=api_prefix)
    app.include_router(voice_router, prefix=api_prefix)
    app.include_router(personas_router, prefix=api_prefix)
    app.include_router(lessons_router, prefix=api_prefix)
    app.include_router(progress_router, prefix=api_prefix)
    app.include_router(chat_router)
    app.include_router(voice_router)
    app.include_router(personas_router)
    app.include_router(lessons_router)
    app.include_router(progress_router)

    uploads_dir = Path("backend/uploads")
    uploads_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
    return app


app = create_app()
