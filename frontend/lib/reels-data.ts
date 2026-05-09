export type ReelCategory = "english" | "programming";

export type ReelType =
  | "word"
  | "rule"
  | "dialogue"
  | "code"
  | "fact"
  | "phrase"
  | "grammar"
  | "pronunciation"
  | "concept"
  | "tip";

export type ReelCard = {
  id: string;
  type: ReelType;
  category: ReelCategory;
  subcategory?: string;
  language?: string;
  level?: string;
  title: string;
  phrase?: string;
  usage?: string;
  examples?: (string | { wrong: string; right: string; why: string })[];
  neverSay?: string;
  word?: string;
  transcription?: string;
  translation?: string;
  story?: string;
  example?: string;
  lines?: string[];
  dialogue?: { speaker: string; text: string }[];
  code?: string;
  before?: string;
  after?: string;
  explanation?: string;
  fact?: string;
  words?: { word: string; wrong: string; right: string; tip: string }[];
  tip?: string;
  bad?: string[];
  good?: string[];
  rule?: string;
  question: string;
  options: string[];
  correct: number;
  xp: number;
};

type PhraseSeed = {
  subcategory: string;
  phrase: string;
  translation: string;
  usage: string;
  examples: string[];
  neverSay?: string;
  question: string;
  options: string[];
  correct: number;
  level: string;
};

const pad = (value: number) => String(value).padStart(3, "0");

