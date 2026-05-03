from __future__ import annotations

from pydantic import BaseModel, Field


class VoiceTranscriptionRequest(BaseModel):
    audio_base64: str = Field(min_length=1)
    language: str | None = None


class VoiceTranscriptionResponse(BaseModel):
    text: str
    language: str | None = None
    status: str = "stub"


class VoiceSynthesisRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    voice_id: str = "default"
    emotion: str | None = None


class VoiceSynthesisResponse(BaseModel):
    audio_url: str | None = None
    audio_base64: str | None = None
    status: str = "stub"


class VoiceJARQResponse(BaseModel):
    text: str
    emotion: str
    tone: str
    action: str


class VoiceChatResponse(BaseModel):
    transcript: str
    jarq: VoiceJARQResponse
    audio_url: str


class SpeakingPracticeScore(BaseModel):
    grammar: int = Field(ge=0, le=100)
    vocabulary: int = Field(ge=0, le=100)
    fluency: int = Field(ge=0, le=100)
    pronunciation: int = Field(ge=0, le=100)


class SpeakingPracticeResponse(BaseModel):
    reply: str
    corrections: list[str] = Field(default_factory=list)
    better_version: str
    score: SpeakingPracticeScore
    next_question: str
