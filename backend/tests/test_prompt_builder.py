from app.schemas.tutor import LearnerProfile, TutorChatRequest
from app.services.tutor.personas import get_persona
from app.services.tutor.prompts import build_tutor_messages


def test_prompt_contains_profile_and_memory() -> None:
    request = TutorChatRequest(
        learner=LearnerProfile(
            user_id="u1",
            display_name="Aida",
            interests=["music"],
        ),
        message="Hello",
    )

    messages = build_tutor_messages(request, get_persona("friendly_coach"), ["likes jazz"])

    assert messages[0].role == "system"
    assert "Aida" in messages[0].content
    assert "likes jazz" in messages[0].content
    assert messages[1].content == "Hello"
