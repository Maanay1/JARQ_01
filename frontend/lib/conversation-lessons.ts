export type ConversationOption = {
  text: string;
  correct: boolean;
  score: number;
  feedback?: string;
};

export type ConversationTurn = {
  speaker: string;
  text: string;
  translation: string;
  userOptions: ConversationOption[];
};

export type ConversationLesson = {
  id: string;
  title: string;
  level: "beginner" | "elementary" | "pre-intermediate";
  duration: string;
  xp: number;
  situation: string;
  character: string;
  dialog: ConversationTurn[];
  vocabulary: string[];
  tips: string[];
};

const commonOptions = {
  askBack: { text: "Sounds good. How about you?", correct: true, score: 100 },
  tooShort: { text: "Ok.", correct: false, score: 35, feedback: "Слишком коротко. В разговоре лучше добавить вопрос или деталь." },
  weird: { text: "I don't speak.", correct: false, score: 5, feedback: "Звучит резко и неестественно." },
};

function turn(speaker: string, text: string, translation: string, good: string, okay: string, bad = commonOptions.tooShort): ConversationTurn {
  return {
    speaker,
    text,
    translation,
    userOptions: [
      { text: good, correct: true, score: 100 },
      { text: okay, correct: true, score: 80 },
      bad,
    ],
  };
}

