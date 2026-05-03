from __future__ import annotations

import json
from typing import Any, Literal

from pydantic import BaseModel, Field, ValidationError

from app.models.chat_models import TutorChatRequest, TutorChatResponse
from app.services.ai.messages import AIMessage
from app.services.providers.factory import get_provider
from app.services.tutor.orchestrator import TutorOrchestrator


AIEmotion = Literal["happy", "serious", "funny", "confused", "proud", "calm"]
AITone = Literal["friendly", "playful", "strict", "motivational"]
AIAction = Literal["explain", "ask_question", "give_task", "correct_mistake", "casual_talk"]


class JARQStructuredResponse(BaseModel):
    text: str = Field(description="User-facing answer from JARQ.")
    emotion: AIEmotion = "calm"
    tone: AITone = "friendly"
    action: AIAction = "explain"
    lesson_suggestion: str | None = None
    mini_task: str | None = None


class SpeakingPracticeScore(BaseModel):
    grammar: int = Field(ge=0, le=100)
    vocabulary: int = Field(ge=0, le=100)
    fluency: int = Field(ge=0, le=100)
    pronunciation: int = Field(ge=0, le=100)


class SpeakingPracticeAIResponse(BaseModel):
    reply: str
    corrections: list[str] = Field(default_factory=list)
    better_version: str
    score: SpeakingPracticeScore
    next_question: str


