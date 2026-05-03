import { CheckAnswerResponse, Course, Lesson, LessonTask } from "@/lib/types";

export const demoCourses: Course[] = [
  {
    id: "english-basics",
    title: "Основы английского",
    description: "Короткие практические уроки для повседневного английского.",
    subject: "Английский",
    level: "beginner",
  },
  {
    id: "programming_basics",
    title: "Основы программирования",
    description: "Переменные, условия, циклы и функции через маленькие code-квесты.",
    subject: "Программирование",
    level: "beginner",
  },
  {
    id: "speaking-practice",
    title: "Разговорная практика",
    description: "Подсказки для естественных устных ответов и быстрых исправлений.",
    subject: "Английский",
    level: "starter",
  },
  {
    id: "grammar-mastery",
    title: "Грамматика",
    description: "Точные грамматические упражнения с простыми объяснениями.",
    subject: "Английский",
    level: "beginner",
  },
];

export const demoLessons: Lesson[] = [
  lesson("ordering-coffee", "english-basics", "Заказ кофе", "Практика простого диалога в кафе.", 1, [
    task(
      "coffee-1",
      "ordering-coffee",
      "short_answer",
      "Вопрос: как вежливо попросить кофе?\nПример: I would like a tea.\nПрактика: напиши одну вежливую просьбу с кофе.",
      "I would like a coffee.",
      "Для вежливой просьбы используй 'I would like...'.",
    ),
    task(
      "coffee-2",
      "ordering-coffee",
      "multiple_choice",
      "Выбери самый естественный вариант:\nA) I want coffee now.\nB) I would like a small coffee.\nC) Give coffee.",
      "B",
      "'I would like...' звучит вежливо и естественно.",
    ),
  ]),
  lesson("variables_intro", "programming_basics", "Переменные", "Сохраняем значения в именах и используем повторно.", 1, [
    task(
      "variables_intro_1",
      "variables_intro",
      "write_code",
      "Вопрос: создай переменную score.\nПример кода: let lives = 3;\nПрактика: напиши JavaScript-код, который сохраняет 10 в score.",
      "let score = 10;",
      "Переменная может хранить значение через let: let score = 10;",
    ),
    task(
      "variables_intro_2",
      "variables_intro",
      "fix_error",
      "Исправь ошибку:\nПример кода: let name = 'JARQ';\nСломанный код: let score == 10;",
      "let score = 10;",
      "Для присваивания нужен один знак равно.",
    ),
  ]),
  lesson("conditions_intro", "programming_basics", "Условия", "Учим код выбирать между вариантами.", 2, [
    task(
      "conditions_intro_1",
      "conditions_intro",
      "multiple_choice",
      "Вопрос: какое ключевое слово начинает условие?\nПример кода: if (score > 5) { console.log('win'); }\nВарианты:\nA) if\nB) loop\nC) print",
      "A",
      "Условия в JavaScript обычно начинаются с if.",
    ),
    task(
      "conditions_intro_2",
      "conditions_intro",
      "write_code",
      "Практика: напиши условие, которое проверяет, что age равен 18 или больше.\nПример кода: if (score > 10) { console.log('great'); }",
      "if (age >= 18) { console.log('adult'); }",
      "Используй >= для проверки 'больше или равно'.",
    ),
  ]),
  lesson("loops_intro", "programming_basics", "Циклы", "Повторяем действия без копирования кода.", 3, [
    task(
      "loops_intro_1",
      "loops_intro",
      "multiple_choice",
      "Вопрос: что делает цикл?\nПример кода: for (let i = 0; i < 3; i++) { console.log(i); }\nA) Повторяет код\nB) Удаляет код\nC) Останавливает JavaScript",
      "A",
      "Цикл повторяет блок кода.",
    ),
    task(
      "loops_intro_2",
      "loops_intro",
      "fix_error",
      "Добавь пропущенное ключевое слово:\nПример кода: for (let i = 0; i < 3; i++) { console.log(i); }\nСломанный код: (let i = 0; i < 3; i++) { console.log(i); }",
      "for (let i = 0; i < 3; i++) { console.log(i); }",
      "Циклу нужно ключевое слово for.",
    ),
  ]),
  lesson("functions_intro", "programming_basics", "Функции", "Упаковываем повторяемые действия в именованные блоки.", 4, [
    task(
      "functions_intro_1",
      "functions_intro",
      "write_code",
      "Вопрос: создай функцию greet.\nПример кода: function sayHi() { return 'Hi'; }\nПрактика: верни 'Hello' из greet.",
      "function greet() { return 'Hello'; }",
      "Функции возвращают значения через ключевое слово return.",
    ),
    task(
      "functions_intro_2",
      "functions_intro",
      "multiple_choice",
      "Какой вариант вызывает функцию?\nПример кода: greet();\nA) greet;\nB) greet();\nC) function greet",
      "B",
      "Скобки вызывают функцию.",
    ),
  ]),
  lesson("daily-speaking", "speaking-practice", "Ежедневная речь", "Отвечай на короткие бытовые вопросы голосом или текстом.", 1, [
    task(
      "speaking-1",
      "daily-speaking",
      "short_answer",
      "Вопрос: что ты делал вчера?\nПример: Yesterday I practiced English for ten minutes.\nПрактика: напиши одно естественное предложение.",
      "Yesterday I practiced English.",
      "После yesterday используй прошедшее время.",
    ),
  ]),
  lesson("present-simple", "grammar-mastery", "Present Simple", "Строим чистые повседневные предложения.", 1, [
    task(
      "grammar-1",
      "present-simple",
      "fix_error",
      "Исправь предложение:\nПример: She likes coffee.\nСломанное предложение: She like coffee.",
      "She likes coffee.",
      "В Present Simple с he, she, it добавляем -s.",
    ),
  ]),
];