export const conversationLessons: ConversationLesson[] = [
  {
    id: "conv-party-intro",
    title: "Знакомство на вечеринке",
    level: "beginner",
    duration: "5 мин",
    xp: 50,
    situation: "Ты на международной вечеринке в Бишкеке. К тебе подходит незнакомец.",
    character: "Alex",
    dialog: [
      turn("Alex", "Hey! I don't think we've met. I'm Alex.", "Привет! Кажется, мы не знакомы. Я Алекс.", "Hi Alex! I'm Bayel. Nice to meet you!", "Hey Alex, nice to meet you. I'm Bayel."),
      turn("Alex", "So, how do you know the host?", "Так ты как знаешь хозяина вечеринки?", "We study together. How about you?", "He is my friend from university."),
      turn("Alex", "Cool. What do you do?", "Круто. Чем занимаешься?", "I'm a student, and I'm learning programming.", "I study and work on small projects."),
      turn("Alex", "That sounds interesting. What kind of programming?", "Звучит интересно. Какое программирование?", "Mostly Python and web apps. I'm still learning.", "Python for now. I like building useful things."),
      turn("Alex", "Nice! Do you come to events like this often?", "Класс! Часто ходишь на такие мероприятия?", "Not really, but I'm trying to meet new people.", "Sometimes. I like practicing my English here."),
      turn("Alex", "Same here. Your English is pretty good!", "Я тоже. У тебя английский довольно хороший!", "Thanks, I'm working on it every day.", "Thanks! I'm still practicing."),
      turn("Alex", "Want to grab some snacks?", "Хочешь взять что-нибудь перекусить?", "Sure, let's go. I could use some somsa.", "Yeah, good idea. I'm hungry."),
      turn("Alex", "Great. By the way, are you on Instagram?", "Отлично. Кстати, ты есть в Instagram?", "Yes, I'll send it to you. Let's keep in touch.", "Sure, let's exchange contacts."),
    ],
    vocabulary: ["nice to meet you", "how do you know", "what do you do", "not really", "by the way", "keep in touch"],
    tips: ["Всегда добавляй короткий вопрос в ответ.", "Nice to meet you — стандарт при первом знакомстве.", "How about you? мягко возвращает вопрос собеседнику."],
  },
  {
    id: "conv-cafe-order",
    title: "Заказ еды в кафе",
    level: "beginner",
    duration: "6 мин",
    xp: 55,
    situation: "Ты в кафе в Алматы и хочешь заказать кофе и еду на английском.",
    character: "Waiter",
    dialog: [
      turn("Waiter", "Hi there! What can I get for you?", "Здравствуйте! Что вам принести?", "Hi! Could I get a latte and a chicken sandwich, please?", "I'd like a latte and a sandwich, please."),
      turn("Waiter", "Sure. Would you like it hot or iced?", "Конечно. Горячий или холодный?", "Hot, please. And not too sweet.", "Hot is fine, thank you."),
      turn("Waiter", "Any sauce with the sandwich?", "Какой-нибудь соус к сэндвичу?", "What do you recommend?", "Maybe garlic sauce, please."),
      turn("Waiter", "Garlic sauce is popular.", "Чесночный соус популярный.", "Great, I'll go with that.", "Okay, let's do that."),
      turn("Waiter", "Anything else?", "Что-нибудь ещё?", "That's all for now, thanks.", "No, that's everything."),
      turn("Waiter", "For here or to go?", "Здесь или с собой?", "For here, please.", "I'll eat here."),
      turn("Waiter", "That'll be 850 tenge.", "С вас 850 тенге.", "Can I pay by card?", "Sure, card is okay?"),
      turn("Waiter", "Your order will be ready soon.", "Ваш заказ скоро будет готов.", "Thank you. I'll wait over there.", "Thanks, I'll take a seat."),
    ],
    vocabulary: ["Could I get", "What do you recommend?", "I'll go with that", "for here or to go", "Can I pay by card?"],
    tips: ["Could I get звучит вежливее, чем Give me.", "I'll go with that = выберу это.", "For here / to go — ключевая фраза в кафе."],
  },
  {
    id: "conv-job-interview",
    title: "Собеседование на работу",
    level: "pre-intermediate",
    duration: "8 мин",
    xp: 70,
    situation: "Ты проходишь короткое собеседование на junior-позицию.",
    character: "Interviewer",
    dialog: [
      turn("Interviewer", "Tell me a little about yourself.", "Расскажите немного о себе.", "I'm a motivated student interested in web development.", "I'm learning programming and building small projects."),
      turn("Interviewer", "Why are you interested in this role?", "Почему вам интересна эта роль?", "I want to grow in a real team and solve practical problems.", "I like learning by building useful products."),
      turn("Interviewer", "What are your strengths?", "Какие у вас сильные стороны?", "I'm reliable, curious, and I learn quickly.", "I don't give up easily and I ask good questions."),
      turn("Interviewer", "Do you have any experience?", "У вас есть опыт?", "I have built a few demo projects and practiced with APIs.", "I don't have a job yet, but I have projects."),
      turn("Interviewer", "How do you handle mistakes?", "Как вы справляетесь с ошибками?", "I debug step by step and ask for feedback when needed.", "I try to understand the cause, not just fix the symptom."),
      turn("Interviewer", "Can you work in a team?", "Можете работать в команде?", "Yes, I communicate clearly and respect deadlines.", "Yes, I like discussing ideas with teammates."),
      turn("Interviewer", "Do you have questions for us?", "У вас есть вопросы к нам?", "What would success look like in the first month?", "What skills should I focus on before starting?"),
      turn("Interviewer", "Thanks for your time.", "Спасибо за ваше время.", "Thank you for the opportunity. I look forward to hearing from you.", "Thanks, it was great speaking with you."),
    ],
    vocabulary: ["Tell me about yourself", "I'm interested in", "my strengths are", "handle mistakes", "look forward to hearing from you"],
    tips: ["На интервью отвечай конкретно: навык + пример.", "Reliable, curious, quick learner — хорошие слова для junior.", "В конце всегда задай вопрос компании."],
  },
  {
    id: "conv-doctor",
    title: "Разговор с врачом",
    level: "elementary",
    duration: "6 мин",
    xp: 60,
    situation: "Ты в клинике за границей и объясняешь симптомы.",
    character: "Doctor",
    dialog: [
      turn("Doctor", "What seems to be the problem?", "Что вас беспокоит?", "I've had a headache since yesterday.", "My head hurts and I feel tired."),
      turn("Doctor", "Do you have a fever?", "У вас есть температура?", "I'm not sure, but I feel a bit hot.", "Maybe. I haven't checked."),
      turn("Doctor", "Any cough or sore throat?", "Кашель или боль в горле?", "Yes, I have a sore throat.", "A little cough, but not much."),
      turn("Doctor", "Are you allergic to any medicine?", "Есть аллергия на лекарства?", "No, not that I know of.", "I don't think so."),
      turn("Doctor", "How long has this been going on?", "Как давно это длится?", "Since yesterday morning.", "For about two days."),
      turn("Doctor", "You should rest and drink water.", "Вам нужно отдыхать и пить воду.", "Got it. Should I take any medicine?", "Okay. Is there anything else I should do?"),
      turn("Doctor", "Take this twice a day.", "Принимайте это два раза в день.", "Twice a day, after meals?", "Okay, twice a day."),
      turn("Doctor", "Come back if it gets worse.", "Вернитесь, если станет хуже.", "Thank you, doctor. I will.", "Thanks, I appreciate it."),
    ],
    vocabulary: ["What seems to be the problem?", "I've had", "sore throat", "not that I know of", "twice a day", "if it gets worse"],
    tips: ["I've had... since... помогает объяснить длительность.", "Not that I know of — естественный ответ про аллергию.", "Уточняй дозировку: after meals? twice a day?"],
  },
  {
    id: "conv-flight-ticket",
    title: "Покупка билета на самолёт",
    level: "elementary",
    duration: "6 мин",
    xp: 60,
    situation: "Ты покупаешь билет из Ташкента в Стамбул.",
    character: "Agent",
    dialog: [
      turn("Agent", "Where would you like to fly?", "Куда вы хотите лететь?", "I'd like to fly to Istanbul.", "I need a ticket to Istanbul."),
      turn("Agent", "One way or round trip?", "В одну сторону или туда-обратно?", "Round trip, please.", "One way for now, please."),
      turn("Agent", "What date are you planning to leave?", "На какую дату вылет?", "I'm planning to leave on June 12th.", "June 12th would be perfect."),
      turn("Agent", "Do you prefer morning or evening flights?", "Утренний или вечерний рейс?", "Morning would be better for me.", "Evening is okay too."),
      turn("Agent", "Do you need checked baggage?", "Нужен багаж?", "Yes, one checked bag, please.", "Just hand luggage, please."),
      turn("Agent", "Window or aisle seat?", "У окна или у прохода?", "Window seat, if possible.", "Aisle seat would be great."),
      turn("Agent", "The total is 240 dollars.", "Итого 240 долларов.", "Can I pay by card?", "Is tax included?"),
      turn("Agent", "Here is your ticket.", "Вот ваш билет.", "Thank you. Could you email it to me as well?", "Thanks. I appreciate your help."),
    ],
    vocabulary: ["one way", "round trip", "checked baggage", "window seat", "aisle seat", "if possible"],
    tips: ["Round trip = туда-обратно.", "If possible звучит мягко и вежливо.", "Could you email it to me? полезно в аэропорту."],
  },
];

