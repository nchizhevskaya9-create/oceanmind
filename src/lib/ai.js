// Обёртка для вызова Netlify-функции ai-reflect

async function callAI(mode, payload, lang = "ru", history = []) {
  const res = await fetch("/.netlify/functions/ai-reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, payload, lang, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка запроса к ИИ");
  }
  const data = await res.json();
  return data.text;
}

// Рефлексия по одной или нескольким записям дневника
export async function getJournalInsight(entries, lang = "ru") {
  return callAI("journal_insight", entries, lang);
}

// Чат-ассистент: history — [{role: 'user'|'assistant', content: string}]
export async function chatWithAssistant(message, history, lang = "ru") {
  return callAI("chat", message, lang, history);
}
