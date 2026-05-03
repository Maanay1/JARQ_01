from fastapi import APIRouter

from app.routes.chat import router as chat_router
from app.routes.lessons import router as lessons_router
from app.routes.personas import router as personas_router
from app.routes.progress import router as progress_router
from app.routes.voice import router as voice_router

# Compatibility router for older imports. New code should import app.routes.*.
router = APIRouter()
router.include_router(chat_router)
router.include_router(voice_router)
router.include_router(personas_router)
router.include_router(lessons_router)
router.include_router(progress_router)