const moreLessons: Array<[string, string, string, string, string[]]> = [
  ["conv-street-help", "Встреча с иностранцем на улице", "Турист в Оше спрашивает дорогу к Сулейман-Тоо.", "Tourist", ["Excuse me", "go straight", "turn left", "it's about ten minutes", "you can't miss it"]],
  ["conv-support-call", "Звонок в службу поддержки", "Ты звонишь в поддержку из-за проблем с приложением.", "Support", ["I'm having trouble with", "could you help me", "it keeps crashing", "let me check", "thanks for your patience"]],
  ["conv-hotel-checkin", "Заселение в отель", "Ты заселяешься в отель после долгого перелёта.", "Receptionist", ["I have a reservation", "under the name", "could I see your passport", "breakfast included", "check-out time"]],
  ["conv-small-talk-weather", "Small talk о погоде", "Ты едешь в лифте с иностранным гостем.", "Guest", ["lovely weather", "a bit chilly", "can't complain", "how long are you staying", "enjoy your trip"]],
  ["conv-networking-it", "Нетворкинг на IT-ивенте", "Ты знакомишься с разработчиком на хакатоне.", "Developer", ["what are you working on", "sounds exciting", "I'm into", "let's connect", "good luck with your project"]],
  ["conv-shopping-return", "Возврат покупки", "Ты хочешь вернуть наушники в магазине.", "Cashier", ["I'd like to return this", "it doesn't work properly", "do you have the receipt", "exchange or refund", "that works for me"]],
  ["conv-renting-flat", "Аренда квартиры", "Ты разговариваешь с хозяином квартиры.", "Landlord", ["is it still available", "how much is the rent", "utilities included", "can I see the place", "sounds reasonable"]],
  ["conv-first-date", "Первое свидание", "Ты встречаешься с человеком в кафе.", "Sam", ["you look great", "what do you do for fun", "I'm really into", "that's interesting", "shall we order"]],
  ["conv-airport-problem", "Проблема в аэропорту", "Твой багаж не прилетел.", "Staff", ["my bag is missing", "could you check", "here is my tag", "when should I expect it", "please keep me updated"]],
  ["conv-classroom-question", "Вопрос учителю", "Ты не понял задание и вежливо уточняешь.", "Teacher", ["could you repeat that", "I'm not sure I understand", "do you mean", "could you give an example", "thanks, that makes sense"]],
];

