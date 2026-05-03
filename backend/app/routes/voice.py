from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.models.voice_models import (
    SpeakingPracticeResponse,
    VoiceChatResponse,
    VoiceSynthesisRequest,
    VoiceSynthesisResponse,
    VoiceTranscriptionRequest,
    VoiceTranscriptionResponse,
)
from app.services.voice_service import VoiceService, get_voice_service

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/transcribe", response_model=VoiceTranscriptionResponse)
async def transcribe_voice(
    request: VoiceTranscriptionRequest,
    voice_service: VoiceService = Depends(get_voice_service),
) -> VoiceTranscriptionResponse:
    return await voice_service.transcribe(request)


@router.post("/synthesize", response_model=VoiceSynthesisResponse)
async def synthesize_voice(
    request: VoiceSynthesisRequest,
    voice_service: VoiceService = Depends(get_voice_service),
) -> VoiceSynthesisResponse:
    return await voice_service.synthesize(request)


@router.post("-chat", response_model=VoiceChatResponse)
async def voice_chat(
    audio: UploadFile = File(...),
    user_id: str = Form(...),
    persona_id: str = Form("jarq_classic"),
    course_id: str | None = Form(None),
    lesson_id: str | None = Form(None),
    voice_service: VoiceService = Depends(get_voice_service),
) -> VoiceChatResponse:
    audio_bytes = await audio.read()
    return await voice_service.voice_chat(
        audio_bytes=audio_bytes,
        filename=audio.filename or "voice.webm",
        user_id=user_id,
        persona_id=persona_id,
        course_id=course_id,
        lesson_id=lesson_id,
    )


@router.post("/speaking-practice", response_model=SpeakingPracticeResponse)
async def speaking_practice(
    user_id: str = Form(...),
    topic: str = Form(...),
    audio: UploadFile | None = File(None),
    voice_service: VoiceService = Depends(get_voice_service),
) -> SpeakingPracticeResponse:
    audio_bytes = await audio.read() if audio is not None else None
    return await voice_service.speaking_practice(
        user_id=user_id,
        topic=topic,
        audio_bytes=audio_bytes,
        filename=audio.filename if audio is not None and audio.filename else "speaking.webm",
    )
