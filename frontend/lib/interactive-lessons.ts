import { Lesson, LessonTask } from "@/lib/types";

export type InteractiveStepType =
  | "explanation"
  | "word_card"
  | "choice"
  | "input"
  | "sentence_builder"
  | "true_false"
  | "matching"
  | "listen_choice"
  | "speak"
  | "mini_dialogue"
  | "code_editor";

export type DialogueTurn = {
  maaniy: string;
  options: string[];
  answer: string;
};

export type InteractiveStep = {
  id: string;
  type: InteractiveStepType;
  title: string;
  maaniy: string;
  prompt: string;
  illustration?: string;
  word?: string;
  pronunciation?: string;
  example?: string;
  options?: string[];
  answer?: string;
  words?: string[];
  pairs?: Array<{ left: string; right: string }>;
  audioText?: string;
  dialogue?: DialogueTurn[];
  starterCode?: string;
  expectedOutput?: string;
  hint?: string;
};

export type InteractiveLesson = {
  id: string;
  courseId: string;
  title: string;
  level: string;
  xpReward: number;
  steps: InteractiveStep[];
};

type LessonBlueprint = {
  id: string;
  courseId: string;
  title: string;
  level: string;
  focus: string;
  words: string[];
  sentence: string;
  answer: string;
  code?: string;
};

const englishBeginner: LessonBlueprint[] = [
  blueprint("english-beginner-alphabet-am", "english", "Алфавит часть 1 (A-M)", "Beginner", "буквы A-M", ["Apple", "Ball", "Cat", "Dog"], "A is for Apple", "Apple"),
  blueprint("english-beginner-alphabet-nz", "english", "Алфавит часть 2 (N-Z)", "Beginner", "буквы N-Z", ["Nose", "Orange", "Pen", "Queen"], "N is for Nose", "Nose"),
  blueprint("english-beginner-vowels", "english", "Гласные и согласные", "Beginner", "vowels and consonants", ["A", "E", "I", "B"], "A, E, I, O, U are vowels", "A"),
  blueprint("english-beginner-numbers-1-10", "english", "Числа 1-10", "Beginner", "numbers 1-10", ["one", "two", "three", "four"], "I have two apples", "two"),
  blueprint("english-beginner-numbers-11-100", "english", "Числа 11-100", "Beginner", "numbers 11-100", ["thirteen", "fourteen", "thirty", "forty"], "Thirty plus ten is forty", "forty"),
  blueprint("english-beginner-colors", "english", "Цвета", "Beginner", "12 basic colors", ["blue", "green", "red", "yellow"], "The sky is blue", "blue"),
  blueprint("english-beginner-greetings", "english", "Приветствия", "Beginner", "greetings", ["Hello", "Good morning", "Good night", "How are you?"], "Hello, how are you?", "Hello"),
  blueprint("english-beginner-introductions", "english", "Знакомство", "Beginner", "introductions", ["name", "old", "from", "years"], "My name is Maaniy", "My name is Maaniy"),
  blueprint("english-beginner-body", "english", "Тело человека", "Beginner", "body parts", ["hand", "eyes", "head", "leg"], "These are my eyes", "eyes"),
  blueprint("english-beginner-family", "english", "Семья", "Beginner", "family", ["mother", "father", "sister", "brother"], "This is my family", "family"),
  blueprint("english-beginner-days-months", "english", "Дни недели и месяцы", "Beginner", "days and months", ["Monday", "Sunday", "January", "December"], "Today is Monday", "Monday"),
  blueprint("english-beginner-final", "english", "Итоговый тест Beginner", "Beginner", "review", ["Hello", "blue", "Monday", "mother"], "Hello, my name is Maaniy", "Hello"),
];

