import { apiRequest } from "@/lib/services/api-client";
import { VoiceChatResponse } from "@/lib/types";

export async function sendVoiceChat(params: {
  audio: Blob;
  userId: string;
  personaId?: string;
  courseId?: string | null;
  lessonId?: string | null;
}): Promise<VoiceChatResponse> {
  const formData = new FormData();
  formData.append("audio", params.audio, "voice.webm");
  formData.append("user_id", params.userId);
  formData.append("persona_id", params.personaId ?? "jarq_classic");
  if (params.courseId) formData.append("course_id", params.courseId);
  if (params.lessonId) formData.append("lesson_id", params.lessonId);

  return apiRequest<VoiceChatResponse>("/voice-chat", {
    method: "POST",
    body: formData,
  });
}
