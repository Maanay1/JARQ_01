export type PersonaId =
  | "jarq_classic"
  | "jarq_bro"
  | "jarq_sensei"
  | "jarq_professor"
  | "jarq_native_speaker"
  | "jarq_hana";
export type ProviderId = "openai" | "openrouter" | "gemini" | "ollama";

export type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TutorChatResponse = {
  reply: string;
  provider: string;
  persona_id: string;
  memory_used: string[];
  suggested_next_steps: string[];
};

export type VoiceChatStatus = "idle" | "recording" | "processing" | "speaking";

export type VoiceChatResponse = {
  transcript: string;
  jarq: {
    text: string;
    emotion: string;
    tone: string;
    action: string;
  };
  audio_url: string;
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  level: string | null;
};

export type LessonTask = {
  id: string;
  lesson_id: string;
  type: string | null;
  question: string;
  correct_answer: string | null;
  explanation: string | null;
  difficulty: string | null;
};

export type Lesson = {
  id: string;
  course_id: string | null;
  title: string;
  content: string | null;
  order_index: number;
  tasks: LessonTask[];
};

export type CheckAnswerResponse = {
  correct: boolean;
  feedback: string;
  emotion: "happy" | "serious" | "funny" | "confused" | "proud" | "calm";
  xp_earned: number;
  explanation: string;
  next_task: LessonTask | null;
};

export type UserMistake = {
  id: string;
  user_id: string;
  subject: string | null;
  mistake: string;
  correction: string | null;
  explanation: string | null;
  created_at: string | null;
};

export type UserProgress = {
  user_id: string;
  level: number;
  xp: number;
  streak: number;
  completed_lessons: number;
  known_mistakes: number;
  weak_topics: string[];
  latest_mistakes: UserMistake[];
  jarq_recommendation: string;
};