const englishElementary: LessonBlueprint[] = [
  blueprint("english-elementary-to-be", "english", "Глагол TO BE", "Elementary", "am / are / is", ["am", "are", "is", "not"], "I am a student", "am"),
  blueprint("english-elementary-pronouns", "english", "Местоимения и притяжательные", "Elementary", "my / your / his / her", ["my", "your", "his", "their"], "This is my book", "my"),
  blueprint("english-elementary-present-simple", "english", "Present Simple — введение", "Elementary", "daily routine", ["eat", "go", "wakes", "study"], "She wakes up at 7", "wakes"),
  blueprint("english-elementary-present-simple-questions", "english", "Present Simple — отрицание и вопросы", "Elementary", "do / don't", ["do", "don't", "does", "doesn't"], "Do you like tea?", "Do"),
  blueprint("english-elementary-food", "english", "Еда и напитки", "Elementary", "food order", ["coffee", "water", "bread", "rice"], "I would like coffee", "coffee"),
  blueprint("english-elementary-animals", "english", "Животные", "Elementary", "animals", ["cat", "dog", "elephant", "bird"], "The elephant is big", "elephant"),
  blueprint("english-elementary-adjectives", "english", "Прилагательные", "Elementary", "opposites", ["big", "small", "fast", "slow"], "The dog is bigger", "bigger"),
  blueprint("english-elementary-present-continuous", "english", "Present Continuous", "Elementary", "am/is/are + ing", ["eating", "running", "reading", "playing"], "She is running", "running"),
  blueprint("english-elementary-home", "english", "Дом и комнаты", "Elementary", "rooms and prepositions", ["kitchen", "bedroom", "in", "under"], "The cat is under the chair", "under"),
  blueprint("english-elementary-jobs", "english", "Профессии", "Elementary", "jobs", ["student", "teacher", "doctor", "driver"], "I am a student", "student"),
  blueprint("english-elementary-shopping", "english", "Покупки и деньги", "Elementary", "shopping phrases", ["costs", "cheap", "expensive", "money"], "How much is it?", "How much is it?"),
  blueprint("english-elementary-final", "english", "Итоговый тест Elementary", "Elementary", "review", ["am", "my", "coffee", "student"], "I am a student", "am"),
];

const englishPreIntermediate: LessonBlueprint[] = [
  blueprint("english-pre-past-regular", "english", "Past Simple — правильные глаголы", "Pre-Intermediate", "regular past", ["walked", "talked", "watched", "played"], "Yesterday I walked to school", "walked"),
  blueprint("english-pre-past-irregular", "english", "Past Simple — неправильные глаголы", "Pre-Intermediate", "irregular verbs", ["went", "ate", "saw", "made"], "Yesterday I went home", "went"),
  blueprint("english-pre-future-simple", "english", "Future Simple", "Pre-Intermediate", "will", ["will", "plan", "tomorrow", "prediction"], "I will go tomorrow", "will"),
  blueprint("english-pre-modals", "english", "Модальные глаголы", "Pre-Intermediate", "can / must / should", ["can", "must", "should", "can't"], "You should rest", "should"),
  blueprint("english-pre-question-words", "english", "Вопросительные слова", "Pre-Intermediate", "who what where", ["Who", "What", "Where", "Why"], "Where are you from?", "Where"),
  blueprint("english-pre-travel", "english", "Транспорт и путешествия", "Pre-Intermediate", "travel", ["bus", "plane", "train", "airport"], "I go by train", "train"),
  blueprint("english-pre-health", "english", "Здоровье", "Pre-Intermediate", "doctor phrases", ["headache", "doctor", "medicine", "rest"], "I have a headache", "headache"),
  blueprint("english-pre-hobbies", "english", "Хобби и свободное время", "Pre-Intermediate", "like + ing", ["reading", "playing", "cooking", "drawing"], "I enjoy reading", "reading"),
  blueprint("english-pre-present-perfect", "english", "Present Perfect — введение", "Pre-Intermediate", "have been", ["have", "been", "ever", "never"], "I have been to London", "have"),
  blueprint("english-pre-final", "english", "Итоговый тест Pre-Intermediate", "Pre-Intermediate", "review", ["went", "will", "should", "Where"], "Where did you go?", "Where"),
];