const phraseSeeds: PhraseSeed[] = [
  ["smalltalk", "What's up?", "Как дела? / Что нового?", "неформально, с друзьями", ["Hey! What's up?", "Nothing much, what's up with you?"], "What is up? - так почти не говорят", "Друг написал тебе 'What's up?' - что ответишь?", ["Nothing much, you?", "The sky", "I am fine thank you", "What is up"], 0, "A1"],
  ["smalltalk", "I'm swamped", "Я завален работой", "когда очень много дел", ["Can't talk now, I'm swamped.", "Sorry I haven't called, I've been swamped."], undefined, "Как сказать 'я очень занят' живо?", ["I'm swamped", "I have много work", "No time", "I am busy person"], 0, "B1"],
  ["smalltalk", "Can't complain", "Не жалуюсь", "ответ на How are you", ["How are you? Can't complain.", "Pretty busy, but can't complain."], "I cannot complain now - звучит тяжело", "Как легко ответить 'нормально'?", ["Can't complain", "I cannot complaint", "No complain", "I am normal"], 0, "A2"],
  ["smalltalk", "Pretty good, thanks", "Довольно хорошо, спасибо", "универсально", ["I'm pretty good, thanks.", "Pretty good, thanks. How about you?"], undefined, "Как естественно ответить на How are you?", ["Pretty good, thanks", "I am fine thank you", "Goodly", "I very good"], 0, "A1"],
  ["agreement", "Totally!", "Полностью согласен!", "с друзьями и в чате", ["Totally! That's a great idea.", "I totally agree with you."], undefined, "Как живо сказать 'полностью согласен'?", ["Totally!", "Total!", "I am total", "Full yes"], 0, "A2"],
  ["agreement", "Absolutely!", "Абсолютно!", "уверенное согласие", ["Absolutely! Let's do it.", "You're absolutely right."], undefined, "Как подтвердить уверенно?", ["Absolutely!", "Maybe no", "I absolute", "Rightly"], 0, "A2"],
  ["agreement", "You bet!", "Конечно! / Ещё бы!", "дружелюбно", ["Can you help me? You bet!", "Want to join? You bet!"], undefined, "Как сказать 'конечно' дружелюбно?", ["You bet!", "You bid!", "You better", "Bet you"], 0, "B1"],
  ["agreement", "For sure!", "Точно! / Конечно!", "разговорно", ["For sure, I'll be there.", "That's useful for sure."], undefined, "Как сказать 'точно' по-разговорному?", ["For sure!", "For shore", "Surely for", "On sure"], 0, "A2"],
  ["disagreement", "I see your point, but...", "Понимаю твою мысль, но...", "вежливое несогласие", ["I see your point, but we need more time.", "I see your point, but I'm not convinced."], undefined, "Как мягко не согласиться?", ["I see your point, but...", "You are wrong", "No, bad idea", "I don't like you"], 0, "B1"],
  ["disagreement", "With all due respect...", "При всём уважении...", "формально и осторожно", ["With all due respect, I disagree.", "With all due respect, that's risky."], undefined, "Фраза для формального несогласия?", ["With all due respect...", "Respect all with...", "Due all", "You respect me"], 0, "B2"],
  ["disagreement", "I'm not so sure about that", "Я не совсем уверен насчёт этого", "мягкое сомнение", ["I'm not so sure about that plan.", "I'm not so sure that's true."], undefined, "Как выразить сомнение без грубости?", ["I'm not so sure about that", "I no sure", "I don't sure", "Not sure that so"], 0, "B1"],
  ["surprise", "No way!", "Да ладно! / Не может быть!", "сильное удивление", ["No way! You met him?", "No way, that's amazing!"], undefined, "Как отреагировать на неожиданную новость?", ["No way!", "No road", "No method", "Way no"], 0, "A2"],
  ["surprise", "Are you serious?", "Ты серьёзно?", "удивление", ["Are you serious? That's huge!", "Wait, are you serious?"], undefined, "Как спросить 'ты серьёзно?'", ["Are you serious?", "Do you serious?", "You are seriously?", "Is serious you?"], 0, "A2"],
  ["surprise", "You're kidding!", "Ты шутишь!", "дружеское удивление", ["You're kidding! Really?", "No, you're kidding me."], undefined, "Как сказать 'ты шутишь'?", ["You're kidding!", "You kid!", "You are child", "Kidding you"], 0, "B1"],
  ["surprise", "I can't believe it!", "Не могу поверить!", "эмоциональная реакция", ["I can't believe it! You passed!", "I still can't believe it."], undefined, "Как сказать 'не могу поверить'?", ["I can't believe it!", "I don't can believe", "No believe", "I not believe it"], 0, "A2"],
  ["approval", "Good job!", "Хорошая работа!", "обычная похвала", ["Good job on the test!", "Good job, team!"], undefined, "Как похвалить просто?", ["Good job!", "Good work job", "Job goodly", "Good profession"], 0, "A1"],
  ["approval", "Well done!", "Отлично сделано!", "чуть более формально", ["Well done! You improved a lot.", "That was well done."], undefined, "Как сказать 'отлично сделано'?", ["Well done!", "Good made", "Done welling", "Fine did"], 0, "A1"],
  ["approval", "Nailed it!", "Сделал идеально!", "разговорно", ["You nailed it!", "That presentation? Nailed it."], undefined, "Как сказать 'ты сделал идеально'?", ["Nailed it!", "Hammered it", "Nail this", "Did nail"], 0, "B1"],
  ["approval", "You crushed it!", "Ты просто разнёс!", "очень эмоциональная похвала", ["You crushed it on stage!", "You crushed that interview."], undefined, "Как очень ярко похвалить?", ["You crushed it!", "You broke it", "You crash", "You pressed it"], 0, "B2"],
  ["request", "Would you mind...?", "Ты не против...?", "вежливая просьба", ["Would you mind opening the window?", "Would you mind helping me?"], undefined, "Самая вежливая просьба?", ["Would you mind...?", "You must...", "Give me...", "Do it"], 0, "B1"],
  ["request", "Could you possibly...?", "Не мог бы ты...?", "очень мягко", ["Could you possibly send it today?", "Could you possibly explain that again?"], undefined, "Как попросить очень мягко?", ["Could you possibly...?", "Can you maybe possible", "You possibly do", "Could possible"], 0, "B2"],
  ["request", "Do you think you could...?", "Как думаешь, ты мог бы...?", "мягкая просьба", ["Do you think you could call me later?", "Do you think you could check this?"], undefined, "Как попросить без давления?", ["Do you think you could...?", "Think you can?", "You could think?", "Do could you"], 0, "B1"],
  ["apology", "My bad", "Мой косяк / моя вина", "неформальное извинение", ["My bad, I forgot.", "Oops, my bad."], undefined, "Как коротко признать ошибку?", ["My bad", "My badly", "I bad", "Bad mine"], 0, "A2"],
  ["apology", "I owe you one", "Я твой должник", "после помощи", ["Thanks! I owe you one.", "You saved me, I owe you one."], undefined, "Что сказать после большой помощи?", ["I owe you one", "I own you", "I owe one you", "I have debt"], 0, "B1"],
  ["apology", "That's on me", "Это моя вина", "ответственно", ["That's on me. I'll fix it.", "Sorry, that's on me."], undefined, "Как взять ответственность?", ["That's on me", "It is above me", "It on me", "That's my top"], 0, "B1"],
  ["apology", "I messed up", "Я напортачил", "честно о своей ошибке", ["I messed up the schedule.", "I messed up, sorry."], undefined, "Как сказать 'я напортачил'?", ["I messed up", "I mixed up all", "I mess", "I bad did"], 0, "B1"],
  ["goodbye", "Take care!", "Береги себя!", "тёплое прощание", ["Take care! See you soon.", "Have a safe trip, take care!"], undefined, "Как тепло попрощаться?", ["Take care!", "Take careful", "Care take", "Be care"], 0, "A2"],
  ["goodbye", "Catch you later!", "Увидимся позже!", "с друзьями", ["Catch you later!", "I gotta run, catch you later."], undefined, "Как сказать 'увидимся позже'?", ["Catch you later!", "Catch later you", "See catch", "Find you later"], 0, "A2"],
  ["goodbye", "I gotta run", "Мне пора бежать", "когда нужно уйти", ["I gotta run, see you!", "Sorry, I gotta run to class."], undefined, "Как естественно сказать 'мне пора'?", ["I gotta run", "I must run legs", "I go running", "I have run"], 0, "B1"],
  ["news", "Tell me more!", "Расскажи подробнее!", "реакция на интересную новость", ["Tell me more! What happened?", "That sounds cool, tell me more."], undefined, "Как попросить подробности?", ["Tell me more!", "Say me more", "Tell more me", "Speak more"], 0, "A2"],
].map(([subcategory, phrase, translation, usage, examples, neverSay, question, options, correct, level]) => ({
  subcategory,
  phrase,
  translation,
  usage,
  examples,
  neverSay,
  question,
  options,
  correct,
  level,
} as PhraseSeed));

