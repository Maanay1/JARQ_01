export type VocabularyCategory =
  | "small_talk"
  | "career"
  | "food"
  | "travel"
  | "emotions"
  | "disagree"
  | "requests"
  | "phone";

export type PhraseFormality = "friends" | "work" | "everywhere";

export type SmartPhrase = {
  id: string;
  category: VocabularyCategory;
  phrase: string;
  translation: string;
  formality: PhraseFormality;
  dialogue: string;
};

export const vocabularyCategories: { id: VocabularyCategory; title: string }[] = [
  { id: "small_talk", title: "Знакомство и small talk" },
  { id: "career", title: "Работа и карьера" },
  { id: "food", title: "Еда и рестораны" },
  { id: "travel", title: "Путешествия" },
  { id: "emotions", title: "Эмоции и реакции" },
  { id: "disagree", title: "Несогласие вежливо" },
  { id: "requests", title: "Просьбы и предложения" },
  { id: "phone", title: "Телефонные разговоры" },
];

const rawPhrases: Array<[VocabularyCategory, string, string, FormalityLabel, string]> = [
  ["small_talk", "Not bad, actually", "На самом деле неплохо", "everywhere", "How are you? — Not bad, actually."],
  ["small_talk", "Pretty good, thanks", "Довольно хорошо, спасибо", "everywhere", "How's it going? — Pretty good, thanks."],
  ["small_talk", "Can't complain", "Не жалуюсь", "friends", "How are things? — Can't complain."],
  ["small_talk", "Living the dream", "Живу мечтой (иронично)", "friends", "Monday again? — Living the dream."],
  ["small_talk", "Nice to finally meet you", "Рад наконец познакомиться", "everywhere", "Nice to finally meet you. — Same here."],
  ["small_talk", "How do you know the host?", "Откуда ты знаешь хозяина?", "everywhere", "How do you know the host? — We study together."],
  ["small_talk", "What do you do?", "Чем занимаешься?", "everywhere", "What do you do? — I'm a student."],
  ["small_talk", "How about you?", "А ты?", "everywhere", "I work in IT. How about you?"],
  ["small_talk", "By the way", "Кстати", "everywhere", "By the way, are you from Bishkek?"],
  ["small_talk", "Let's keep in touch", "Давай будем на связи", "everywhere", "It was nice talking. Let's keep in touch."],
  ["small_talk", "Small world", "Мир тесен", "friends", "You know Asan too? Small world!"],
  ["small_talk", "I'm just looking around", "Я просто осматриваюсь", "everywhere", "Are you new here? — I'm just looking around."],
  ["small_talk", "Good to see you", "Рад тебя видеть", "everywhere", "Good to see you again!"],
  ["career", "I'm interested in this role", "Мне интересна эта роль", "work", "I'm interested in this role because I like solving problems."],
  ["career", "I'm a quick learner", "Я быстро учусь", "work", "I'm a quick learner and I'm not afraid of feedback."],
  ["career", "I work well under pressure", "Я хорошо работаю под давлением", "work", "I work well under pressure, especially with clear priorities."],
  ["career", "Could you clarify the task?", "Можете уточнить задачу?", "work", "Could you clarify the task before I start?"],
  ["career", "What's the deadline?", "Какой дедлайн?", "work", "What's the deadline for this feature?"],
  ["career", "I'll get back to you", "Я вернусь с ответом", "work", "I'll check the details and get back to you."],
  ["career", "That sounds reasonable", "Звучит разумно", "work", "That sounds reasonable. Let's do it."],
  ["career", "I'm open to feedback", "Я открыт к обратной связи", "work", "I'm open to feedback on my code."],
  ["career", "Let's prioritize", "Давайте расставим приоритеты", "work", "Let's prioritize the most urgent bugs first."],
  ["career", "I appreciate the opportunity", "Я ценю возможность", "work", "I appreciate the opportunity to join the team."],
  ["career", "I'm looking forward to it", "С нетерпением жду", "work", "I'm looking forward to working with you."],
  ["career", "Could we schedule a call?", "Можем назначить звонок?", "work", "Could we schedule a call for tomorrow?"],
  ["career", "That works for me", "Мне подходит", "work", "Tuesday at 3? That works for me."],
  ["food", "Could I get a coffee?", "Можно мне кофе?", "everywhere", "Could I get a coffee and a croissant?"],
  ["food", "What do you recommend?", "Что вы рекомендуете?", "everywhere", "What do you recommend for lunch?"],
  ["food", "I'll go with that", "Я выберу это", "everywhere", "The plov is good. — Great, I'll go with that."],
  ["food", "For here or to go?", "Здесь или с собой?", "everywhere", "For here or to go? — To go, please."],
  ["food", "Can I pay by card?", "Можно оплатить картой?", "everywhere", "Can I pay by card?"],
  ["food", "Could we get the bill?", "Можно счёт?", "everywhere", "Could we get the bill, please?"],
  ["food", "I'm allergic to nuts", "У меня аллергия на орехи", "everywhere", "I'm allergic to nuts. Is this safe?"],
  ["food", "No onions, please", "Без лука, пожалуйста", "everywhere", "No onions, please."],
  ["food", "It's on me", "Я угощаю", "friends", "Don't worry, it's on me."],
  ["food", "Let's split the bill", "Давайте разделим счёт", "friends", "Let's split the bill."],
  ["food", "That was delicious", "Это было вкусно", "everywhere", "That was delicious, thank you."],
  ["food", "Do you have anything vegetarian?", "Есть что-нибудь вегетарианское?", "everywhere", "Do you have anything vegetarian?"],
  ["food", "Could I have some water?", "Можно воды?", "everywhere", "Could I have some water, please?"],
  ["travel", "I have a reservation", "У меня бронь", "everywhere", "Hi, I have a reservation under Bayel."],
  ["travel", "Where is the nearest metro?", "Где ближайшее метро?", "everywhere", "Excuse me, where is the nearest metro?"],
  ["travel", "How much is a ticket?", "Сколько стоит билет?", "everywhere", "How much is a ticket to London?"],
  ["travel", "One way or round trip?", "В одну сторону или туда-обратно?", "everywhere", "One way or round trip? — Round trip."],
  ["travel", "I'm lost", "Я потерялся", "everywhere", "I'm lost. Could you help me?"],
  ["travel", "Could you show me on the map?", "Можете показать на карте?", "everywhere", "Could you show me on the map?"],
  ["travel", "Is breakfast included?", "Завтрак включён?", "everywhere", "Is breakfast included in the price?"],
  ["travel", "What time is check-out?", "Во сколько выезд?", "everywhere", "What time is check-out?"],
  ["travel", "My bag is missing", "Мой багаж пропал", "everywhere", "My bag is missing. Here is my tag."],
  ["travel", "Keep me updated", "Держите меня в курсе", "everywhere", "Please keep me updated."],
  ["travel", "Is it within walking distance?", "Можно дойти пешком?", "everywhere", "Is it within walking distance?"],
  ["travel", "Could you take a photo of us?", "Можете нас сфотографировать?", "everywhere", "Could you take a photo of us?"],
  ["travel", "I'm here for a few days", "Я здесь на несколько дней", "everywhere", "I'm here for a few days."],
  ["emotions", "No way!", "Не может быть!", "friends", "You won? No way!"],
  ["emotions", "That's awesome", "Это классно", "friends", "You got the job? That's awesome!"],
  ["emotions", "I'm so relieved", "Я так облегчён", "everywhere", "The exam is over. I'm so relieved."],
  ["emotions", "I'm a bit nervous", "Я немного нервничаю", "everywhere", "I'm a bit nervous about the interview."],
  ["emotions", "That sounds frustrating", "Звучит неприятно", "everywhere", "Your laptop broke? That sounds frustrating."],
  ["emotions", "I'm proud of you", "Я горжусь тобой", "friends", "You finished the course. I'm proud of you."],
  ["emotions", "I'm not in the mood", "Я не в настроении", "friends", "Sorry, I'm not in the mood today."],
  ["emotions", "That made my day", "Это подняло мне настроение", "friends", "Your message made my day."],
  ["emotions", "I'm excited about it", "Я в восторге от этого", "everywhere", "I'm excited about the project."],
  ["emotions", "I'm exhausted", "Я вымотан", "friends", "I'm exhausted after classes."],
  ["emotions", "It's not a big deal", "Ничего страшного", "everywhere", "Don't worry, it's not a big deal."],
  ["emotions", "I really appreciate it", "Я очень ценю это", "everywhere", "Thanks, I really appreciate it."],
  ["emotions", "That's impressive", "Впечатляет", "everywhere", "You built this app? That's impressive."],
  ["disagree", "I see your point, but...", "Понимаю, но...", "work", "I see your point, but we need more time."],
  ["disagree", "I'm not sure I agree", "Не уверен, что согласен", "work", "I'm not sure I agree with that approach."],
  ["disagree", "Could we look at it another way?", "Можем посмотреть иначе?", "work", "Could we look at it another way?"],
  ["disagree", "That might be risky", "Это может быть рискованно", "work", "That might be risky for users."],
  ["disagree", "I have a different perspective", "У меня другой взгляд", "work", "I have a different perspective on this."],
  ["disagree", "Let's think it through", "Давайте обдумаем", "work", "Let's think it through before deciding."],
  ["disagree", "I'm not convinced yet", "Я пока не убеждён", "work", "I'm not convinced yet. Do we have data?"],
  ["disagree", "Maybe, but...", "Возможно, но...", "everywhere", "Maybe, but it sounds expensive."],
  ["disagree", "I get what you mean", "Понимаю, что ты имеешь в виду", "everywhere", "I get what you mean, but I disagree."],
  ["disagree", "Let's agree to disagree", "Останемся при своих мнениях", "friends", "Let's agree to disagree."],
  ["disagree", "That's not quite what I meant", "Я имел в виду не совсем это", "everywhere", "That's not quite what I meant."],
  ["disagree", "Could you explain why?", "Можете объяснить почему?", "everywhere", "Could you explain why you think so?"],
  ["disagree", "Fair enough", "Справедливо / ладно", "everywhere", "Fair enough. I understand."],
  ["requests", "Could you help me with this?", "Можешь помочь с этим?", "everywhere", "Could you help me with this task?"],
  ["requests", "Would you mind checking it?", "Не мог бы проверить?", "work", "Would you mind checking my code?"],
  ["requests", "Can I ask you a quick question?", "Можно быстрый вопрос?", "everywhere", "Can I ask you a quick question?"],
  ["requests", "Could you repeat that?", "Можете повторить?", "everywhere", "Could you repeat that, please?"],
  ["requests", "Could you speak a bit slower?", "Можете говорить чуть медленнее?", "everywhere", "Could you speak a bit slower?"],
  ["requests", "Let me know", "Дай знать", "everywhere", "Let me know when you're ready."],
  ["requests", "Feel free to", "Не стесняйся", "work", "Feel free to ask questions."],
  ["requests", "Do you want me to...?", "Хочешь, чтобы я...?", "everywhere", "Do you want me to send the file?"],
  ["requests", "Shall we start?", "Начнём?", "everywhere", "Shall we start the lesson?"],
  ["requests", "Let's take a short break", "Давай сделаем короткий перерыв", "everywhere", "Let's take a short break."],
  ["requests", "Could you give me an example?", "Можете дать пример?", "everywhere", "Could you give me an example?"],
  ["requests", "Please take your time", "Не торопитесь", "everywhere", "Please take your time."],
  ["requests", "No rush", "Не спеши", "friends", "No rush, send it when you can."],
  ["phone", "Can you hear me?", "Меня слышно?", "everywhere", "Can you hear me?"],
  ["phone", "You're breaking up", "Связь прерывается", "everywhere", "You're breaking up. Could you repeat?"],
  ["phone", "Let me call you back", "Я перезвоню", "everywhere", "Let me call you back in five minutes."],
  ["phone", "I'm calling about...", "Я звоню по поводу...", "work", "I'm calling about my order."],
  ["phone", "Could I speak to...?", "Могу поговорить с...?", "work", "Could I speak to the manager?"],
  ["phone", "Please hold on", "Пожалуйста, подождите", "work", "Please hold on for a moment."],
  ["phone", "I'll put you through", "Я соединю вас", "work", "I'll put you through to support."],
  ["phone", "Sorry, wrong number", "Извините, не туда попал", "everywhere", "Sorry, wrong number."],
  ["phone", "The line is bad", "Плохая связь", "everywhere", "The line is bad. Can we switch to chat?"],
  ["phone", "Can you text me the details?", "Можете написать детали?", "everywhere", "Can you text me the details?"],
  ["phone", "I'll send it right away", "Я отправлю прямо сейчас", "everywhere", "I'll send it right away."],
  ["phone", "Thanks for calling", "Спасибо за звонок", "work", "Thanks for calling. Have a good day."],
  ["phone", "Talk to you soon", "Скоро поговорим", "friends", "Talk to you soon!"],
];

type FormalityLabel = "friends" | "work" | "everywhere";

export const smartPhrases: SmartPhrase[] = rawPhrases.map(([category, phrase, translation, formality, dialogue], index) => ({
  id: `phrase-${index + 1}`,
  category,
  phrase,
  translation,
  formality,
  dialogue,
}));
