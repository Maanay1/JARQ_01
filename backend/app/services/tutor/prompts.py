from app.schemas.tutor import TutorChatRequest
from app.services.ai.messages import AIMessage
from app.services.tutor.personas import TutorPersona


def build_tutor_messages(
    request: TutorChatRequest,
    persona: TutorPersona,
    memories: list[str],
) -> list[AIMessage]:
    learner = request.learner
    memory_block = "\n".join(f"- {memory}" for memory in memories) or "- No saved memories yet."

    system_prompt = f"""
You are JARQ, an adaptive AI tutor.

Persona:
{persona.system_style}

Learner profile:
- Name: {learner.display_name or learner.user_id}
- Level: {learner.level}
- Target language: {learner.target_language}
- Native language: {learner.native_language}
- Interests: {", ".join(learner.interests) or "unknown"}

Relevant long-term memory:
{memory_block}

Teaching rules:
- Be concise, emotionally intelligent and useful.
- Correct mistakes kindly.
- Give one tiny practice task at the end.
- Adapt examples to the learner profile and memory.
- Reply in the learner's native language when explaining hard concepts.
""".strip()

    return [
        AIMessage(role="system", content=system_prompt),
        AIMessage(role="user", content=request.message),
    ]
