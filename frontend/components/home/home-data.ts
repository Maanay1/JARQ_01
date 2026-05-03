import { Bot, CheckCircle2, Gamepad2, LockKeyhole, Mic, Route } from "lucide-react";

export const features = [
  {
    title: "Голосовые диалоги",
    text: "Говори естественно, получай ответы и тренируйся без постоянного набора текста.",
    icon: Mic,
    color: "bg-coral/15 text-coral",
  },
  {
    title: "AI-личности",
    text: "Переключайся между классиком, бро, сенсеем, профессором, носителем языка или Ханой.",
    icon: Bot,
    color: "bg-mint/20 text-ink",
  },
  {
    title: "Личный путь обучения",
    text: "JARQ помнит уровень, XP, серию дней, любимую личность и текущие темы.",
    icon: Route,
    color: "bg-sky/20 text-ink",
  },
  {
    title: "Анализ ошибок",
    text: "Ошибки становятся полезными сигналами: исправления, объяснения и слабые темы.",
    icon: CheckCircle2,
    color: "bg-coral/15 text-ink",
  },
  {
    title: "Игровые уроки",
    text: "Уроки ощущаются как квесты с XP, прогрессом и быстрой обратной связью.",
    icon: Gamepad2,
    color: "bg-mint/20 text-ink",
  },
  {
    title: "Будущий локальный AI",
    text: "Слой провайдеров готов к локальным моделям и приватному офлайн-обучению.",
    icon: LockKeyhole,
    color: "bg-ink text-white",
  },
];

export const personas = [
  {
    name: "JARQ Классик",
    id: "jarq_classic",
    style: "Умный, спокойный, с юмором",
    line: "Сделаем это просто и реально полезно.",
  },
  {
    name: "JARQ Bro",
    id: "jarq_bro",
    style: "Легкий, дружеский, мотивирующий",
    line: "Ты близко. Маленькая правка, большой апгрейд.",
  },
  {
    name: "JARQ Sensei",
    id: "jarq_sensei",
    style: "Дисциплина, фокус, ясность",
    line: "Хорошая попытка. Теперь сделаем фразу точнее.",
  },
  {
    name: "JARQ Professor",
    id: "jarq_professor",
    style: "Логика, структура, детали",
    line: "Вот правило, которое стоит за ответом.",
  },
  {
    name: "Хана",
    id: "jarq_hana",
    style: "Мягкая, теплая, поддерживающая",
    line: "Ооо, почти! Давай вместе поправим одну маленькую вещь.",
  },
];

export const demoMessages = [
  {
    role: "Ученик",
    text: "I go to cafe yesterday and order coffee.",
  },
  {
    role: "JARQ",
    text: "Смысл понятен. Маленькая правка по времени: скажи 'I went to a cafe yesterday and ordered coffee.'",
  },
  {
    role: "Ученик",
    text: "Почему went и ordered?",
  },
  {
    role: "JARQ",
    text: "Потому что 'yesterday' переносит действие в прошлое. Мини-задание: скажи одну вещь, которую ты сделал вчера.",
  },
];