const programmingBasics: LessonBlueprint[] = [
  blueprint("programming-foundations-what-is-code", "programming", "Что такое программирование", "Основы", "instructions and algorithms", ["инструкция", "алгоритм", "шаг", "компьютер"], "Алгоритм приготовления чая", "алгоритм"),
  blueprint("programming-foundations-variables", "programming", "Переменные и данные", "Основы", "variable as a box", ["число", "текст", "да/нет", "коробка"], "Переменная хранит значение", "коробка"),
  blueprint("programming-foundations-conditions", "programming", "Условия", "Основы", "if / else logic", ["если", "иначе", "условие", "выбор"], "Если зелёный, иди", "если"),
  blueprint("programming-foundations-loops", "programming", "Циклы", "Основы", "repeat actions", ["повтор", "пока", "10 раз", "цикл"], "Повтори 10 раз", "цикл"),
  blueprint("programming-foundations-functions", "programming", "Функции", "Основы", "function as recipe", ["рецепт", "вызов", "имя", "повтор"], "Функция как рецепт", "рецепт"),
];

const pythonBeginner: LessonBlueprint[] = [
  blueprint("python-beginner-hello-world", "programming", "Первая программа", "Python Beginner", "print", ["print", "строка", "запуск", "вывод"], "print('Hello World')", "Hello World", "print('Hello World')"),
  blueprint("python-beginner-variables", "programming", "Переменные", "Python Beginner", "Python variables", ["name", "age", "=", "print"], "name = 'Маааний'", "name", "name = 'Маааний'\nprint(name)"),
  blueprint("python-beginner-types", "programming", "Типы данных", "Python Beginner", "str int float bool", ["str", "int", "float", "bool"], "type(15) is int", "int", "print(type(15))"),
  blueprint("python-beginner-input", "programming", "Ввод от пользователя", "Python Beginner", "input", ["input", "name", "prompt", "answer"], "name = input('Как тебя зовут?')", "input", "name = input('Как тебя зовут? ')\nprint('Привет', name)"),
  blueprint("python-beginner-math", "programming", "Математика", "Python Beginner", "operators", ["+", "-", "*", "/"], "2 + 3 = 5", "+", "print(2 + 3)"),
  blueprint("python-beginner-if", "programming", "Условия if/elif/else", "Python Beginner", "conditions in Python", ["if", "elif", "else", ":"], "if age >= 18:", "if", "age = 18\nif age >= 18:\n    print('adult')"),
  blueprint("python-beginner-while", "programming", "Цикл while", "Python Beginner", "while loop", ["while", "counter", "attempt", "stop"], "while count < 3:", "while", "count = 0\nwhile count < 3:\n    print(count)\n    count += 1"),
  blueprint("python-beginner-for", "programming", "Цикл for", "Python Beginner", "for range", ["for", "range", "i", "loop"], "for i in range(10):", "for", "for i in range(3):\n    print(i)"),
  blueprint("python-beginner-lists", "programming", "Списки", "Python Beginner", "lists", ["list", "append", "remove", "index"], "fruits = ['apple']", "list", "fruits = ['apple', 'banana']\nprint(fruits[0])"),
  blueprint("python-beginner-project-guess-number", "programming", "Мини проект: Угадай число", "Python Beginner", "guess number game", ["secret", "guess", "if", "while"], "Собираем игру полностью", "secret", "secret = 7\nguess = 7\nif guess == secret:\n    print('win')"),
];

export const interactiveLessonProgram = [...englishBeginner, ...englishElementary, ...englishPreIntermediate, ...programmingBasics, ...pythonBeginner];

export function getInteractiveLesson(lesson: Lesson): InteractiveLesson {
  const blueprintItem = interactiveLessonProgram.find((item) => item.id === lesson.id);
  if (blueprintItem) return buildLesson(blueprintItem);
  return buildLegacyLesson(lesson);
}

