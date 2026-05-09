export async function generateReel(category: string, level: string) {
  const response = await fetch("/api/generate-reel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Создай карточку для JARQ Reels.
Категория: ${category}. Уровень: ${level}.
Формат JSON: { type, title, content, question, options, correct, explanation }
Сделай интересно и с юмором. На русском языке объяснение, на английском примеры.`,
    }),
  });

  if (!response.ok) {
    throw new Error("Не удалось сгенерировать Reel");
  }

  return response.json();
}
