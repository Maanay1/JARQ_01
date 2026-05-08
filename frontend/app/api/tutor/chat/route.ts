import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TutorChatRequest = {
  message?: string;
  persona_id?: string;
  provider?: string;
};

const personaTone: Record<string, string> = {
  jarq_classic: "умный, спокойный, с лёгким юмором",
  jarq_bro: "дружелюбный, простой, мотивирующий",
  jarq_sensei: "строгий, точный, наставнический",
  jarq_professor: "структурный, подробный, академичный",
  jarq_native_speaker: "живой разговорный английский, естественные фразы",
  jarq_hana: "спокойный, тёплый, уверенный, поддерживающий",
};

export async function POST(request: Request) {
  const body = (await request.json()) as TutorChatRequest;
  const message = body.message?.trim();
  const personaId = body.persona_id ?? "jarq_hana";
  const provider = body.provider ?? "openrouter";

  if (!message) {
    return NextResponse.json({ detail: "Message is required." }, { status: 400 });
  }

  if (provider !== "openrouter") {
    return NextResponse.json(
      {
        reply: "Сейчас на Vercel подключён OpenRouter. Выбери OpenRouter сверху, и я отвечу нормально.",
        provider,
        persona_id: personaId,
        memory_used: [],
        suggested_next_steps: ["Выбрать OpenRouter", "Повторить сообщение"],
      },
      { status: 200 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        detail:
          "OPENROUTER_API_KEY is not configured in Vercel environment variables. Add it to the frontend Vercel project and redeploy.",
      },
      { status: 503 },
    );
  }

  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jarq-01-4z1x.vercel.app";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": appUrl,
      "X-Title": "JARQ AI Tutor",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `Ты Маанай, AI-репетитор JARQ. Отвечай по-русски, тепло и полезно. Стиль: ${
            personaTone[personaId] ?? personaTone.jarq_hana
          }. Если тема английский, давай короткие практичные примеры и исправляй мягко.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json({ detail: formatOpenRouterError(response.status, detail) }, { status: response.status });
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  return NextResponse.json({
    reply: reply || "Я рядом, но ответ получился пустым. Попробуй написать вопрос ещё раз.",
    provider: "openrouter",
    persona_id: personaId,
    memory_used: [],
    suggested_next_steps: ["Продолжить практику", "Попросить пример", "Попросить мини-тест"],
  });
}

function formatOpenRouterError(status: number, detail: string): string {
  let providerMessage = detail;

  try {
    const parsed = JSON.parse(detail) as { error?: { message?: string; code?: number | string }; message?: string };
    providerMessage = parsed.error?.message ?? parsed.message ?? detail;
  } catch {
    // Keep provider text when it is not JSON.
  }

  const lowerMessage = providerMessage.toLowerCase();
  if (status === 401 || lowerMessage.includes("user not found")) {
    return (
      "OpenRouter не принял API ключ: User not found. " +
      "Создай новый ключ в OpenRouter и добавь его в Vercel → Environment Variables как OPENROUTER_API_KEY без кавычек и пробелов, потом сделай Redeploy."
    );
  }

  if (status === 402 || lowerMessage.includes("credits")) {
    return "На OpenRouter закончились кредиты или не включена оплата. Пополни баланс OpenRouter и повтори запрос.";
  }

  if (status === 429) {
    return "OpenRouter временно ограничил запросы. Подожди немного и попробуй ещё раз.";
  }

  return `OpenRouter вернул ошибку ${status}: ${providerMessage}`;
}