function makeLesson([id, title, situation, character, vocabulary]: [string, string, string, string, string[]], index: number): ConversationLesson {
  return {
    id,
    title,
    level: index % 3 === 0 ? "beginner" : index % 3 === 1 ? "elementary" : "pre-intermediate",
    duration: "5 мин",
    xp: 50 + (index % 3) * 10,
    situation,
    character,
    dialog: [
      turn(character, "Hi! Do you have a minute?", "Привет! У тебя есть минутка?", "Sure, how can I help?", "Yes, what's up?"),
      turn(character, "I wanted to ask you something.", "Я хотел кое-что спросить.", `${vocabulary[0][0].toUpperCase()}${vocabulary[0].slice(1)}?`, "Sure, go ahead."),
      turn(character, "Could you explain that a bit?", "Можешь немного объяснить?", `${vocabulary[1][0].toUpperCase()}${vocabulary[1].slice(1)}.`, "Let me explain."),
      turn(character, "That makes sense. What about the details?", "Понятно. А что насчёт деталей?", `${vocabulary[2][0].toUpperCase()}${vocabulary[2].slice(1)}.`, "Here are the details."),
      turn(character, "Is there anything else I should know?", "Есть ещё что-то, что мне нужно знать?", `${vocabulary[3][0].toUpperCase()}${vocabulary[3].slice(1)}.`, "One more thing."),
      turn(character, "Great, thanks for being clear.", "Отлично, спасибо за ясность.", "No problem. Happy to help.", "You're welcome."),
      turn(character, "Can we stay in touch?", "Можем оставаться на связи?", `${vocabulary[4][0].toUpperCase()}${vocabulary[4].slice(1)}.`, "Sure, let's connect."),
      turn(character, "Perfect. Talk soon!", "Отлично. Скоро поговорим!", "Talk soon. Have a great day!", "See you soon!"),
    ],
    vocabulary,
    tips: ["Не отвечай одним словом, добавляй деталь.", "Повтори ключевую фразу вслух 3 раза.", "В конце разговора закрывай диалог мягко: Talk soon / Have a great day."],
  };
}

export const allConversationLessons = [...conversationLessons, ...moreLessons.map(makeLesson)];

const englishAliasIds = [
  "english-beginner-alphabet-am",
  "english-beginner-alphabet-nz",
  "english-beginner-vowels",
  "english-beginner-numbers-1-10",
  "english-beginner-numbers-11-100",
  "english-beginner-colors",
  "english-beginner-greetings",
  "english-beginner-introductions",
  "english-beginner-body",
  "english-beginner-family",
  "english-beginner-days-months",
  "english-beginner-final",
  "english-elementary-to-be",
  "english-elementary-pronouns",
  "english-elementary-present-simple",
];

export function getConversationLesson(lessonId: string): ConversationLesson | null {
  const exact = allConversationLessons.find((lesson) => lesson.id === lessonId);
  if (exact) return exact;
  const aliasIndex = englishAliasIds.indexOf(lessonId);
  return aliasIndex >= 0 ? allConversationLessons[aliasIndex % allConversationLessons.length] : null;
}