export function getInteractiveLessonMeta(lessonId: string): Pick<InteractiveLesson, "id" | "courseId" | "title" | "level" | "xpReward"> | null {
  const item = interactiveLessonProgram.find((lessonItem) => lessonItem.id === lessonId);
  return item ? { id: item.id, courseId: item.courseId, title: item.title, level: item.level, xpReward: 100 } : null;
}

function buildLesson(item: LessonBlueprint): InteractiveLesson {
  const isProgramming = item.courseId === "programming";
  const coreSteps: InteractiveStep[] = [
    {
      id: `${item.id}-explain`,
      type: "explanation",
      title: "Объяснение",
      maaniy: `Сначала разложим тему "${item.title}" на простые кусочки.`,
      prompt: `Сегодня учим: ${item.focus}. Я покажу пример, потом ты потренируешься сам.`,
      illustration: isProgramming ? "{}" : "Aa",
      hint: "Просто прочитай пример и нажми дальше.",
    },
    {
      id: `${item.id}-word`,
      type: "word_card",
      title: "Карточка концепта",
      maaniy: "Запомни ключевое слово. Оно пригодится дальше.",
      prompt: "Посмотри на слово, произнеси его и прочитай пример.",
      word: item.words[0],
      pronunciation: isProgramming ? "концепт" : `/${item.words[0].toLowerCase()}/`,
      example: item.sentence,
      hint: `Ключевой ответ: ${item.answer}.`,
    },
    {
      id: `${item.id}-choice`,
      type: "choice",
      title: "Выбор из 4",
      maaniy: "Теперь быстрый выбор. Без спешки, смотри на смысл.",
      prompt: `Что лучше всего подходит к теме "${item.focus}"?`,
      options: shuffleStable([item.answer, item.words[1], item.words[2], item.words[3] ?? "other"]),
      answer: item.answer,
      hint: `Ищи вариант из примера: ${item.sentence}.`,
    },
    {
      id: `${item.id}-input`,
      type: "input",
      title: "Вписать слово",
      maaniy: "Теперь напиши сам. Регистр не важен.",
      prompt: `Впиши ключевое слово или фразу из примера: ${item.sentence}`,
      answer: item.answer,
      hint: `Ответ начинается так: ${item.answer.slice(0, 2)}...`,
    },
    {
      id: `${item.id}-sentence`,
      type: "sentence_builder",
      title: "Собери предложение",
      maaniy: "Собери фразу по порядку. Это тренирует живое мышление.",
      prompt: "Нажимай слова в правильном порядке.",
      words: shuffleStable(item.sentence.split(" ")),
      answer: item.sentence,
      hint: "Начинай с первого слова из примера.",
    },
    {
      id: `${item.id}-true`,
      type: "true_false",
      title: "Верно или нет",
      maaniy: "Проверим понимание одним коротким утверждением.",
      prompt: `"${item.sentence}" подходит к теме "${item.focus}".`,
      answer: "true",
      hint: "Утверждение построено по примеру урока.",
    },
    {
      id: `${item.id}-match`,
      type: "matching",
      title: "Сопоставь пары",
      maaniy: "Соедини пары. Я люблю, когда знания встают на места.",
      prompt: "Выбери элементы слева и справа, чтобы собрать пары.",
      pairs: [
        { left: item.words[0], right: item.answer },
        { left: item.words[1], right: item.words[1] },
        { left: item.words[2], right: item.words[2] },
      ],
      hint: "Первая пара связана с главным ответом урока.",
    },
    {
      id: `${item.id}-listen`,
      type: "listen_choice",
      title: "Послушай и выбери",
      maaniy: "Нажми прослушать, потом выбери услышанное.",
      prompt: "Что произнёс JARQ?",
      audioText: item.answer,
      options: shuffleStable([item.answer, item.words[1], item.words[2], item.words[3] ?? "other"]),
      answer: item.answer,
      hint: "Можно нажать прослушать ещё раз.",
    },
    isProgramming
      ? {
          id: `${item.id}-code`,
          type: "code_editor",
          title: "Мини редактор кода",
          maaniy: "Пока это лёгкий браузерный редактор. Позже сюда встанет CodeMirror + Pyodide.",
          prompt: "Измени код и нажми Запустить.",
          starterCode: item.code ?? "print('Hello World')",
          expectedOutput: item.answer,
          answer: item.answer,
          hint: "Нажми 'Помоги мне', если хочешь увидеть правильный код.",
        }
      : {
          id: `${item.id}-speak`,
          type: "speak",
          title: "Скажи вслух",
          maaniy: "Скажи фразу голосом. Если браузер не поддерживает распознавание, можно ввести её вручную.",
          prompt: item.answer,
          answer: item.answer,
          hint: "Произнеси медленно и чётко.",
        },
    {
      id: `${item.id}-dialogue`,
      type: "mini_dialogue",
      title: "Мини диалог",
      maaniy: "Финальный мини-диалог. Выбери естественные ответы.",
      prompt: "Проведи 4 реплики с Маанием.",
      dialogue: [
        { maaniy: "Привет! Готов к практике?", options: ["Да, начнём", "Нет никогда", "Я исчез"], answer: "Да, начнём" },
        { maaniy: `Что сегодня тренируем?`, options: [item.focus, "случайный шум", "ничего"], answer: item.focus },
        { maaniy: `Какой пример был в уроке?`, options: [item.sentence, item.words[2], item.words[3] ?? "не знаю"], answer: item.sentence },
        { maaniy: "Что делаем дальше?", options: ["Ещё один шаг", "Закрываем всё", "Забываем тему"], answer: "Ещё один шаг" },
      ],
      hint: "Выбирай дружелюбные и смысловые ответы.",
    },
  ];

  return { id: item.id, courseId: item.courseId, title: item.title, level: item.level, xpReward: 100, steps: coreSteps };
}

