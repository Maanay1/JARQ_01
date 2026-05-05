import { BookOpen, Braces, BriefcaseBusiness, Code2, Crown, Globe2, LockKeyhole, MessageCircle, Mic, PenTool, Sparkles, Trophy, type LucideIcon } from "lucide-react";

export type LearningTrackId = "english" | "programming";

export type LearningLevel = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  locked?: boolean;
  icon: LucideIcon;
};

export type LearningTrack = {
  id: LearningTrackId;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  icon: LucideIcon;
  stats: string[];
  levels: LearningLevel[];
};

export const learningTracks: LearningTrack[] = [
  {
    id: "english",
    title: "Английский язык",
    subtitle: "От первых слов до свободной речи",
    description: "Игровой путь с диалогами, произношением, словарём и живыми объяснениями Маания.",
    href: "/courses/english",
    accent: "from-cyan-300 to-blue-500",
    icon: Globe2,
    stats: ["7 уровней", "живые диалоги", "голосовая практика"],
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        description: "Алфавит, звуки, первые слова",
        xp: 120,
        progress: 42,
        icon: Sparkles,
      },
      {
        id: "elementary",
        title: "Elementary",
        description: "Базовые фразы, приветствия, числа",
        xp: 180,
        progress: 18,
        icon: MessageCircle,
      },
      {
        id: "pre-intermediate",
        title: "Pre-Intermediate",
        description: "Времена, простые диалоги",
        xp: 240,
        progress: 0,
        locked: true,
        icon: PenTool,
      },
      {
        id: "intermediate",
        title: "Intermediate",
        description: "Сложные темы, идиомы",
        xp: 320,
        progress: 0,
        locked: true,
        icon: BookOpen,
      },
      {
        id: "upper-intermediate",
        title: "Upper-Intermediate",
        description: "Бизнес английский, акценты",
        xp: 420,
        progress: 0,
        locked: true,
        icon: BriefcaseBusiness,
      },
      {
        id: "advanced",
        title: "Advanced",
        description: "Свободная речь, литература",
        xp: 560,
        progress: 0,
        locked: true,
        icon: Mic,
      },
      {
        id: "proficiency",
        title: "Proficiency",
        description: "Уровень носителя",
        xp: 760,
        progress: 0,
        locked: true,
        icon: Crown,
      },
    ],
  },
  {
    id: "programming",
    title: "Программирование",
    subtitle: "Код как понятный навык",
    description: "От алгоритмов без языка до Python, Web и Full Stack через короткие code-квесты.",
    href: "/courses/programming",
    accent: "from-purple-300 to-fuchsia-500",
    icon: Code2,
    stats: ["7 уровней", "code-квесты", "проверка ответов"],
    levels: [
      {
        id: "fundamentals",
        title: "Основы",
        description: "Что такое код, алгоритмы, переменные",
        xp: 120,
        progress: 34,
        icon: Sparkles,
      },
      {
        id: "python-beginner",
        title: "Python Beginner",
        description: "print, переменные, if/else",
        xp: 180,
        progress: 8,
        icon: Braces,
      },
      {
        id: "python-elementary",
        title: "Python Elementary",
        description: "циклы, функции, списки",
        xp: 260,
        progress: 0,
        locked: true,
        icon: Code2,
      },
      {
        id: "web-basics",
        title: "Web Basics",
        description: "HTML, CSS основы",
        xp: 320,
        progress: 0,
        locked: true,
        icon: Globe2,
      },
      {
        id: "javascript",
        title: "JavaScript",
        description: "интерактивность",
        xp: 420,
        progress: 0,
        locked: true,
        icon: Braces,
      },
      {
        id: "python-intermediate",
        title: "Python Intermediate",
        description: "ООП, файлы, API",
        xp: 560,
        progress: 0,
        locked: true,
        icon: BookOpen,
      },
      {
        id: "full-stack",
        title: "Full Stack",
        description: "соединяем всё вместе",
        xp: 760,
        progress: 0,
        locked: true,
        icon: Trophy,
      },
    ],
  },
];

export function getLearningTrack(trackId: string): LearningTrack | undefined {
  return learningTracks.find((track) => track.id === trackId);
}

export function userLevelFromXp(xp: number): string {
  if (xp >= 2500) return "Легенда";
  if (xp >= 1400) return "Мастер";
  if (xp >= 700) return "Практик";
  if (xp >= 200) return "Ученик";
  return "Новичок";
}

export const lockedIcon = LockKeyhole;