const grammarSeeds = [
  ["Present Perfect vs Past Simple", "I HAVE SEEN = важен опыт.\nI SAW yesterday = важно конкретное время.", "___ you ever been to London?", ["Have", "Did", "Do", "Are"], 0],
  ["Going to vs Will", "going to = план уже есть.\nwill = решение прямо сейчас.", "I bought tickets. I ___ fly to Almaty.", ["am going to", "will", "do", "was"], 0],
  ["Much vs Many", "many = считаемые предметы.\nmuch = неисчисляемое.", "How ___ apples do you need for kompot?", ["many", "much", "few", "little"], 0],
  ["A few vs A little", "a few = немного, но считаем.\na little = немного жидкости/массы.", "I have ___ free minutes.", ["a few", "a little", "much", "any"], 0],
  ["There is / There are", "is = один предмет.\nare = несколько.", "___ three students in the room.", ["There are", "There is", "It is", "They is"], 0],
  ["Can vs Could", "could звучит вежливее.", "___ you help me with Python?", ["Could", "Must", "Should to", "Do"], 0],
  ["Should vs Must", "should = совет.\nmust = обязанность.", "You ___ revise before the test.", ["should", "mustn't", "are", "did"], 0],
  ["Comparatives", "big -> bigger, useful -> more useful.", "Python is ___ for beginners.", ["usefuler", "more useful", "most useful", "usefulest"], 1],
  ["Superlatives", "the best, the most useful.", "This is ___ lesson today.", ["the best", "best", "better", "the better"], 0],
  ["First Conditional", "If + Present, will + verb.", "If it rains, we ___ stay home.", ["will", "would", "did", "are"], 0],
  ["Second Conditional", "If + Past, would + verb.", "If I had time, I ___ learn JavaScript.", ["would", "will", "am", "do"], 0],
  ["Used to", "used to = раньше было, сейчас нет.", "I ___ play games every night.", ["used to", "use to", "am used", "was use"], 0],
  ["Too / Enough", "too = слишком.\nenough = достаточно.", "This task is ___ hard for A1.", ["too", "enough", "many", "few"], 0],
  ["Some / Any", "some в утверждениях, any в вопросах/отрицаниях.", "Do you have ___ questions?", ["any", "some", "much", "one"], 0],
  ["Articles", "a/an = впервые, the = уже знаем.", "I saw ___ dog. ___ dog was cute.", ["a / The", "the / A", "a / A", "the / The"], 0],
  ["Prepositions: in/on/at", "at 5, on Monday, in May.", "The lesson starts ___ 7 pm.", ["at", "on", "in", "to"], 0],
  ["Gerund after enjoy", "enjoy/avoid/finish + ing.", "I enjoy ___ English reels.", ["watching", "watch", "to watch", "watched"], 0],
  ["Question order", "В вопросе: вспомогательный глагол + подлежащее.", "Where ___ you live?", ["do", "are", "does", "is"], 0],
  ["Passive voice", "be + V3: was built, is made.", "This app ___ built by students.", ["was", "did", "has", "were"], 0],
  ["Reported speech", "He said he was tired.", "She said she ___ busy.", ["was", "is", "be", "were"], 0],
] as const;