function buildLegacyLesson(lesson: Lesson): InteractiveLesson {
  const steps = lesson.tasks.flatMap((taskItem, index) => legacyTaskToSteps(taskItem, index));
  return {
    id: lesson.id,
    courseId: lesson.course_id ?? "demo",
    title: lesson.title,
    level: "Практика",
    xpReward: Math.max(80, steps.length * 10),
    steps: steps.length ? steps : buildLesson(blueprint("demo-interactive", "english", "Демо-урок", "Demo", "polite request", ["coffee", "tea", "please", "small"], "I would like a coffee", "I would like a coffee")).steps,
  };
}

function legacyTaskToSteps(taskItem: LessonTask, index: number): InteractiveStep[] {
  const answer = taskItem.correct_answer ?? "";
  const options = extractOptions(taskItem.question);
  return [
    {
      id: `${taskItem.id}-explain`,
      type: "explanation",
      title: `Шаг ${index + 1}: разбор`,
      maaniy: "Я объясню идею, а потом ты ответишь.",
      prompt: taskItem.explanation ?? taskItem.question,
      illustration: "JQ",
    },
    {
      id: `${taskItem.id}-practice`,
      type: options.length ? "choice" : taskItem.type === "write_code" ? "code_editor" : "input",
      title: "Практика",
      maaniy: "Теперь твоя очередь.",
      prompt: taskItem.question,
      options,
      answer: options.length ? answer.slice(0, 1) : answer,
      starterCode: taskItem.type === "write_code" ? answer : undefined,
      hint: taskItem.explanation ?? undefined,
    },
  ];
}

function blueprint(id: string, courseId: string, title: string, level: string, focus: string, words: string[], sentence: string, answer: string, code?: string): LessonBlueprint {
  return { id, courseId, title, level, focus, words, sentence, answer, code };
}

function extractOptions(question: string): string[] {
  return question
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[A-D]\)/.test(line))
    .map((line) => line.replace(/^[A-D]\)\s*/, ""));
}

function shuffleStable(values: string[]): string[] {
  return [...values].sort((a, b) => (a.length % 3) - (b.length % 3));
}
