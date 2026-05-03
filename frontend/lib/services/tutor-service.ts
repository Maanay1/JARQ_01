import { apiRequest } from "@/lib/services/api-client";
import { PersonaId, ProviderId, TutorChatResponse } from "@/lib/types";

export async function sendTutorMessage(params: {
  message: string;
  personaId: PersonaId;
  provider: ProviderId;
}): Promise<TutorChatResponse> {
  return apiRequest<TutorChatResponse>("/api/v1/tutor/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      learner: {
        user_id: "demo-user",
        display_name: "Bayel",
        level: "beginner",
        target_language: "English",
        native_language: "Russian",
        interests: ["music", "travel", "technology"],
      },
      message: params.message,
      persona_id: params.personaId,
      provider: params.provider,
      include_memory: true,
    }),
  });
}