const wordSeeds = [
  ["Procrastinate", "/prəˈkræstɪneɪt/", "Откладывать на потом", "Маааний должен был сделать домашку, но смотрел YouTube 3 часа.", ["Stop procrastinating and start studying!", "I procrastinate when I'm stressed."], "Маааний не делает уроки. Как это называется?"],
  ["Reliable", "/rɪˈlaɪəbl/", "Надёжный", "Асан всегда приходит вовремя и помогает группе.", ["A reliable friend is gold.", "This taxi app is reliable."], "Как сказать 'надёжный'?"],
  ["Awkward", "/ˈɔːkwərd/", "Неловкий", "Ты сказал Hello teacher маме друга. Было awkward.", ["That silence was awkward.", "I felt awkward."], "Как сказать 'неловко'?"],
  ["Bargain", "/ˈbɑːrɡən/", "Выгодная покупка", "На Чорсу Нигера нашла куртку за отличную цену.", ["This jacket was a bargain.", "What a bargain!"], "Очень выгодная покупка = ?"],
  ["Deadline", "/ˈdedlaɪn/", "Дедлайн", "Проект надо сдать до пятницы.", ["The deadline is tomorrow.", "Don't miss the deadline."], "Как называется срок сдачи?"],
  ["Fluent", "/ˈfluːənt/", "Свободно говорящий", "Айпери говорит на английском без пауз.", ["She is fluent in English.", "I want to sound fluent."], "Как сказать 'говорит свободно'?"],
  ["Improve", "/ɪmˈpruːv/", "Улучшать", "Каждый Reel улучшает речь на маленький шаг.", ["You improve every day.", "Practice improves pronunciation."], "Что значит improve?"],
  ["Confident", "/ˈkɑːnfɪdənt/", "Уверенный", "Бекболот спокойно отвечает на уроке.", ["Be confident.", "She sounds confident."], "Как сказать 'уверенный'?"],
  ["Curious", "/ˈkjʊriəs/", "Любопытный", "Салтанат хочет понять, как работает AI.", ["Stay curious.", "I'm curious about coding."], "Что значит curious?"],
  ["Effort", "/ˈefərt/", "Усилие", "Без effort прогресс не приходит.", ["Great effort!", "It takes effort."], "Как сказать 'усилие'?"],
  ["Handle", "/ˈhændl/", "Справляться", "Мадина умеет handle сложные задания.", ["I can handle it.", "Handle stress calmly."], "Как сказать 'справиться'?"],
  ["Shortcut", "/ˈʃɔːrtkʌt/", "Короткий путь", "List comprehension — shortcut в Python.", ["There is no shortcut to fluency.", "Use this keyboard shortcut."], "Короткий путь = ?"],
  ["Figure out", "/ˈfɪɡjər aʊt/", "Разобраться", "Алихан сам figured out ошибку в коде.", ["Let's figure it out.", "I figured out the bug."], "Как сказать 'разобраться'?"],
  ["Catch up", "/kætʃ ʌp/", "Догнать", "После болезни надо catch up по урокам.", ["I need to catch up.", "Let's catch up later."], "Как сказать 'догнать по учебе'?"],
  ["Worth it", "/wɜːrθ ɪt/", "Стоит того", "10 минут в день звучит мало, но it is worth it.", ["It's worth it.", "The course is worth it."], "Как сказать 'это того стоит'?"],
] as const;

