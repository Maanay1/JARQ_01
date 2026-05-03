from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from app.models.voice_models import (
    SpeakingPracticeResponse,
    SpeakingPracticeScore,
    VoiceChatResponse,
    VoiceJARQResponse,
    VoiceSynthesisRequest,
    VoiceSynthesisResponse,
    VoiceTranscriptionRequest,
    VoiceTranscriptionResponse,
)
from app.services.ai_service import AIService
from app.services.memory.context import LearningContextService, get_learning_context
from app.services.persona_service import PersonaService


class VoiceService:
    """Voice adapter layer for speech-to-text, text-to-speech and voice chat.

    The public methods are wired today with safe stubs. The adapter method names
    are intentionally stable so Whisper, OpenAI TTS or ElevenLabs can be plugged in
    without changing FastAPI routes.
    """

    def __init__(
        self,
        ai_service: AIService | None = None,
        persona_service: PersonaService | None = None,
        upload_dir: Path | None = None,
    ) -> None:
        self.ai_service = ai_service or AIService()
        self.persona_service = persona_service or PersonaService()
        self.upload_dir = upload_dir or Path("backend/uploads")
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def transcribe(self, request: VoiceTranscriptionRequest) -> VoiceTranscriptionResponse:
        return VoiceTranscriptionResponse(
            text="Voice transcription is not connected yet.",
            language=request.language,
        )

    async def synthesize(self, request: VoiceSynthesisRequest) -> VoiceSynthesisResponse:
        return VoiceSynthesisResponse(status=f"TTS is not connected yet for voice '{request.voice_id}'.")

    async def voice_chat(
        self,
        audio_bytes: bytes,
        filename: str,
        user_id: str,
        persona_id: str = "jarq_classic",
        course_id: str | None = None,
        lesson_id: str | None = None,
    ) -> VoiceChatResponse:
        audio_path = await self.save_upload(audio_bytes, filename)
        transcript = await self.speech_to_text(audio_path)
        persona = self.persona_service.get_persona(persona_id)
        learning_context = await get_learning_context(user_id, course_id=course_id, lesson_id=lesson_id)
        learning_context["input_mode"] = "voice"

        jarq = await self.ai_service.generate_response(
            user_message=transcript,
            persona=persona.model_dump(),
            chat_history=[],
            learning_context=learning_context,
        )
        memory_service = LearningContextService()
        await memory_service.save_chat_turn(
            user_id=user_id,
            user_message=transcript,
            ai_response=jarq.text,
            persona_id=persona.id,
            emotion=jarq.emotion,
        )
        await memory_service.remember_preferences(
            user_id=user_id,
            preferred_persona=persona.id,
            current_course=course_id,
        )
        audio_url = await self.text_to_speech(jarq.text, persona.voice_style)

        return VoiceChatResponse(
            transcript=transcript,
            jarq=VoiceJARQResponse(
                text=jarq.text,
                emotion=jarq.emotion,
                tone=jarq.tone,
                action=jarq.action,
            ),
            audio_url=audio_url,
        )

    async def speaking_practice(
        self,
        user_id: str,
        topic: str,
        audio_bytes: bytes | None = None,
        filename: str = "speaking.webm",
    ) -> SpeakingPracticeResponse:
        transcript = ""
        if audio_bytes:
            audio_path = await self.save_upload(audio_bytes, filename)
            transcript = await self.speech_to_text(audio_path)

        learning_context = await get_learning_context(user_id)
        learning_context["input_mode"] = "speaking_practice"
        learning_context["speaking_topic"] = topic

        ai_response = await self.ai_service.generate_speaking_practice_response(
            topic=topic,
            transcript=transcript,
            learning_context=learning_context,
        )

        if transcript:
            memory_service = LearningContextService()
            await memory_service.save_chat_turn(
                user_id=user_id,
                user_message=transcript,
                ai_response=ai_response.reply,
                persona_id=str(learning_context.get("preferred_persona", "jarq_classic")),
                emotion="calm",
            )

        return SpeakingPracticeResponse(
            reply=ai_response.reply,
            corrections=ai_response.corrections,
            better_version=ai_response.better_version,
            score=SpeakingPracticeScore.model_validate(ai_response.score.model_dump()),
            next_question=ai_response.next_question,
        )

    async def save_upload(self, audio_bytes: bytes, filename: str) -> Path:
        extension = Path(filename).suffix or ".webm"
        safe_path = self.upload_dir / f"{uuid4()}{extension}"
        safe_path.write_bytes(audio_bytes)
        return safe_path

    async def speech_to_text(self, audio_path: Path) -> str:
        """STT adapter placeholder.

        Future implementations can call OpenAI Whisper, local Whisper.cpp,
        Gemini audio, or another provider using keys from .env.
        """

        return f"Speech-to-text is not connected yet. Received audio file: {audio_path.name}"

    async def text_to_speech(self, text: str, voice_style: str) -> str:
        """TTS adapter placeholder.

        Future implementations can call OpenAI TTS or ElevenLabs using keys from .env.
        """

        audio_id = uuid4()
        output_path = self.upload_dir / f"{audio_id}.txt"
        output_path.write_text(
            f"Voice style: {voice_style}\n\n{text}",
            encoding="utf-8",
        )
        return f"/uploads/{output_path.name}"


def get_voice_service() -> VoiceService:
    return VoiceService()
