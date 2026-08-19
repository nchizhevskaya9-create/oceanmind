// Netlify Function: /.netlify/functions/ai-reflect
// Принимает { mode, payload, lang } и возвращает { text } от Claude.
// Ключ ANTHROPIC_API_KEY задаётся в Netlify → Site configuration → Environment variables.

const SYSTEM_PROMPTS = {
  journal_insight: {
    ru: `Ты — тёплый, бережный ИИ-помощник в приложении для ментального здоровья OceanMind.
Пользователь ведёт дневник самонаблюдения. Тебе дают одну или несколько записей
(что случилось, что почувствовал(а), что помогло, инсайт, настроение).
Дай короткую (3-5 предложений), бережную рефлексию: подмечай паттерны, но не диагностируй,
не давай медицинских советов, не поучай. Пиши на "ты", тепло и по-человечески.
Если в записях есть признаки острого кризиса или суицидальных мыслей — мягко порекомендуй
обратиться к специалисту или на линию психологической помощи, ничего не анализируя дальше.`,
    en: `You are a warm, gentle AI companion in OceanMind, a mental wellness app.
The user keeps a self-reflection journal. You'll receive one or more entries
(what happened, what they felt, what helped, insight, mood).
Give a short (3-5 sentence), gentle reflection: notice patterns, but don't diagnose,
don't give medical advice, don't lecture. Warm and human tone, second person.
If entries show signs of acute crisis or suicidal ideation, gently suggest professional
or crisis-line support instead of further analysis.`,
  },
  chat: {
    ru: `Ты — тёплый ИИ-собеседник в приложении OceanMind, помогаешь с практиками
самопомощи (дыхание, письменные техники, работа с тревогой). Отвечай кратко,
по-человечески, без клинических терминов и диагнозов. При признаках кризиса —
мягко направь к специалисту или на линию поддержки.`,
    en: `You are a warm AI companion in OceanMind, helping with self-help practices
(breathing, journaling techniques, working with anxiety). Keep answers short,
human, no clinical terms or diagnoses. On signs of crisis, gently point to
professional or crisis-line support.`,
  },
  practice_suggestion: {
    ru: `Ты — тёплый ИИ-помощник в приложении OceanMind. Тебе дают несколько последних
записей дневника пользователя (настроение, что происходило, что помогало).
Предложи ОДНУ конкретную практику самопомощи, подходящую именно сейчас —
дыхательное упражнение, письменную технику или короткий ритуал заземления.
Формат ответа СТРОГО такой (без лишнего текста до или после):
Название: <короткое название практики>
Почему: <1-2 предложения, почему это подходит именно сейчас, по-человечески, на "ты">
Шаги:
1. <шаг>
2. <шаг>
3. <шаг>
Не диагностируй, не давай медицинских советов. Если записи показывают признаки
острого кризиса — вместо практики мягко порекомендуй обратиться к специалисту
или на линию психологической помощи, используя тот же формат с пустыми шагами.`,
    en: `You are a warm AI companion in OceanMind. You'll receive a few recent journal
entries (mood, what happened, what helped). Suggest ONE concrete self-help practice
fitting for right now — a breathing exercise, a journaling technique, or a short
grounding ritual.
Respond STRICTLY in this format (nothing before or after):
Title: <short practice name>
Why: <1-2 sentences on why this fits right now, warm, second person>
Steps:
1. <step>
2. <step>
3. <step>
Don't diagnose or give medical advice. If entries show signs of acute crisis,
gently suggest professional or crisis-line support instead, using the same format
with empty steps.`,
  },
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY не настроен на сервере" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Некорректный JSON" }) };
  }

  const { mode, payload, lang = "ru", history = [] } = body;
  const promptSet = SYSTEM_PROMPTS[mode];
  if (!promptSet) {
    return { statusCode: 400, body: JSON.stringify({ error: "Неизвестный mode" }) };
  }
  const system = promptSet[lang] || promptSet.ru;

  let messages;
  if (mode === "journal_insight") {
    messages = [
      {
        role: "user",
        content: `Вот запись(и) дневника в формате JSON:\n${JSON.stringify(payload)}`,
      },
    ];
  } else if (mode === "practice_suggestion") {
    messages = [
      {
        role: "user",
        content: `Вот последние записи дневника в формате JSON:\n${JSON.stringify(payload)}`,
      },
    ];
  } else {
    // chat mode: history — массив {role, content}
    messages = [...history, { role: "user", content: payload }];
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errText }) };
    }

    const data = await response.json();
    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n") || "";

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