const pronunciationSeeds = [
  ["Wednesday", "Вед-нес-дэй", "Венз-дэй", "буква d почти не читается"],
  ["Colonel", "Колонел", "Кёрнел", "произносится как kernel"],
  ["Recipe", "Рецайп", "Ресипи", "три слога, не два"],
  ["Comfortable", "Комфортабл", "Камфтэбл", "быстро, почти 3 слога"],
  ["Queue", "Ку-уэ", "Кью", "много букв, один звук"],
  ["Island", "Айс-лэнд", "Ай-лэнд", "s не читается"],
  ["Debt", "Дэбт", "Дэт", "b молчит"],
  ["Honest", "Хонест", "Онэст", "h не читается"],
  ["Enough", "Инаугх", "Инаф", "gh = f"],
  ["Though", "Тоугх", "Зоу", "gh молчит"],
] as const;

const conceptSeeds = [
  ["List Comprehension", "numbers = []\nfor i in range(10):\n    numbers.append(i * 2)", "numbers = [i * 2 for i in range(10)]", "Одна строка вместо трёх. Читается как: i*2 для каждого i.", "Что выведет [x**2 for x in range(4)]?", ["[0, 1, 4, 9]", "[1, 4, 9, 16]", "[0, 1, 2, 3]", "Ошибка"], 0],
  ["Dictionary", "name = 'Asan'\nage = 16", "student = {'name': 'Asan', 'age': 16}", "Словарь хранит данные по ключам.", "Как получить имя?", ["student['name']", "student.name()", "student(0)", "name.student"], 0],
  ["Function", "print('Hi, Asan')\nprint('Hi, Madina')", "def greet(name):\n    print('Hi,', name)", "Функция — рецепт, который можно использовать много раз.", "Что делает def?", ["создаёт функцию", "удаляет список", "открывает сайт", "рисует кнопку"], 0],
  ["Boolean", "is_open = True", "if is_open:\n    print('Come in')", "Boolean — True или False.", "Сколько значений у boolean?", ["2", "3", "10", "бесконечно"], 0],
  ["Loop", "print(1)\nprint(2)\nprint(3)", "for i in range(1, 4):\n    print(i)", "Цикл повторяет действие без копипаста.", "range(3) даёт:", ["0,1,2", "1,2,3", "0,1,2,3", "3"], 0],
  ["If / Else", "age = 17", "if age >= 18:\n    print('adult')\nelse:\n    print('teen')", "if выбирает путь по условию.", "Что сработает при age=17?", ["else", "if", "оба", "ничего"], 0],
  ["String format", "name='Asan'\nprint('Hi ' + name)", "print(f'Hi {name}')", "f-string аккуратно вставляет значения в текст.", "Что значит f перед строкой?", ["format", "file", "fast", "final"], 0],
  ["Try / Except", "int('abc')", "try:\n    int('abc')\nexcept ValueError:\n    print('bad number')", "try ловит ошибку и не даёт приложению упасть.", "except нужен чтобы:", ["обработать ошибку", "создать цикл", "удалить код", "запустить CSS"], 0],
  ["Import", "print(math.sqrt(16))", "import math\nprint(math.sqrt(16))", "import подключает готовые инструменты.", "Что делает import?", ["подключает модуль", "создаёт пароль", "закрывает файл", "пишет HTML"], 0],
  ["API", "data = get_weather()", "response = requests.get(url)", "API — способ программам разговаривать друг с другом.", "API это:", ["мост между программами", "тип монитора", "цвет кнопки", "ошибка Python"], 0],
] as const;