class AIService:
    """Universal AI service for JARQ.

    The service accepts product-level tutor context and hides provider details behind
    the existing AI provider abstraction. This keeps OpenAI, Gemini and Ollama
    replaceable without changing route or lesson logic.
    """

    def __init__(self, orchestrator: TutorOrchestrator | None = None) -> None:
        self.orchestrator = orchestrator or TutorOrchestrator()

    async def chat(self, request: TutorChatRequest) -> TutorChatResponse:
        """Compatibility method for the existing tutor endpoint."""

        return await self.orchestrator.chat(request)

    async def generate_response(
        self,
        user_message: str,
        persona: str | dict[str, Any],
        chat_history: list[dict[str, str]] | None = None,
        learning_context: dict[str, Any] | None = None,
        provider_name: str | None = None,
    ) -> JARQStructuredResponse:
        messages = self._build_messages(
            user_message=user_message,
            persona=persona,
            chat_history=chat_history or [],
            learning_context=learning_context or {},
        )
        provider = get_provider(provider_name)
        raw_content = await provider.generate_response(messages)
        return self._parse_structured_response(raw_content)

    async def generate_speaking_practice_response(
        self,
        topic: str,
        transcript: str,
        learning_context: dict[str, Any] | None = None,
        provider_name: str | None = None,
    ) -> SpeakingPracticeAIResponse:
        messages = [
            AIMessage(
                role="system",
                content=self._build_speaking_practice_prompt(topic, learning_context or {}),
            ),
            AIMessage(
                role="user",
                content=transcript.strip() or "Start the speaking practice. Ask me the first question.",
            ),
        ]
        provider = get_provider(provider_name)
        raw_content = await provider.generate_response(messages)
        return self._parse_speaking_practice_response(raw_content, topic)

    def _build_messages(
        self,
        user_message: str,
        persona: str | dict[str, Any],
        chat_history: list[dict[str, str]],
        learning_context: dict[str, Any],
    ) -> list[AIMessage]:
        system_prompt = self._build_system_prompt(persona, learning_context)
        messages = [AIMessage(role="system", content=system_prompt)]

        for history_item in chat_history[-12:]:
            role = history_item.get("role", "user")
            if role not in {"user", "assistant"}:
                continue
            content = history_item.get("content", "").strip()
            if content:
                messages.append(AIMessage(role=role, content=content))

        messages.append(AIMessage(role="user", content=user_message))
        return messages

    def _build_system_prompt(self, persona: str | dict[str, Any], learning_context: dict[str, Any]) -> str:
        persona_text = json.dumps(persona, ensure_ascii=False) if isinstance(persona, dict) else persona
        context_text = json.dumps(learning_context, ensure_ascii=False, indent=2)

        return f"""
You are JARQ, a smart AI tutor with memory, emotions and adaptive teaching.

Persona:
{persona_text}

Learning context:
{context_text}

Return ONLY valid JSON. No markdown, no explanations outside JSON.

JSON schema:
{{
  "text": "ответ JARQ",
  "emotion": "happy | serious | funny | confused | proud | calm",
  "tone": "friendly | playful | strict | motivational",
  "action": "explain | ask_question | give_task | correct_mistake | casual_talk",
  "lesson_suggestion": null или строка,
  "mini_task": null или строка
}}

Rules:
- Be useful, concise and emotionally aware.
- Adapt explanation to the learner context.
- Correct mistakes kindly when needed.
- Use the persona, but never sacrifice learning quality.
- Keep mini_task small enough to complete in one minute.

Natural conversation mode:
- If the user is just chatting, answer like a living character in a warm, natural dialogue.
- If the user is learning, explain like a tutor with simple examples and a clear next step.
- If the user made a mistake, support them first, then correct the mistake gently.
- If the user seems tired, motivate them and make the next step feel small and doable.
- If the user asks for a serious tone, remove jokes and stay focused.
- Ask a natural follow-up question sometimes, especially when it helps keep the conversation alive.
- Use emotions in the response, but do not overperform them.
- Joke only when it fits the situation; never force humor.
- If learning_context.input_mode is "voice", keep "text" shorter and more conversational.
- Do not use many emoji; use at most 1-2 when appropriate.
	""".strip()

    def _build_speaking_practice_prompt(self, topic: str, learning_context: dict[str, Any]) -> str:
        context_text = json.dumps(learning_context, ensure_ascii=False, indent=2)

        return f"""
You are JARQ in Speaking Practice mode.

Topic: {topic}
Learning context:
{context_text}

Supported topics:
- знакомства
- путешествия
- школа
- собеседование
- экзамен
- свободный разговор

Your job:
- Ask natural speaking questions.
- Listen to the learner answer.
- Correct grammar, vocabulary, fluency and pronunciation issues.
- Give a more natural version of the learner's phrase.
- Keep the feedback friendly, short and conversational.
- If there is no learner answer yet, start with a warm first question.
- If the learner made mistakes, support them first, then correct clearly.
- Do not overwhelm the learner.
- Use at most 1 emoji if it genuinely helps.

Return ONLY valid JSON with this exact shape:
{{
  "reply": "...",
  "corrections": ["..."],
  "better_version": "...",
  "score": {{
    "grammar": 0,
    "vocabulary": 0,
    "fluency": 0,
    "pronunciation": 0
  }},
  "next_question": "..."
}}

Score rules:
- Use integers from 0 to 100.
- If this is the first question and there is no learner answer yet, use neutral scores around 70.
- Pronunciation should be estimated from transcript quality unless real speech analysis is available.
""".strip()

    def _parse_structured_response(self, raw_content: str) -> JARQStructuredResponse:
        try:
            return JARQStructuredResponse.model_validate_json(raw_content)
        except ValidationError:
            pass

        extracted_json = self._extract_json_object(raw_content)
        if extracted_json is not None:
            try:
                return JARQStructuredResponse.model_validate(extracted_json)
            except ValidationError:
                pass

        return JARQStructuredResponse(
            text=raw_content.strip() or "I need a moment to rephrase that. Please try again.",
            emotion="calm",
            tone="friendly",
            action="explain",
            lesson_suggestion=None,
            mini_task=None,
        )

    def _extract_json_object(self, raw_content: str) -> dict[str, Any] | None:
        start = raw_content.find("{")
        end = raw_content.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return None

        try:
            parsed = json.loads(raw_content[start : end + 1])
        except json.JSONDecodeError:
            return None

        return parsed if isinstance(parsed, dict) else None

    def _parse_speaking_practice_response(self, raw_content: str, topic: str) -> SpeakingPracticeAIResponse:
        try:
            return SpeakingPracticeAIResponse.model_validate_json(raw_content)
        except ValidationError:
            pass

        extracted_json = self._extract_json_object(raw_content)
        if extracted_json is not None:
            try:
                return SpeakingPracticeAIResponse.model_validate(extracted_json)
            except ValidationError:
                pass

        return SpeakingPracticeAIResponse(
            reply=raw_content.strip() or "Let's practice speaking. I'll keep it simple and useful.",
            corrections=[],
            better_version="",
            score=SpeakingPracticeScore(grammar=70, vocabulary=70, fluency=70, pronunciation=70),
            next_question=self._fallback_speaking_question(topic),
        )

    def _fallback_speaking_question(self, topic: str) -> str:
        questions = {
            "знакомства": "Tell me your name and one thing you like.",
            "путешествия": "Where would you like to travel, and why?",
            "школа": "What subject do you like most at school?",
            "собеседование": "Can you tell me about yourself in two sentences?",
            "экзамен": "What exam topic feels hardest for you right now?",
            "свободный разговор": "What do you want to talk about today?",
        }
        return questions.get(topic, "What would you like to talk about today?")


def get_ai_service() -> AIService:
    return AIService()
