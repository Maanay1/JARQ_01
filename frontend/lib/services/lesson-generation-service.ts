import { sendTutorMessage } from "@/lib/services/tutor-service";
import { buildMaanayLessonPrompt, MaanayLessonPromptParams } from "@/lib/maanay-lesson-prompt";
import { ProviderId, TutorChatResponse } from "@/lib/types";

type GenerateMaanayLessonParams = MaanayLessonPromptParams & {
  provider?: ProviderId;
};

export async function generateMaanayLessonJson({
  provider = "openrouter",
  ...promptParams
}: GenerateMaanayLessonParams): Promise<TutorChatResponse> {
  return sendTutorMessage({
    provider,
    personaId: "jarq_hana",
    message: buildMaanayLessonPrompt(promptParams),
  });
}