const tipSeeds = [
  ["Правило именования переменных", "Переменная должна отвечать на вопрос ЧТО это.", ["d = 86400", "x = users.filter(...)", "temp = getName()"], ["SECONDS_IN_DAY = 86400", "adults = users.filter(...)", "userName = getName()"], "Через 6 месяцев имя должно быть понятно.", "Лучшее имя для активных пользователей?", ["activeUsers", "data", "x", "list1"], 0],
  ["Не бойся маленьких функций", "Если блок делает одну мысль — вынеси в функцию.", ["doEverything()", "processDataAndSendEmailAndLog()"], ["sendEmail()", "formatUserName()"], "Функции как маленькие команды.", "Какое имя лучше?", ["calculateTotal", "doStuff", "thing", "aaa"], 0],
  ["Пиши ошибки понятно", "Сообщение ошибки должно говорить, что делать.", ["Error", "Bad"], ["Email is required", "Password must be 8+ chars"], "Пользователь не телепат.", "Лучшее сообщение?", ["Email is required", "Wrong", "No", "Bad data"], 0],
  ["Коммиты маленькими шагами", "Один коммит = одна понятная идея.", ["fix all", "changes"], ["add login form", "fix lesson progress"], "Так легче найти ошибку.", "Лучший commit message?", ["fix lesson progress", "stuff", "final final", "aaaa"], 0],
  ["Не храни секреты в коде", "API keys должны быть в .env.", ["const key='secret'"], ["process.env.API_KEY"], "GitHub помнит всё.", "Где хранить ключи?", [".env", "в компоненте", "в названии файла", "в CSS"], 0],
] as const;

const makePhraseReels = (): ReelCard[] => phraseSeeds.map((seed, index) => ({
  id: `en-${pad(index + 1)}`,
  type: "phrase",
  category: "english",
  title: "Разговорная фраза",
  subcategory: seed.subcategory,
  phrase: seed.phrase,
  translation: seed.translation,
  usage: seed.usage,
  level: seed.level,
  examples: seed.examples,
  neverSay: seed.neverSay,
  question: seed.question,
  options: seed.options,
  correct: seed.correct,
  xp: 15,
}));

const makeGrammarReels = (): ReelCard[] => grammarSeeds.map(([title, explanation, question, options, correct], index) => ({
  id: `en-${pad(31 + index)}`,
  type: "grammar",
  category: "english",
  title,
  level: index < 8 ? "A2" : "B1",
  explanation,
  examples: [
    { wrong: "I have seen him yesterday.", right: "I saw him yesterday.", why: "Конкретное время = Past Simple." },
    { wrong: "Did you ever try sushi?", right: "Have you ever tried sushi?", why: "ever про опыт = Present Perfect." },
  ],
  question,
  options: [...options],
  correct,
  xp: 20,
}));

const makeWordReels = (): ReelCard[] => Array.from({ length: 30 }, (_, index) => {
  const seed = wordSeeds[index % wordSeeds.length];
  return {
    id: `en-${pad(51 + index)}`,
    type: "word",
    category: "english",
    title: "Слово в контексте",
    word: seed[0],
    transcription: seed[1],
    translation: seed[2],
    story: seed[3],
    examples: [...seed[4]],
    example: seed[4][index % 2],
    question: seed[5],
    options: [seed[0], "Relaxing", "Deleting", "Guessing"],
    correct: 0,
    xp: 15,
  };
});

