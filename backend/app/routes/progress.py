from fastapi import APIRouter, Depends

from app.models.progress_models import MistakeEvent, StreakUpdateRequest, UserProgressResponse, XPUpdateRequest
from app.services.progress_service import ProgressService, get_progress_service

router = APIRouter(tags=["progress"])


@router.get("/progress/{user_id}", response_model=UserProgressResponse)
async def get_user_progress(
    user_id: str,
    progress_service: ProgressService = Depends(get_progress_service),
) -> UserProgressResponse:
    return await progress_service.get_user_progress(user_id)


@router.get("/progress/{user_id}/mistakes", response_model=list[MistakeEvent])
async def list_user_mistakes(
    user_id: str,
    progress_service: ProgressService = Depends(get_progress_service),
) -> list[MistakeEvent]:
    return await progress_service.list_mistakes(user_id)


@router.get("/users/{user_id}/progress", response_model=UserProgressResponse)
async def get_user_learning_progress(
    user_id: str,
    progress_service: ProgressService = Depends(get_progress_service),
) -> UserProgressResponse:
    return await progress_service.get_user_progress(user_id)


@router.get("/users/{user_id}/mistakes", response_model=list[MistakeEvent])
async def get_user_mistakes(
    user_id: str,
    progress_service: ProgressService = Depends(get_progress_service),
) -> list[MistakeEvent]:
    return await progress_service.list_mistakes(user_id)


@router.post("/users/{user_id}/xp", response_model=UserProgressResponse)
async def add_user_xp(
    user_id: str,
    request: XPUpdateRequest,
    progress_service: ProgressService = Depends(get_progress_service),
) -> UserProgressResponse:
    return await progress_service.add_xp(user_id, request.amount)


@router.post("/users/{user_id}/streak", response_model=UserProgressResponse)
async def update_user_streak(
    user_id: str,
    request: StreakUpdateRequest,
    progress_service: ProgressService = Depends(get_progress_service),
) -> UserProgressResponse:
    return await progress_service.update_streak(user_id, request.increment)