export function getDemoCourseLessons(courseId: string): Lesson[] {
  return demoLessons.filter((lessonItem) => lessonItem.course_id === courseId);
}

export function getDemoLesson(lessonId: string): Lesson {
  return (
    demoLessons.find((lessonItem) => lessonItem.id === lessonId) ??
    lesson("demo-task", "demo", "Демо-урок", "Запасной демо-урок.", 1, [
      task(
        "demo-task-1",
        "demo-task",
        "short_answer",
        "Вопрос: напиши вежливое английское предложение, чтобы попросить кофе.\nПример: I would like tea.\nПрактика: попроси кофе вежливо.",
        "I would like a coffee.",
        "Для вежливой просьбы используй 'I would like...'.",
      ),
    ])
  );
}

export function checkDemoAnswer(params: {
  lessonId: string;
  taskId: string;
  answer: string;
}): CheckAnswerResponse {
  const lessonItem = getDemoLesson(params.lessonId);
  const taskItem = lessonItem.tasks.find((item) => item.id === params.taskId) ?? lessonItem.tasks[0];
  const correct = normalize(params.answer) === normalize(taskItem.correct_answer ?? "");

  return {
    correct,
    feedback: correct ? "Верно. Отличная работа." : "Почти. Сравни ответ с примером и поправь ключевую часть.",
    emotion: correct ? "proud" : "calm",
    xp_earned: correct ? 10 : 0,
    explanation: taskItem.explanation ?? "Посмотри пример и попробуй еще раз.",
    next_task: nextTask(lessonItem.tasks, taskItem.id),
  };
}

function lesson(id: string, courseId: string, title: string, content: string, orderIndex: number, tasks: LessonTask[]): Lesson {
  return { id, course_id: courseId, title, content, order_index: orderIndex, tasks };
}

function task(
  id: string,
  lessonId: string,
  type: string,
  question: string,
  correctAnswer: string,
  explanation: string,
): LessonTask {
  return { id, lesson_id: lessonId, type, question, correct_answer: correctAnswer, explanation, difficulty: "easy" };
}

function nextTask(tasks: LessonTask[], taskId: string): LessonTask | null {
  const index = tasks.findIndex((item) => item.id === taskId);
  return index >= 0 && index + 1 < tasks.length ? tasks[index + 1] : null;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/;$/, "");
}