const makePronunciationReels = (): ReelCard[] => Array.from({ length: 20 }, (_, index) => {
  const chunk = [0, 1, 2, 3].map((offset) => pronunciationSeeds[(index + offset) % pronunciationSeeds.length]);
  const answer = chunk[0][2];
  return {
    id: `en-${pad(81 + index)}`,
    type: "pronunciation",
    category: "english",
    title: "Произношение",
    level: index < 10 ? "A2" : "B1",
    words: chunk.map(([word, wrong, right, tip]) => ({ word, wrong, right, tip })),
    question: `Как правильно произносится '${chunk[0][0]}'?`,
    options: [chunk[0][1], answer, chunk[1][1], chunk[2][1]],
    correct: 1,
    xp: 20,
  };
});

const makeConceptReels = (): ReelCard[] => Array.from({ length: 30 }, (_, index) => {
  const seed = conceptSeeds[index % conceptSeeds.length];
  return {
    id: `py-${pad(index + 1)}`,
    type: "concept",
    category: "programming",
    language: "python",
    title: seed[0],
    before: seed[1],
    after: seed[2],
    explanation: seed[3],
    question: seed[4],
    options: [...seed[5]],
    correct: seed[6],
    xp: 20,
  };
});

const makeTipReels = (): ReelCard[] => Array.from({ length: 20 }, (_, index) => {
  const seed = tipSeeds[index % tipSeeds.length];
  return {
    id: `tip-${pad(index + 1)}`,
    type: "tip",
    category: "programming",
    title: seed[0],
    tip: seed[1],
    bad: [...seed[2]],
    good: [...seed[3]],
    rule: seed[4],
    question: seed[5],
    options: [...seed[6]],
    correct: seed[7],
    xp: 15,
  };
});

const makeCodeReels = (): ReelCard[] => Array.from({ length: 25 }, (_, index) => ({
  id: `code-${pad(index + 1)}`,
  type: "code",
  category: "programming",
  title: index % 2 === 0 ? "Что выведет Python?" : "Код за минуту",
  code: index % 3 === 0
    ? "items = ['somsa', 'plov', 'kurut']\nprint(items[1])"
    : index % 3 === 1
      ? "total = 0\nfor i in range(4):\n    total += i\nprint(total)"
      : "name = 'Maanay'\nprint(name.upper())",
  explanation: index % 3 === 0 ? "Индексы начинаются с 0, поэтому [1] — второй элемент." : index % 3 === 1 ? "range(4) даёт 0,1,2,3. Сумма = 6." : "upper() делает строку заглавными буквами.",
  question: index % 3 === 0 ? "Что выведет код?" : index % 3 === 1 ? "Чему равен total?" : "Что появится на экране?",
  options: index % 3 === 0 ? ["somsa", "plov", "kurut", "Ошибка"] : index % 3 === 1 ? ["6", "4", "10", "3"] : ["MAANAY", "Maanay", "maanay", "Ошибка"],
  correct: index % 3 === 0 ? 1 : 0,
  xp: 15,
}));

const makeDevFactReels = (): ReelCard[] => Array.from({ length: 25 }, (_, index) => ({
  id: `dev-${pad(index + 1)}`,
  type: "fact",
  category: "programming",
  title: ["Алгоритм", "Debug", "Clean Code", "Git", "Frontend"][index % 5],
  fact: [
    "Алгоритм — это рецепт. Как приготовить чай: шаги важнее магии.",
    "Debug — не провал, а детектив. Ошибка оставляет след.",
    "Чистый код экономит время будущему тебе.",
    "Git — машина времени для проекта. Коммить маленькими шагами.",
    "Frontend — это не только красота, но и скорость, доступность и логика.",
  ][index % 5],
  question: "Что главное в этой идее?",
  options: ["Писать понятнее", "Писать больше шума", "Не проверять код", "Игнорировать ошибки"],
  correct: 0,
  xp: 15,
}));

export const reels: ReelCard[] = [
  ...makePhraseReels(),
  ...makeGrammarReels(),
  ...makeWordReels(),
  ...makePronunciationReels(),
  ...makeConceptReels(),
  ...makeTipReels(),
  ...makeCodeReels(),
  ...makeDevFactReels(),
];
