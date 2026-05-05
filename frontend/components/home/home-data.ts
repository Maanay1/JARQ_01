import { Brain, Gamepad2, Mic, Route } from "lucide-react";

export const features = [
  {
    title: "Память ученика",
    text: "JARQ помнит слабые темы, стиль ответов, XP и то, что стоит повторить перед следующим уроком.",
    icon: Brain,
    color: "bg-cyan-300/20 text-cyan-100",
  },
  {
    title: "Живые уроки",
    text: "Маанай объясняет маленькими шагами: карточка, выбор ответа, самостоятельный ввод и повторение голосом.",
    icon: Route,
    color: "bg-purple-300/20 text-purple-100",
  },
  {
    title: "XP система",
    text: "За правильные ответы начисляется XP, растёт уровень ученика и виден прогресс по каждой дорожке.",
    icon: Gamepad2,
    color: "bg-cyan-300/20 text-cyan-100",
  },
  {
    title: "Голосовой режим",
    text: "Можно тренировать речь и произношение. Сейчас режим готов как демо и подключается к реальным STT/TTS ключам.",
    icon: Mic,
    color: "bg-purple-300/20 text-purple-100",
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
    name: "Маанай",
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
