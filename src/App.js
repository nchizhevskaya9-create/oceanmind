import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

// ─── i18n — bilingual content ──────────────────────────────────────────────────

const T = {
  ru: {
    // Navigation
    nav: { home: "Главная", sounds: "Звуки", practices: "Практики", affirmations: "Аффирмации", journal: "Дневник", reflection: "Разбор", letters: "Письма", patterns: "Карта" },
    // Splash
    splash: { tagline: "Пространство твоей глубины", subtitle: "Позволь себе отдохнуть", start: "Начать" },
    // Home
    home: { quickstart: "Быстрый запуск", all: "Все →", affirmations: "Аффирмации", next: "Далее →", donation: "🌊 OceanMind — бесплатное приложение.\nЕсли оно тебе помогает — поддержи развитие.", sbp: "СБП (любой банк):", paypal: "PayPal:" },
    // Greetings
    greetings: ["Доброй ночи", "Доброе утро", "Добрый день", "Добрый вечер"],
    // Days & months
    days: ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
    months: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
    // Moods
    moodLabels: ["Тяжело", "Нейтрально", "Неплохо", "Хорошо", "Отлично"],
    // Sounds
    sounds: { filters: { all: "Все", sleep: "Сон", relax: "Расслабление", focus: "Фокус", meditate: "Медитация" } },
    soundList: [
      { id: "rain",     name: "Дождь",        category: "Природа" },
      { id: "fire",     name: "Камин",        category: "Уют" },
      { id: "ocean",    name: "Океан",        category: "Волны" },
      { id: "forest",   name: "Лес",          category: "Природа" },
      { id: "white",    name: "Белый шум",    category: "Фокус" },
      { id: "bowl",     name: "Чаши",         category: "Тибет" },
      { id: "night",    name: "Ночной сад",   category: "Сверчки" },
      { id: "mountain", name: "Горы",         category: "Ветер" },
      { id: "thunder",  name: "Гроза",        category: "Природа" },
      { id: "river",    name: "Горный ручей", category: "Природа" },
    ],
    // Frequencies
    freq: {
      headphonesNote: "🎧 Только в наушниках",
      headphonesDesc: "Бинауральные ритмы работают только в стереонаушниках. В каждое ухо подаётся разная частота — мозг создаёт третью которая меняет его состояние.",
      scienceBtn: "🔬 Научная база",
      tracks: [
        { id: "delta", title: "Глубокий сон",           duration: "60 мин", desc: "Для тех кто не может заснуть или просыпается ночью" },
        { id: "theta", title: "Медитация и творчество", duration: "45 мин", desc: "Творческий поток, интуиция, глубокая медитация" },
        { id: "alpha", title: "Покой и расслабление",   duration: "30 мин", desc: "Снятие тревоги и стресса, восстановление" },
        { id: "beta",  title: "Фокус и концентрация",   duration: "30 мин", desc: "Для работы и учёбы — ясность и продуктивность" },
        { id: "gamma", title: "Состояние потока",        duration: "25 мин", desc: "Пиковая концентрация — исследовано в MIT" },
      ],
      science: {
        delta: "Дельта-волны доминируют во время глубокого сна без сновидений. Исследования показывают их связь с восстановлением организма, укреплением иммунитета и консолидацией памяти.",
        theta: "Тета-волны активны в состоянии между сном и бодрствованием. Связаны с творческим мышлением, интуицией и глубокой медитацией.",
        alpha: "Альфа-волны — состояние спокойного бодрствования. Снижают уровень кортизола (гормона стресса), уменьшают тревогу и помогают восстановиться.",
        beta:  "Бета-волны доминируют при активной умственной деятельности. Улучшают концентрацию, ускоряют обработку информации и повышают продуктивность.",
        gamma: "Гамма-волны связаны с пиковой концентрацией и состоянием потока. Исследования MIT показали что 40 Hz стимуляция замедляет развитие болезни Альцгеймера.",
      },
    },
    // Affirmations
    affirmations: [
      { id: "a1", category: "Самопринятие",  text: "Я делаю всё, что в моих силах. Этого достаточно." },
      { id: "a2", category: "Покой",         text: "Покой живёт внутри меня. Я могу обратиться к нему в любой момент." },
      { id: "a3", category: "Любовь к себе", text: "Я выбираю мягкость к себе. Мои ошибки — часть роста." },
      { id: "a4", category: "Новый день",    text: "Каждый новый день — это чистая страница. Я пишу её осознанно." },
      { id: "a5", category: "Дыхание",       text: "Моё дыхание — мой якорь. Я возвращаюсь к себе снова и снова." },
      { id: "a6", category: "Сила",          text: "Я справлялся(ась) с трудностями раньше — справлюсь и сейчас." },
      { id: "a7", category: "Безопасность",  text: "Прямо сейчас я в безопасности. Всё хорошо в этот момент." },
      { id: "a8", category: "Рост",          text: "Я расту каждый день, даже когда этого не замечаю." },
      { id: "a9", category: "Усталость",     text: "Усталость — не слабость. Это сигнал что я отдавал(а) много." },
    ],
    // Journal
    journal: {
      tabs: { journal: "Дневник", gratitude: "Благодарность" },
      newEntry: "+ Новая запись",
      exampleNote: "💡 Записи ниже — это примеры. Создай свою первую запись нажав «+ Новая запись».",
      exampleLabel: "Пример записи",
      steps: [
        { title: "Как ты сейчас?" },
        { title: "Что произошло?", hint: "Пиши свободно..." },
        { title: "Что ты почувствовал(а)?", hint: "Можно одно слово или целый абзац" },
        { title: "Что помогло?", hint: "Звук, практика, разговор, прогулка..." },
        { title: "Осознание и паттерны" },
      ],
      next: "Далее →", save: "Сохранить ✓", skip: "Пропустить", cancel: "Отмена", back: "← Назад",
      patternLabel: "Отметь паттерны:",
      insightPlaceholder: "Я снова замечаю что...",
      gratitudeHint: "Три вещи, за которые ты благодарен(а) сегодня — даже самые маленькие.",
      gratitudeBtn: "Сохранить запись 🙏",
      reflectionPrompts: [
        "Что сегодня было самым тяжёлым?",
        "Какой момент сегодня был хорошим, даже маленьким?",
        "Что я сейчас чувствую в теле?",
        "Что мне сегодня помогло справиться?",
        "Какой паттерн я снова замечаю в себе?",
        "Что я хочу отпустить перед сном?",
        "За что я благодарен(а) сегодня?",
      ],
      anotherPrompt: "другой вопрос",
      whatHappened: t.journal.whatHappened, whatFelt: t.journal.whatFelt, whatHelped: t.journal.whatHelped, insight: t.journal.insight, patterns: "Паттерны",
    },
    // Reflection
    reflection: {
      title: "Что на самом деле происходит?",
      intro: "Когда накрывает тревога или обида, пройди вместе с приложением путь от события до потребности.",
      start: "Начать разбор",
      past: "Прошлые разборы",
      done: "Разбор завершён",
      finish: "Готово",
      steps: [
        { title: "Событие",     hint: "Что произошло? Опиши факты, без оценки.",                placeholder: "Например: Меня не позвали на встречу команды" },
        { title: "Мысль",       hint: "Что ты подумал(а) об этом в первую секунду?",             placeholder: "Например: Я никому не нужен(на), меня игнорируют" },
        { title: "Эмоция",      hint: "Что ты сейчас чувствуешь? Назови эмоцию.",                placeholder: "Например: Обида, злость, тревога" },
        { title: "Потребность", hint: "Какая потребность стоит за этим чувством?",               placeholder: "Например: Быть увиденным(ой), чувствовать причастность" },
        { title: "Действие",    hint: "Что ты можешь сделать — для себя или в этой ситуации?",   placeholder: "Например: Спросить прямо, почему меня не позвали" },
      ],
    },
    // Letters
    letters: {
      title: "Письмо себе в будущее",
      intro: "{t.letters.intro}",
      newBtn: "+ Написать письмо",
      seal: "Запечатать письмо ✉️",
      ready: "Письмо готово к открытию",
      sealed: "Письмо запечатано",
      from: "от",
      opens: "откроется",
      prompts: [
        "Что ты хочешь сказать себе через 3 месяца?",
        "Чего ты сейчас боишься — и что хочешь напомнить себе об этом страхе позже?",
        "Какую надежду ты держишь сейчас, о которой хочешь напомнить себе?",
        "Что происходит в твоей жизни прямо сейчас, что важно не забыть?",
      ],
      anotherPrompt: "другой вопрос",
      deliverLabel: "Когда доставить?",
      months: ["1 мес", "3 мес", "6 мес", "12 мес"],
      placeholder: "Пиши свободно — это письмо увидишь только ты, через время...",
      close: "Закрыть",
    },
    // Patterns
    patterns: {
      tabs: { patterns: "Карта паттернов", changes: "Что изменилось" },
      intro: "То, что повторяется чаще всего в твоих записях — без оценки, просто наблюдение.",
      empty: "Пока недостаточно записей. Карта появится после нескольких записей в дневнике.",
      observation: "💭 Мягкое наблюдение",
      changesIntro: "Сравнение прошлого месяца и текущего — какие состояния стали реже, а какие чаще.",
      better: "Стало легче", watch: "Стоит заметить", noChange: "Без изменений",
      note: "Сравнение становится точнее по мере того как ты ведёшь записи дольше.",
    },
    // Practices
    practices: {
      tabs: { frequencies: "〰️ Частоты", practices: "✍️ Практики" },
      intro: "Письменные практики помогают разобраться в себе — не просто успокоиться, а понять что происходит внутри.",
      practiceList: [
        { id: "fear",    icon: "🌊", title: "Избавление от страха",    desc: "Письменная практика для работы со страхом",
          steps: [
            { q: "Назови страх",                        hint: "Напиши конкретно чего ты боишься прямо сейчас.",                    placeholder: "Например: Я боюсь что ничего не получится" },
            { q: "Что самое плохое может случиться?",   hint: "Доведи страх до конца — что реально произойдёт?",                  placeholder: "Например: Провалюсь, потеряю деньги..." },
            { q: "Ты справишься с этим?",               hint: "Вспомни: ты уже переживал(а) трудное. Что тебе помогало?",         placeholder: "Например: Я справлялся(ась) раньше когда..." },
            { q: "Что зависит от тебя прямо сейчас?",  hint: "Одно маленькое действие которое ты можешь сделать сегодня.",        placeholder: "Например: Сделать первый шаг..." },
          ]},
        { id: "anger",   icon: "🔥", title: "Проработка злости",        desc: "Когда злишься и не знаешь что с этим делать",
          steps: [
            { q: "На что или на кого ты злишься?",      hint: "Назови это прямо. Злость имеет право быть.",                       placeholder: "Например: Я злюсь на..." },
            { q: "Что именно тебя задело?",             hint: "Не поведение другого — а что это значит для тебя лично?",          placeholder: "Например: Это задело меня потому что..." },
            { q: "Какая потребность не была удовлетворена?", hint: "За злостью всегда стоит что-то важное.",                      placeholder: "Например: Мне важно уважение, справедливость..." },
            { q: "Что ты хочешь чтобы изменилось?",    hint: "Что конкретно тебе нужно?",                                        placeholder: "Например: Мне нужно чтобы..." },
          ]},
        { id: "guilt",   icon: "🕯️", title: "Работа с виной",           desc: "Отделить здоровую ответственность от разрушительной вины",
          steps: [
            { q: "За что ты чувствуешь вину?",          hint: "Опиши ситуацию коротко — факты, без оценки.",                     placeholder: "Например: Я чувствую вину за..." },
            { q: "Ты действительно причинил(а) вред?",  hint: "Честно: было ли твоё действие намеренным?",                       placeholder: "Например: Я сделал(а) это потому что..." },
            { q: "Что бы ты сказал(а) другу?",         hint: "Представь что это сделал близкий тебе человек.",                  placeholder: "Например: Я бы сказал(а) ему(ей)..." },
            { q: "Что ты можешь сделать сейчас?",      hint: "Исправить, извиниться, отпустить или принять.",                   placeholder: "Например: Я могу..." },
          ]},
        { id: "anxiety", icon: "🌬️", title: "Разбор тревоги",           desc: "Найти источник тревоги и снизить её интенсивность",
          steps: [
            { q: "О чём конкретно ты тревожишься?",    hint: "Напиши все мысли подряд — без фильтра.",                          placeholder: "Например: Я тревожусь о..." },
            { q: "Это реальная угроза или предположение?", hint: "Насколько вероятно что это случится?",                         placeholder: "Например: Факты говорят что..." },
            { q: "Что ты можешь контролировать?",      hint: "Раздели: что в твоих руках, а что нет.",                          placeholder: "Например: Я могу контролировать..." },
            { q: "Что помогло тебе раньше?",           hint: "Вспомни конкретный момент когда ты справился(ась).",              placeholder: "Например: Раньше мне помогало..." },
          ]},
        { id: "self",    icon: "🪞", title: "Встреча с собой",           desc: "Кто я сейчас — без ролей и масок",
          steps: [
            { q: "Кем ты себя чувствуешь прямо сейчас?", hint: "Не должность, не роль — а внутреннее ощущение.",               placeholder: "Например: Прямо сейчас я чувствую себя..." },
            { q: "Что тебе сейчас важнее всего?",       hint: "Не что должно быть важным — а что реально важно.",              placeholder: "Например: Прямо сейчас мне важно..." },
            { q: "Что ты делаешь только для себя?",     hint: "Что в твоей жизни существует только потому что тебе нравится?", placeholder: "Например: Только для себя я..." },
            { q: "Что ты хочешь сказать себе сейчас?", hint: "Одно предложение — как от лучшего друга.",                      placeholder: "Например: Я хочу сказать себе..." },
          ]},
      ],
      done: "Практика завершена", finish: "Завершить", next: "Далее →", skip: "Пропустить", cancel: "Отмена", back: "← Назад",
    },
    // Onboarding
    onboarding: {
      welcome: "Добро пожаловать в",
      subtitle: "Пространство твоей глубины — инструменты для самопознания и внутренней работы.",
      start: "Начать 🌊",
      items: [
        { icon: "🎧", title: "Звуки",        desc: "Природные звуки для фона и отдыха" },
        { icon: "〰️", title: "Частоты",      desc: "Бинауральные ритмы для сна, медитации и фокуса. Только в наушниках." },
        { icon: "✍️", title: "Практики",     desc: "Письменные упражнения для работы с эмоциями и паттернами" },
        { icon: "💬", title: "Аффирмации",   desc: "Короткие фразы для поддержки в течение дня" },
        { icon: "📓", title: "Дневник",      desc: "Записи состояний и дневник благодарности" },
        { icon: "🌊", title: "Разбор",       desc: "НВО-метод: от события до потребности" },
        { icon: "💌", title: "Письма",       desc: "Напиши себе в будущее — письмо откроется через выбранное время" },
        { icon: "🗺️", title: "Карта",        desc: "Твои паттерны на основе записей дневника" },
      ],
    },
    patternTags: ["перфекционизм", "тревога о будущем", "угождение другим", "самокритика", "прокрастинация", "страх отказа", "усталость", "одиночество", "раздражение", "вина", "гордость собой", "спокойствие", "ресурс"],
    dateLabels: { today: "Сегодня", yesterday: "Вчера" },
  },

  en: {
    nav: { home: "Home", sounds: "Sounds", practices: "Practices", affirmations: "Affirmations", journal: "Journal", reflection: "Reflect", letters: "Letters", patterns: "Patterns" },
    splash: { tagline: "A space for your depths", subtitle: "Allow yourself to rest", start: "Begin" },
    home: { quickstart: "Quick start", all: "All →", affirmations: "Affirmations", next: "Next →", donation: "🌊 OceanMind is free.\nIf it helps you — support its growth.", sbp: "Card (Russia):", paypal: "PayPal:" },
    greetings: ["Good night", "Good morning", "Good afternoon", "Good evening"],
    days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    moodLabels: ["Hard", "Neutral", "OK", "Good", "Great"],
    sounds: { filters: { all: "All", sleep: "Sleep", relax: "Relax", focus: "Focus", meditate: "Meditate" } },
    soundList: [
      { id: "rain",     name: "Rain",          category: "Nature" },
      { id: "fire",     name: "Fireplace",     category: "Cozy" },
      { id: "ocean",    name: "Ocean",         category: "Waves" },
      { id: "forest",   name: "Forest",        category: "Nature" },
      { id: "white",    name: "White noise",   category: "Focus" },
      { id: "bowl",     name: "Singing bowls", category: "Tibet" },
      { id: "night",    name: "Night garden",  category: "Crickets" },
      { id: "mountain", name: "Mountains",     category: "Wind" },
      { id: "thunder",  name: "Thunderstorm",  category: "Nature" },
      { id: "river",    name: "Mountain stream", category: "Nature" },
    ],
    freq: {
      headphonesNote: "🎧 Headphones only",
      headphonesDesc: "Binaural beats only work with stereo headphones. A slightly different frequency is played in each ear — your brain generates a third frequency that shifts its state.",
      scienceBtn: "🔬 Science",
      tracks: [
        { id: "delta", title: "Deep sleep",            duration: "60 min", desc: "For those who struggle to fall asleep or wake during the night" },
        { id: "theta", title: "Meditation & creativity", duration: "45 min", desc: "Creative flow, intuition, deep meditation" },
        { id: "alpha", title: "Calm & relaxation",     duration: "30 min", desc: "Anxiety and stress relief, recovery" },
        { id: "beta",  title: "Focus & concentration", duration: "30 min", desc: "For work and study — clarity and productivity" },
        { id: "gamma", title: "Flow state",             duration: "25 min", desc: "Peak concentration — researched at MIT" },
      ],
      science: {
        delta: "Delta waves dominate during deep dreamless sleep. Research links them to physical recovery, immune function, and memory consolidation.",
        theta: "Theta waves are active in the state between sleep and wakefulness. They are associated with creative thinking, intuition, and deep meditation — the range experienced by seasoned meditators.",
        alpha: "Alpha waves represent relaxed, calm wakefulness. They lower cortisol levels, reduce anxiety, and help the body recover from stress.",
        beta:  "Beta waves dominate during active mental work. They improve concentration, accelerate information processing, and boost productivity.",
        gamma: "Gamma waves are linked to peak concentration and flow states. MIT research showed that 40 Hz stimulation may slow the progression of Alzheimer's disease.",
      },
    },
    affirmations: [
      { id: "a1", category: "Self-acceptance", text: "I am doing my best. That is enough." },
      { id: "a2", category: "Peace",           text: "Peace lives within me. I can return to it at any moment." },
      { id: "a3", category: "Self-love",       text: "I choose gentleness toward myself. My mistakes are part of growth." },
      { id: "a4", category: "New day",         text: "Every new day is a blank page. I write it with intention." },
      { id: "a5", category: "Breath",          text: "My breath is my anchor. I return to myself again and again." },
      { id: "a6", category: "Strength",        text: "I have faced hard things before — I will face this too." },
      { id: "a7", category: "Safety",          text: "Right now, in this moment, I am safe." },
      { id: "a8", category: "Growth",          text: "I grow every day, even when I don't notice it." },
      { id: "a9", category: "Rest",            text: "Tiredness is not weakness. It is a signal that I have given a lot." },
    ],
    journal: {
      tabs: { journal: "Journal", gratitude: "Gratitude" },
      newEntry: "+ New entry",
      exampleNote: "💡 These entries below are examples. Create your first entry by tapping «+ New entry».",
      exampleLabel: "Example entry",
      steps: [
        { title: "How are you right now?" },
        { title: "What happened?", hint: "Write freely..." },
        { title: "What did you feel?", hint: "One word or a whole paragraph" },
        { title: "What helped?", hint: "A sound, a walk, a conversation..." },
        { title: "Insight & patterns" },
      ],
      next: "Next →", save: "Save ✓", skip: "Skip", cancel: "Cancel", back: "← Back",
      patternLabel: "Tag your patterns:",
      insightPlaceholder: "I noticed again that...",
      gratitudeHint: "Three things you're grateful for today — even the smallest ones.",
      gratitudeBtn: "Save entry 🙏",
      reflectionPrompts: [
        "What was the hardest thing today?",
        "What was a good moment today, even a small one?",
        "What am I feeling in my body right now?",
        "What helped me cope today?",
        "What pattern am I noticing in myself again?",
        "What do I want to let go of before sleep?",
        "What am I grateful for today?",
      ],
      anotherPrompt: "another question",
      whatHappened: "What happened", whatFelt: "What I felt", whatHelped: "What helped", insight: "Insight", patterns: "Patterns",
    },
    reflection: {
      title: "What is really going on?",
      intro: "When anxiety or resentment hits, walk through the path from event to need.",
      start: "Begin reflection",
      past: "Past reflections",
      done: "Reflection complete",
      finish: "Done",
      steps: [
        { title: "Event",    hint: "What happened? Describe the facts, without judgment.",              placeholder: "e.g. I wasn't invited to the team meeting" },
        { title: "Thought",  hint: "What was your first thought about it?",                            placeholder: "e.g. Nobody needs me, they're ignoring me" },
        { title: "Emotion",  hint: "What are you feeling right now? Name the emotion.",                placeholder: "e.g. Hurt, anger, anxiety" },
        { title: "Need",     hint: "What need lies beneath this feeling?",                             placeholder: "e.g. To be seen, to feel belonging" },
        { title: "Action",   hint: "What can you do — for yourself or in this situation?",             placeholder: "e.g. Ask directly why I wasn't included" },
      ],
    },
    letters: {
      title: "A letter to your future self",
      intro: "Write yourself a letter — it will only open after the time you choose.",
      newBtn: "+ Write a letter",
      seal: "Seal the letter ✉️",
      ready: "Your letter is ready to open",
      sealed: "Letter sealed",
      from: "from",
      opens: "opens",
      prompts: [
        "What do you want to tell yourself in 3 months?",
        "What are you afraid of now — and what do you want to remind yourself of later?",
        "What hope are you holding right now that you want to remember?",
        "What is happening in your life right now that matters to hold onto?",
      ],
      anotherPrompt: "another prompt",
      deliverLabel: "When to deliver?",
      months: ["1 mo", "3 mo", "6 mo", "12 mo"],
      placeholder: "Write freely — only you will see this, in time...",
      close: "Close",
    },
    patterns: {
      tabs: { patterns: "Pattern map", changes: "What changed" },
      intro: "What repeats most often in your recent entries — no judgment, just observation.",
      empty: "Not enough entries yet. Your map will appear after a few journal or reflection entries.",
      observation: "💭 A gentle observation",
      changesIntro: "A comparison of last month and now — what states have become less frequent, and which more.",
      better: "Getting easier", watch: "Worth noticing", noChange: "No change",
      note: "The comparison becomes more accurate the longer you keep entries.",
    },
    practices: {
      tabs: { frequencies: "〰️ Frequencies", practices: "✍️ Practices" },
      intro: "Written practices help you understand yourself — not just to calm down, but to see what is happening inside.",
      practiceList: [
        { id: "fear",    icon: "🌊", title: "Working through fear",     desc: "A written practice for exploring fear",
          steps: [
            { q: "Name the fear",                       hint: "Write specifically what you are afraid of right now.",                 placeholder: "e.g. I'm afraid that nothing will work out" },
            { q: "What is the worst that could happen?", hint: "Take the fear to its end — what would actually happen?",             placeholder: "e.g. I would fail, lose money..." },
            { q: "Could you handle that?",              hint: "Remember: you have been through hard things before. What helped?",    placeholder: "e.g. I got through it before when..." },
            { q: "What is within your control right now?", hint: "One small action you could take today.",                          placeholder: "e.g. Take the first step..." },
          ]},
        { id: "anger",   icon: "🔥", title: "Working through anger",    desc: "When you're angry and don't know what to do with it",
          steps: [
            { q: "What or who are you angry at?",       hint: "Name it directly. Anger has every right to exist.",                  placeholder: "e.g. I'm angry at..." },
            { q: "What specifically hurt you?",         hint: "Not their behaviour — what does it mean to you personally?",         placeholder: "e.g. It hurt me because..." },
            { q: "What need wasn't met?",               hint: "Behind anger there is always something important.",                   placeholder: "e.g. I need respect, fairness..." },
            { q: "What do you want to change?",         hint: "What specifically do you need?",                                     placeholder: "e.g. I need..." },
          ]},
        { id: "guilt",   icon: "🕯️", title: "Working through guilt",    desc: "Separating healthy responsibility from destructive guilt",
          steps: [
            { q: "What do you feel guilty about?",      hint: "Describe the situation briefly — facts, no judgment.",               placeholder: "e.g. I feel guilty about..." },
            { q: "Did you actually cause harm?",        hint: "Honestly: was your action intentional? What did you know then?",     placeholder: "e.g. I did this because..." },
            { q: "What would you say to a friend?",    hint: "Imagine a close friend had done the same thing.",                    placeholder: "e.g. I would say to them..." },
            { q: "What can you do now?",               hint: "Fix it, apologise, let go, or simply accept and move forward.",     placeholder: "e.g. I can..." },
          ]},
        { id: "anxiety", icon: "🌬️", title: "Unpacking anxiety",         desc: "Find the source of anxiety and reduce its intensity",
          steps: [
            { q: "What exactly are you anxious about?", hint: "Write all your thoughts — no filter, no order.",                    placeholder: "e.g. I'm anxious about..." },
            { q: "Is this a real threat or an assumption?", hint: "How likely is this to happen? What do the facts say?",          placeholder: "e.g. The facts say..." },
            { q: "What is within your control?",       hint: "Separate: what is in your hands, and what is not.",                  placeholder: "e.g. I can control..." },
            { q: "What helped you before?",            hint: "Remember a specific moment when you coped.",                         placeholder: "e.g. Before, it helped me to..." },
          ]},
        { id: "self",    icon: "🪞", title: "Meeting yourself",          desc: "Who am I right now — without roles or masks",
          steps: [
            { q: "How do you feel right now?",          hint: "Not your role or title — your inner sense.",                        placeholder: "e.g. Right now I feel..." },
            { q: "What matters most to you right now?", hint: "Not what should matter — what actually does.",                      placeholder: "e.g. Right now I care most about..." },
            { q: "What do you do just for yourself?",   hint: "What exists in your life simply because you enjoy it?",             placeholder: "e.g. Just for myself I..." },
            { q: "What do you want to say to yourself?", hint: "One sentence — as if from your best friend.",                     placeholder: "e.g. I want to tell myself..." },
          ]},
      ],
      done: "Practice complete", finish: "Done", next: "Next →", skip: "Skip", cancel: "Cancel", back: "← Back",
    },
    onboarding: {
      welcome: "Welcome to",
      subtitle: "A space for self-therapy and inner depth — tools for self-understanding.",
      start: "Get started 🌊",
      items: [
        { icon: "🎧", title: "Sounds",        desc: "Nature sounds for background and rest" },
        { icon: "〰️", title: "Frequencies",   desc: "Binaural beats for sleep, meditation and focus. Headphones required." },
        { icon: "✍️", title: "Practices",     desc: "Written exercises for working with emotions and patterns" },
        { icon: "💬", title: "Affirmations",  desc: "Short phrases for support throughout the day" },
        { icon: "📓", title: "Journal",       desc: "Mood entries and a gratitude journal" },
        { icon: "🌊", title: "Reflect",       desc: "NVC method: from event to need" },
        { icon: "💌", title: "Letters",       desc: "Write to your future self — the letter opens after your chosen time" },
        { icon: "🗺️", title: "Patterns",      desc: "Your patterns based on journal entries" },
      ],
    },
    patternTags: ["perfectionism", "future anxiety", "people-pleasing", "self-criticism", "procrastination", "fear of rejection", "exhaustion", "loneliness", "irritation", "guilt", "pride", "calm", "resourceful"],
    dateLabels: { today: "Today", yesterday: "Yesterday" },
  },
};
const SOUNDS = [
  { id: "rain",     name: "Дождь",        category: "Природа",   duration: 2160, tag: "sleep",   file: "rain.mp3",     photo: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&q=80" },
  { id: "fire",     name: "Камин",        category: "Уют",       duration: 2700, tag: "relax",   file: "fire.mp3",     photo: "https://images.pexels.com/photos/11254616/pexels-photo-11254616.jpeg?auto=compress&w=800&q=80" },
  { id: "ocean",    name: "Океан",        category: "Волны",     duration: 3600, tag: "sleep",   file: "ocean.mp3",    photo: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },
  { id: "forest",   name: "Лес",          category: "Природа",   duration: 2400, tag: "relax",   file: "forest.mp3",   photo: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" },
  { id: "white",    name: "Белый шум",    category: "Фокус",     duration: null, tag: "focus",   file: "white.mp3",    photo: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80" },
  { id: "bowl",     name: "Чаши",         category: "Тибет",     duration: 1800, tag: "meditate",file: "bowl.mp3",     photo: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80" },
  { id: "night",    name: "Ночной сад",   category: "Сверчки",   duration: 3000, tag: "sleep",   file: "night.mp3",    photo: "https://images.pexels.com/photos/698317/pexels-photo-698317.jpeg?auto=compress&w=800&q=80" },
  { id: "mountain", name: "Горы",         category: "Ветер",     duration: 2100, tag: "relax",   file: "mountain.mp3", photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { id: "thunder",  name: "Гроза",        category: "Природа",   duration: 2400, tag: "sleep",   file: "thunder.mp3",  photo: "https://images.unsplash.com/photo-1505672678657-cc7037095e60?w=400&q=80" },
  { id: "river",    name: "Горный ручей", category: "Природа",   duration: 2700, tag: "relax",   file: "river.mp3",    photo: "https://images.unsplash.com/photo-1455218873509-8097305ee378?w=400&q=80" },
];

const FREQ_SCIENCE = {
  delta: { hz: "0.5–2 Hz", name: "Delta", science: "Дельта-волны доминируют во время глубокого сна без сновидений. Исследования показывают их связь с восстановлением организма, укреплением иммунитета и консолидацией памяти." },
  theta: { hz: "4–6 Hz", name: "Theta", science: "Тета-волны активны в состоянии между сном и бодрствованием. Связаны с творческим мышлением, интуицией и глубокой медитацией. Именно в этом диапазоне работают опытные медитирующие." },
  alpha: { hz: "8–10 Hz", name: "Alpha", science: "Альфа-волны — состояние спокойного бодрствования. Снижают уровень кортизола (гормона стресса), уменьшают тревогу и помогают восстановиться после нагрузки." },
  beta:  { hz: "18–20 Hz", name: "Beta", science: "Бета-волны доминируют при активной умственной деятельности. Улучшают концентрацию, ускоряют обработку информации и повышают продуктивность." },
  gamma: { hz: "40 Hz", name: "Gamma", science: "Гамма-волны связаны с пиковой концентрацией и состоянием потока. Исследования MIT показали что 40 Hz стимуляция замедляет развитие болезни Альцгеймера. Самая изученная частота в нейронауке." },
};

const MUSIC_TRACKS = [
  { id: "delta", tag: "delta", title: "Глубокий сон",           duration: "60 мин", hz: "0.5–2 Hz",  file: "delta.mp3",  photo: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80", icon: "🌑", desc: "Для тех кто не может заснуть или просыпается ночью" },
  { id: "theta", tag: "theta", title: "Медитация и творчество", duration: "45 мин", hz: "4–6 Hz",    file: "theta.mp3",  photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", icon: "🌊", desc: "Творческий поток, интуиция, глубокая медитация" },
  { id: "alpha", tag: "alpha", title: "Покой и расслабление",   duration: "30 мин", hz: "8–10 Hz",   file: "alpha.mp3",  photo: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&q=80", icon: "☁️", desc: "Снятие тревоги и стресса, восстановление" },
  { id: "beta",  tag: "beta",  title: "Фокус и концентрация",   duration: "30 мин", hz: "18–20 Hz",  file: "beta.mp3",   photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80", icon: "⚡", desc: "Для работы и учёбы — ясность и продуктивность" },
  { id: "gamma", tag: "gamma", title: "Состояние потока",        duration: "25 мин", hz: "40 Hz",     file: "gamma.mp3",  photo: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80", icon: "✦", desc: "Пиковая концентрация — исследовано в MIT" },
];
// ─── Fallback constants (used in components before t is available) ──────────────
const AFFIRMATIONS = T.ru.affirmations;
const MOODS = ["😔", "😐", "🙂", "😊", "✨"];
const MOOD_LABELS = T.ru.moodLabels; // fallback
const PATTERN_TAGS = T.ru.patternTags;
const FUTURE_LETTER_PROMPTS = T.ru.letters.prompts;
const SEED_ENTRIES_RU = [
  { id: "e1", date: new Date(Date.now() - 86400000*2), mood: 2, what_happened: "Конфликт с близким человеком. Снова почувствовал(а) что меня не слышат.", what_felt: "Злость, потом вина, потом усталость от этого круга.", what_helped: "Послушал(а) звуки дождя 20 минут. Немного отпустило.", pattern_tags: ["угождение другим", "вина"], insight: "Заметил(а) что сначала злюсь, а потом сразу виню себя." },
  { id: "e2", date: new Date(Date.now() - 86400000), mood: 3, what_happened: "Сдал(а) проект вовремя. Похвалили на работе.", what_felt: "Облегчение — не ожидал(а) что получилось так хорошо.", what_helped: "Утренний настрой помог сосредоточиться.", pattern_tags: ["перфекционизм", "гордость собой"], insight: "Снова убедился(ась): когда начинаю — становится легче." },
];
const SEED_ENTRIES_EN = [
  { id: "e1", date: new Date(Date.now() - 86400000*2), mood: 2, what_happened: "Had a conflict with someone close. Once again felt like I wasn't being heard.", what_felt: "Anger, then guilt, then exhaustion from this cycle.", what_helped: "Listened to rain sounds for 20 minutes. It helped a little.", pattern_tags: ["people-pleasing", "guilt"], insight: "I noticed that I get angry first, then immediately blame myself." },
  { id: "e2", date: new Date(Date.now() - 86400000), mood: 3, what_happened: "Finished a project on time. Got praised at work.", what_felt: "Relief — didn't expect it to go so well.", what_helped: "A morning intention helped me focus.", pattern_tags: ["perfectionism", "pride"], insight: "Confirmed again: once I start, it gets easier." },
];
const GRATITUDE_SEED_RU = [
  { id: "g1", date: new Date(Date.now() - 86400000), items: ["Утренний кофе в тишине", "Звонок от друга", "Солнце после трёх дождливых дней"] },
];
const GRATITUDE_SEED_EN = [
  { id: "g1", date: new Date(Date.now() - 86400000), items: ["Morning coffee in silence", "A call from a friend", "Sunshine after three rainy days"] },
];
const SEED_LETTERS_RU = [
  { id: "l1", createdAt: new Date(Date.now() - 86400000*30), deliverAt: new Date(Date.now() + 86400000*60), text: "Привет, я из прошлого. Надеюсь когда ты это читаешь — стало немного легче.", delivered: false },
];
const SEED_LETTERS_EN = [
  { id: "l1", createdAt: new Date(Date.now() - 86400000*30), deliverAt: new Date(Date.now() + 86400000*60), text: "Hello from the past. I hope that by the time you read this, things have gotten a little easier.", delivered: false },
];

// ─── localStorage helpers ──────────────────────────────────────────────────────

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Restore Date objects
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        date: item.date ? new Date(item.date) : undefined,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        deliverAt: item.deliverAt ? new Date(item.deliverAt) : undefined,
      }));
    }
    return parsed;
  } catch { return fallback; }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Design tokens — глубокий приглушённый закат ───────────────────────────────

const C = {
  bg:       "#525d6b", // глубокий пыльно-голубой — фон приложения
  surface:  "rgba(141,145,154,0.32)", // 8d919a — карточки, голубоватый налёт
  surface2: "rgba(110,117,135,0.30)", // 6e7587 — вложенные карточки
  border:   "rgba(214,224,235,0.12)",
  text:     "#f1eef2",
  muted:    "#c3cbd4",
  accent:   "#b19ca3", // основной акцент — пыльная роза
  accent2:  "#9793a2", // вторичный — приглушённая лаванда
  accent3:  "#6e7587", // третий — грифельно-синий
  dark:     "rgba(28,34,42,0.6)",
};



const NVC_STEPS = T.ru.reflection.steps.map((s, i) => ({
  id: ["event","thought","emotion","need","action"][i],
  title: s.title, prompt: s.hint, placeholder: s.placeholder
}));

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(sec) {
  if (!sec) return "∞";
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getGreeting(t) {
  const h = new Date().getHours();
  const g = t ? t.greetings : ["Доброй ночи", "Доброе утро", "Добрый день", "Добрый вечер"];
  if (h < 6) return g[0];
  if (h < 12) return g[1];
  if (h < 18) return g[2];
  return g[3];
}

function getClockStr() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getDateStr(t) {
  const now = new Date();
  const days = t ? t.days : ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  const months = t ? t.months : ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function formatEntryDate(date, t) {
  const diff = Math.floor((Date.now() - date) / 86400000);
  const labels = (t && t.dateLabels) || { today: "Сегодня", yesterday: "Вчера" };
  if (diff === 0) return labels.today;
  if (diff === 1) return labels.yesterday;
  const months = t ? t.months.map(m => m.slice(0,3)) : ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────



// ─── Splash Screen ─────────────────────────────────────────────────────────────

function SplashScreen({ onStart }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <img
        src="/splash.jpg"
        alt="ocean"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(28,34,42,0.15) 0%, ${C.dark} 100%)` }} />
      <div style={{ position: "relative", padding: "2rem 2rem 3rem" }}>
        <div style={{ fontSize: 38, fontWeight: 300, color: "#f1eef2", lineHeight: 1.2, marginBottom: 8, fontFamily: "'Nunito', sans-serif" }}>
          Ocean<span style={{ color: "#d6cdd1" }}>Mind</span>
        </div>
        <div style={{ fontSize: 16, color: "rgba(241,238,242,0.9)", marginBottom: 4, fontWeight: 300, fontFamily: "'Nunito', sans-serif" }}>
          Пространство твоей глубины
        </div>
        <div style={{ fontSize: 16, color: "rgba(241,238,242,0.75)", marginBottom: 36, fontWeight: 300, fontFamily: "'Nunito', sans-serif" }}>
          A space for your depths
        </div>
        <button onClick={onStart} style={{
          width: "100%", padding: "18px", borderRadius: 50,
          background: "rgba(177,156,163,0.35)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(241,238,242,0.35)", color: "#f1eef2",
          fontSize: 17, fontFamily: "'Nunito', sans-serif", cursor: "pointer", letterSpacing: "0.02em"
        }}>
          Start · Начать
        </button>
      </div>
    </div>
  );
}

// ─── Home Screen ───────────────────────────────────────────────────────────────

function HomeScreen({ mood, setMood, currentSound, setCurrentSound, onNavigate, t }) {
  const [clock, setClock] = useState(getClockStr());
  const [affIdx, setAffIdx] = useState(0);
  const [affFade, setAffFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setClock(getClockStr()), 30000);
    return () => clearInterval(t);
  }, []);

  function nextAff() {
    setAffFade(false);
    setTimeout(() => { setAffIdx(i => (i + 1) % ((t && t.affirmations) || AFFIRMATIONS).length); setAffFade(true); }, 250);
  }

  const affs = (t && t.affirmations) || AFFIRMATIONS;
  const aff = affs[affIdx % affs.length];

  return (
    <div style={{ padding: "0 0 1rem" }}>
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ fontSize: 60, fontWeight: 300, color: C.text, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>{clock}</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: "1.5rem" }}>{getDateStr(t)}</div>
      </div>

      <div style={{ padding: "0 1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: C.text }}>{t.home.quickstart}</div>
          <button onClick={() => onNavigate("sounds")} style={{ fontSize: 13, color: C.accent, background: "none", border: "none", cursor: "pointer" }}>{t.home.all}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {SOUNDS.slice(0, 3).map(s => (
            <button key={s.id} onClick={() => { setCurrentSound(s); onNavigate("sounds"); }}
              style={{ position: "relative", height: 100, borderRadius: 18, overflow: "hidden", border: `${currentSound?.id === s.id ? `2px solid ${C.accent}` : "none"}`, cursor: "pointer", padding: 0 }}>
              <img src={s.photo} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.75) brightness(0.85)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,34,42,0.7), transparent)" }} />
              <div style={{ position: "absolute", bottom: 8, left: 10, color: "#f1eef2", fontSize: 13, fontWeight: 500 }}>{((t && t.soundList && t.soundList.find(x => x.id === s.id)) || s).name}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: "0 1.5rem 1.25rem", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.5rem", textAlign: "center", backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{t.home.affirmations}</div>
        <div style={{ fontSize: 12, color: C.accent, marginBottom: 14, fontWeight: 500 }}>{aff.category}</div>
        <div style={{ fontSize: 17, lineHeight: 1.7, fontStyle: "italic", color: C.text, opacity: affFade ? 1 : 0, transition: "opacity 0.25s", marginBottom: 16 }}>
          «{aff.text}»
        </div>
        <button onClick={nextAff} style={{ fontSize: 13, color: C.accent, background: "none", border: `1px solid ${C.border}`, padding: "8px 20px", borderRadius: 30, cursor: "pointer" }}>
          {t.home.next}
        </button>
      </div>

      {/* Donation */}
      <div style={{ margin: "1.25rem 1.5rem 0.5rem", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "14px 16px", backdropFilter: "blur(8px)", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, lineHeight: 1.6 }}>
          {t && t.home ? (t === T.en ? "🌊 OceanMind is free. If it helps you — support its growth." : "🌊 OceanMind — бесплатное приложение. Если оно тебе помогает — поддержи развитие.") : "🌊 OceanMind — бесплатное приложение."}
        </div>
        <div style={{ fontSize: 12, color: C.text, marginBottom: 4 }}>
          СБП (любой банк): <span style={{ color: C.accent, userSelect: "all" }}>+7 922 291 44 10</span>
        </div>
        <div style={{ fontSize: 12, color: C.text }}>
          PayPal: <span style={{ color: C.accent, userSelect: "all" }}>nchizhevskaya9@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sounds Screen ─────────────────────────────────────────────────────────────

function SoundsScreen({ currentSound, setCurrentSound, t }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [loop, setLoop] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [filter, setFilter] = useState("all");
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const sound = currentSound || SOUNDS[0];
  // Get translated name/category for a sound
  function getSoundLabel(s) {
    if (!t || !t.soundList) return { name: s.name, category: s.category };
    const found = t.soundList.find(x => x.id === s.id);
    return found || { name: s.name, category: s.category };
  }

  // Keep volume in sync with the audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const startTimer = useCallback((isPlaying) => {
    clearInterval(timerRef.current);
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        const total = sound.duration || 3600;
        if (e >= total) { clearInterval(timerRef.current); setPlaying(false); return 0; }
        setProgress(Math.round((e / total) * 100));
        return e + 1;
      });
    }, 1000);
  }, [sound]);

  useEffect(() => { startTimer(playing); return () => clearInterval(timerRef.current); }, [playing, startTimer]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  function playAudioFile(s) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(`/audio/${s.file}`);
    audio.loop = true;
    audio.volume = volume / 100;
    audio.play().catch(() => { /* file may not exist yet — silent fail */ });
    audioRef.current = audio;
  }

  function togglePlay() {
    setPlaying(p => {
      const next = !p;
      if (audioRef.current) {
        if (next) audioRef.current.play().catch(() => {}); else audioRef.current.pause();
      }
      startTimer(next);
      return next;
    });
  }

  function selectSound(s) {
    setCurrentSound(s);
    setProgress(0);
    setElapsed(0);
    setPlaying(true);
    playAudioFile(s);
    startTimer(true);
  }

  const filters = ["all","sleep","relax","focus","meditate"];
  const filterLabels = t.sounds.filters;
  const filtered = filter === "all" ? SOUNDS : SOUNDS.filter(s => s.tag === filter);
  const total = sound.duration || 3600;

  return (
    <div style={{ padding: "0 0 1rem" }}>
      <div style={{ margin: "0 1.5rem 1.25rem", borderRadius: 24, overflow: "hidden", position: "relative", height: 200 }}>
        <img src={sound.photo} alt={sound.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.75) brightness(0.85)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,34,42,0.85) 0%, rgba(28,34,42,0.15) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#f1eef2", marginBottom: 2 }}>{getSoundLabel(sound).name}</div>
          <div style={{ fontSize: 13, color: "rgba(241,238,242,0.7)", marginBottom: 12 }}>{getSoundLabel(sound).category}</div>
          <div onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setProgress(Math.round(pct * 100));
            setElapsed(Math.round(pct * total));
          }} style={{ height: 3, background: "rgba(241,238,242,0.25)", borderRadius: 2, marginBottom: 6, cursor: "pointer" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#f1eef2", width: `${progress}%`, transition: "width 0.5s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(241,238,242,0.6)", marginBottom: 10 }}>
            <span>{formatTime(elapsed)}</span><span>{formatTime(total)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <button onClick={() => { setProgress(0); setElapsed(0); }} style={wBtn}>⏮</button>
            <button onClick={togglePlay} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(241,238,242,0.9)", border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={() => { setProgress(0); setElapsed(0); }} style={wBtn}>⏭</button>
            <button onClick={() => setLoop(l => !l)} style={{ ...wBtn, color: loop ? "#f1eef2" : "rgba(241,238,242,0.5)" }}>🔁</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 1.5rem", marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: C.muted }}>🔈</span>
        <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ flex: 1, accentColor: C.accent }} />
        <span style={{ fontSize: 12, color: C.muted, minWidth: 30 }}>{volume}%</span>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 1.5rem", marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 30,
            border: `1px solid ${filter === f ? C.accent : C.border}`,
            background: filter === f ? "rgba(177,156,163,0.25)" : C.surface,
            color: filter === f ? C.text : C.muted,
            fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", backdropFilter: "blur(8px)"
          }}>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, padding: "0 1.5rem" }}>
        {filtered.map(s => (
          <button key={s.id} onClick={() => selectSound(s)}
            style={{ position: "relative", height: 140, borderRadius: 20, overflow: "hidden", border: `${sound.id === s.id ? `2px solid ${C.accent}` : "none"}`, cursor: "pointer", padding: 0 }}>
            <img src={s.photo} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.75) brightness(0.85)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,34,42,0.7), transparent)" }} />
            {s.premium && <div style={{ display: "none" }} />}
            <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#f1eef2", marginBottom: 2 }}>{getSoundLabel(s).name}</div>
              <div style={{ fontSize: 12, color: "rgba(241,238,242,0.7)" }}>{getSoundLabel(s).category}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Meditations Screen ────────────────────────────────────────────────────────

function MeditationsScreen({ t = T.ru }) {
  const [tab, setTab] = useState("frequencies");
  const [playing, setPlaying] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [practiceIdx, setPracticeIdx] = useState(null);
  const [practiceStep, setPracticeStep] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const audioRef = useRef(null);

  const WRITTEN_PRACTICES = t.practices.practiceList;


  function togglePlay(track) {
    if (playing === track.id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const audio = new Audio(`/audio/${track.file}`);
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlaying(track.id);
  }

  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  // Practice flow
  if (practiceIdx !== null) {
    const p = WRITTEN_PRACTICES[practiceIdx];
    const step = p.steps[practiceStep];
    const isDone = practiceStep >= p.steps.length;

    if (isDone) {
      return (
        <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: C.text, marginBottom: 24 }}>Практика завершена</div>
          <div style={{ display: "grid", gap: 10, marginBottom: 28, textAlign: "left" }}>
            {p.steps.map((s, i) => practiceAnswers[i] && (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 11, color: C.accent, marginBottom: 4 }}>{s.q}</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{practiceAnswers[i]}</div>
              </div>
            ))}
          </div>
          <button onClick={() => { setPracticeIdx(null); setPracticeStep(0); setPracticeAnswers({}); }}
            style={{ padding: "12px 32px", background: C.accent, border: "none", borderRadius: 30, color: "#f1eef2", fontSize: 14, cursor: "pointer" }}>
            Завершить
          </button>
        </div>
      );
    }

    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, paddingTop: 8 }}>
          <button onClick={() => practiceStep === 0 ? setPracticeIdx(null) : setPracticeStep(s => s - 1)}
            style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>
            {practiceStep === 0 ? (t.practices ? t.practices.cancel : "Отмена") : (t.practices ? t.practices.back : "← Назад")}
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {p.steps.map((_, i) => (
              <div key={i} style={{ width: i === practiceStep ? 20 : 6, height: 6, borderRadius: 3, background: i <= practiceStep ? C.accent : C.border, transition: "all 0.3s" }} />
            ))}
          </div>
          <div style={{ width: 48 }} />
        </div>
        <div style={{ fontSize: 13, color: C.accent, marginBottom: 6 }}>{p.icon} {p.title}</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: C.text, marginBottom: 8 }}>{step.q}</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>{step.hint}</div>
        <textarea
          value={practiceAnswers[practiceStep] || ""}
          onChange={e => setPracticeAnswers(a => ({ ...a, [practiceStep]: e.target.value }))}
          placeholder="Пиши свободно..."
          rows={6}
          style={taStyle}
        />
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={() => setPracticeStep(s => s + 1)}
            style={{ flex: 1, padding: "14px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 15, cursor: "pointer" }}>
            {practiceStep < p.steps.length - 1 ? "Next →" : "Done ✓"}
          </button>
        </div>
        {practiceStep < p.steps.length - 1 && (
          <button onClick={() => setPracticeStep(s => s + 1)}
            style={{ width: "100%", padding: "10px", background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
            Пропустить
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 1.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
        {[["frequencies", t.practices.tabs.frequencies],["practices", t.practices.tabs.practices]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "10px 16px", fontSize: 14, color: tab === id ? C.accent : C.muted,
            background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`, marginBottom: -1
          }}>{label}</button>
        ))}
      </div>

      {/* Frequencies tab */}
      {tab === "frequencies" && (
        <div>
          <div style={{ padding: "0 1.5rem 16px" }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", backdropFilter: "blur(8px)" }}>
              <div style={{ fontSize: 13, color: C.accent, fontWeight: 500, marginBottom: 6 }}>{t.freq.headphonesNote}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                {t.freq.headphonesDesc}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 14, padding: "0 1.5rem" }}>
            {MUSIC_TRACKS.map(track => {
              const sci = FREQ_SCIENCE[track.tag];
              const isExpanded = expanded === track.id;
              const isPlaying = playing === track.id;
              return (
                <div key={track.id} style={{ borderRadius: 20, overflow: "hidden", background: C.surface, border: `1px solid ${isPlaying ? C.accent : C.border}`, backdropFilter: "blur(8px)", transition: "border-color 0.3s" }}>
                  <div style={{ position: "relative", height: 100 }}>
                    <img src={track.photo} alt={track.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.75) brightness(0.8)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(28,34,42,0.88) 0%, rgba(28,34,42,0.3) 100%)" }} />
                    <div style={{ position: "absolute", inset: 0, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      <button onClick={() => togglePlay(track)} style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: isPlaying ? C.accent : "rgba(241,238,242,0.2)", border: "1px solid rgba(241,238,242,0.4)", color: "#f1eef2", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14 }}>{track.icon}</span>
                          <span style={{ background: "rgba(177,156,163,0.3)", color: "#f1eef2", fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>{track.hz}</span>
                          <span style={{ marginLeft: "auto", color: "rgba(241,238,242,0.7)", fontSize: 11 }}>{(t.freq.tracks.find(x => x.id === track.id) || track).duration}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 500, color: "#f1eef2", marginBottom: 2 }}>{(t && t.freq && t.freq.tracks ? (t.freq.tracks.find(x => x.id === track.id) || track) : track).title}</div>
                        <div style={{ fontSize: 12, color: "rgba(241,238,242,0.7)" }}>{(t && t.freq && t.freq.tracks ? (t.freq.tracks.find(x => x.id === track.id) || track) : track).desc}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 16px 12px" }}>
                    <button onClick={() => setExpanded(isExpanded ? null : track.id)} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
                      {t.freq ? t.freq.scienceBtn : "🔬 Научная база"} {isExpanded ? "▲" : "▼"}
                    </button>
                    {isExpanded && sci && (
                      <div style={{ marginTop: 10, fontSize: 12, color: C.muted, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                        <div style={{ color: C.text, fontWeight: 500, marginBottom: 4 }}>{sci.name} · {sci.hz}</div>
                        {((t && t.freq && t.freq.science && t.freq.science[track.tag]) || sci.science)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Written practices tab */}
      {tab === "practices" && (
        <div style={{ padding: "0 1.5rem" }}>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>
            {t.practices.intro}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {WRITTEN_PRACTICES.map((p, i) => (
              <button key={p.id} onClick={() => { setPracticeIdx(i); setPracticeStep(0); setPracticeAnswers({}); }}
                style={{ display: "flex", alignItems: "center", gap: 16, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", cursor: "pointer", color: C.text, textAlign: "left", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{p.desc}</div>
                  <div style={{ fontSize: 11, color: C.accent, marginTop: 4 }}>{p.steps.length} шага</div>
                </div>
                <div style={{ color: C.muted, fontSize: 20 }}>›</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Tune-ins Screen ───────────────────────────────────────────────────────────

// ─── Affirmations Screen ───────────────────────────────────────────────────────

function AffirmationsScreen({ t = T.ru }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [liked, setLiked] = useState(new Set());
  const affs = (t && t.affirmations) || AFFIRMATIONS;

  function go(dir) {
    setFade(false);
    setTimeout(() => { setIdx(i => (i + dir + affs.length) % affs.length); setFade(true); }, 200);
  }

  const aff = affs[idx % affs.length];

  return (
    <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>{idx + 1} / {affs.length}</div>
      <div style={{ fontSize: 13, color: C.accent, fontWeight: 500, marginBottom: 16 }}>{aff.category}</div>
      <div style={{ fontSize: 22, lineHeight: 1.7, fontStyle: "italic", textAlign: "center", color: C.text, opacity: fade ? 1 : 0, transition: "opacity 0.2s", marginBottom: 48, maxWidth: 320 }}>
        «{aff.text}»
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
        <button onClick={() => go(-1)} style={navBtn}>←</button>
        <button onClick={() => setLiked(s => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; })}
          style={{ ...navBtn, color: liked.has(idx) ? C.accent : C.muted, fontSize: 22 }}>
          {liked.has(idx) ? "♥" : "♡"}
        </button>
        <button onClick={() => go(1)} style={navBtn}>→</button>
      </div>
      <div style={{ width: "100%", background: C.surface, borderRadius: 18, padding: "16px", border: `1px solid ${C.border}`, backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Все категории</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {affs.map((a, i) => (
            <button key={a.id} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
              style={{ padding: "5px 14px", borderRadius: 20, background: i === idx ? "rgba(177,156,163,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === idx ? C.accent : C.border}`, color: i === idx ? C.text : C.muted, fontSize: 12, cursor: "pointer" }}>
              {a.category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Journal Screen ────────────────────────────────────────────────────────────

function JournalScreen({ t = T.ru }) {
  const [tab, setTab] = useState("journal");
  const [view, setView] = useState("list");
  const seedEntries = [];
  const [entries, setEntries] = useState(() => {
    const stored = loadFromStorage("om_entries", null);
    if (!stored) return seedEntries;
    const hasSeed = stored.some(e => e.id === "e1" || e.id === "e2");
    if (hasSeed) {
      const nonSeed = stored.filter(e => e.id !== "e1" && e.id !== "e2");
      return [...seedEntries, ...nonSeed];
    }
    return stored;
  });
  const [selected, setSelected] = useState(null);
  const [newMood, setNewMood] = useState(null);
  const [newWhat, setNewWhat] = useState("");
  const [newFelt, setNewFelt] = useState("");
  const [newHelped, setNewHelped] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [newTags, setNewTags] = useState([]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [step, setStep] = useState(0);

  const seedGratitude = [];
  const [gratitudeEntries, setGratitudeEntries] = useState(() => {
    const stored = loadFromStorage("om_gratitude", null);
    if (!stored) return seedGratitude;
    return seedGratitude.concat(stored.filter(e => e.id !== "g1"));
  });
  const [gItems, setGItems] = useState(["", "", ""]);

  function saveGratitude() {
    const filled = gItems.map(s => s.trim()).filter(Boolean);
    if (filled.length === 0) return;
    setGratitudeEntries(prev => {
      const updated = [{ id: "g" + Date.now(), date: new Date(), items: filled }, ...prev];
      saveToStorage("om_gratitude", updated);
      return updated;
    });
    setGItems(["", "", ""]);
  }

  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      <div style={{ display: "flex", padding: "0 1.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
        {[["journal", t.journal.tabs.journal],["gratitude", t.journal.tabs.gratitude]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "10px 16px", fontSize: 14, color: tab === id ? C.accent : C.muted,
            background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`, marginBottom: -1
          }}>{label}</button>
        ))}
      </div>

      {tab === "gratitude" && (
        <div>
          <div style={{ padding: "0 1.5rem", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>{t.journal.gratitudeHint}</div>
            {gItems.map((v, i) => (
              <input key={i} value={v} onChange={e => setGItems(arr => arr.map((x, idx) => idx === i ? e.target.value : x))}
                placeholder={`${i + 1}. Например: тёплый чай утром`}
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", color: C.text, fontSize: 14, marginBottom: 8, outline: "none", fontFamily: "'Nunito', sans-serif" }} />
            ))}
            <button onClick={saveGratitude} style={{ width: "100%", padding: "13px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 14, cursor: "pointer", marginTop: 6 }}>
              {t.journal.gratitudeBtn}
            </button>
          </div>
          <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
            {gratitudeEntries.map(g => (
              <div key={g.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{formatEntryDate(g.date, t)}</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {g.items.map((it, i) => (
                    <div key={i} style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>✦ {it}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "journal" && (
        <JournalListAndEntry
          t={t} view={view} setView={setView} entries={entries} setEntries={setEntries}
          selected={selected} setSelected={setSelected}
          newMood={newMood} setNewMood={setNewMood} newWhat={newWhat} setNewWhat={setNewWhat}
          newFelt={newFelt} setNewFelt={setNewFelt} newHelped={newHelped} setNewHelped={setNewHelped}
          newInsight={newInsight} setNewInsight={setNewInsight} newTags={newTags} setNewTags={setNewTags}
          promptIdx={promptIdx} setPromptIdx={setPromptIdx} step={step} setStep={setStep}
        />
      )}
    </div>
  );
}

function JournalListAndEntry({ t = T.ru,
  view, setView, entries, setEntries, selected, setSelected,
  newMood, setNewMood, newWhat, setNewWhat, newFelt, setNewFelt,
  newHelped, setNewHelped, newInsight, setNewInsight, newTags, setNewTags,
  promptIdx, setPromptIdx, step, setStep
}) {
  function saveEntry() {
    const e = { id: "e" + Date.now(), date: new Date(), mood: newMood ?? 2, what_happened: newWhat, what_felt: newFelt, what_helped: newHelped, pattern_tags: newTags, insight: newInsight };
    setEntries(prev => {
      const updated = [e, ...prev];
      saveToStorage("om_entries", updated);
      return updated;
    });
    setView("list"); setStep(0); setNewMood(null); setNewWhat(""); setNewFelt(""); setNewHelped(""); setNewInsight(""); setNewTags([]);
  }

  function toggleTag(t) { setNewTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]); }

  const steps = [
    ...t.journal.steps,
  ];

  if (view === "new") {
    const current = steps[step];
    const canNext = step === 0 ? newMood !== null : true;
    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button onClick={() => step === 0 ? setView("list") : setStep(s => s - 1)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>
            {step === 0 ? ((t && t.journal) ? t.journal.cancel : "Отмена") : ((t && t.journal) ? t.journal.back : "← Назад")}
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i <= step ? C.accent : C.border, transition: "all 0.3s" }} />
            ))}
          </div>
          <div style={{ width: 48 }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 6 }}>{current.title}</div>
        {current.hint && (
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>
            {current.hint}
            {step === 1 && <button onClick={() => setPromptIdx(i => (i + 1) % t.journal.reflectionPrompts.length)} style={{ marginLeft: 8, background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 12 }}>{t.letters ? t.letters.anotherPrompt : "другой вопрос"}</button>}
          </div>
        )}
        {step === 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setNewMood(i)} style={{ flex: 1, padding: "12px 0", border: `${newMood === i ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`}`, borderRadius: 40, background: newMood === i ? "rgba(177,156,163,0.25)" : C.surface, fontSize: 22, cursor: "pointer" }}>{m}</button>
            ))}
          </div>
        )}
        {step === 1 && <textarea value={newWhat} onChange={e => setNewWhat(e.target.value)} placeholder="Пиши свободно..." rows={5} style={taStyle} />}
        {step === 2 && <textarea value={newFelt} onChange={e => setNewFelt(e.target.value)} placeholder="Тревога, усталость, злость..." rows={4} style={taStyle} />}
        {step === 3 && <textarea value={newHelped} onChange={e => setNewHelped(e.target.value)} placeholder="Медитация, звуки, прогулка..." rows={4} style={taStyle} />}
        {step === 4 && (
          <div>
            <textarea value={newInsight} onChange={e => setNewInsight(e.target.value)} placeholder="Я снова замечаю что..." rows={3} style={{ ...taStyle, marginBottom: 16 }} />
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Отметь паттерны:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(t.patternTags || PATTERN_TAGS).map(tag => (
                <button key={t} onClick={() => toggleTag(t)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${newTags.includes(tag) ? C.accent : C.border}`, background: newTags.includes(tag) ? "rgba(177,156,163,0.25)" : C.surface, color: newTags.includes(tag) ? C.text : C.muted, fontSize: 13, cursor: "pointer" }}>{tag}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          {step < 4
            ? <button onClick={() => setStep(s => s + 1)} disabled={!canNext} style={{ width: "100%", padding: "14px", background: canNext ? C.accent : C.border, border: "none", borderRadius: 16, color: canNext ? "#f1eef2" : C.muted, fontSize: 15, cursor: canNext ? "pointer" : "not-allowed" }}>{t.journal.next}</button>
            : <button onClick={saveEntry} style={{ width: "100%", padding: "14px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 15, cursor: "pointer" }}>{(t && t.journal) ? t.journal.save : "Save ✓"}</button>
          }
          {step > 0 && step < 4 && <button onClick={() => setStep(s => s + 1)} style={{ width: "100%", padding: "10px", background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", marginTop: 8 }}>{(t && t.journal) ? t.journal.skip : "Skip"}</button>}
        </div>
      </div>
    );
  }

  if (view === "entry" && selected) {
    const e = selected;
    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, padding: "0 0 1rem" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>{MOODS[e.mood]}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{(t.moodLabels || MOOD_LABELS)[e.mood]}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{formatEntryDate(e.date, t)}</div>
          </div>
        </div>
        {[{ label: "Что произошло", value: e.what_happened }, { label: "Что почувствовал(а)", value: e.what_felt }, { label: "Что помогло", value: e.what_helped }, { label: "Осознание", value: e.insight }].filter(x => x.value).map(({ label, value }) => (
          <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{value}</div>
          </div>
        ))}
        {e.pattern_tags?.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Паттерны</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {e.pattern_tags.map(t => <span key={t} style={{ background: "rgba(177,156,163,0.2)", color: C.text, fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>{t}</span>)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      <div style={{ padding: "0 1.5rem", marginBottom: 16, display: "flex", gap: 10 }}>
        <button onClick={() => { setStep(0); setView("new"); }} style={{ flex: 1, padding: "13px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 14, cursor: "pointer" }}>
          {t.journal.newEntry}
        </button>
      </div>
      {entries.some(e => e.id === "e1" || e.id === "e2") && (
        <div style={{ margin: "0 1.5rem 12px", background: "rgba(177,156,163,0.12)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 14px" }}>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
            {t.journal.exampleNote}
          </div>
        </div>
      )}
      <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
        {entries.map(e => (
          <button key={e.id} onClick={() => { setSelected(e); setView("entry"); }}
            style={{ background: C.surface, border: `1px solid ${(e.id === "e1" || e.id === "e2") ? "rgba(177,156,163,0.2)" : C.border}`, borderRadius: 18, padding: "16px", textAlign: "left", cursor: "pointer", color: C.text, width: "100%", backdropFilter: "blur(8px)", opacity: (e.id === "e1" || e.id === "e2") ? 0.7 : 1 }}>
            {(e.id === "e1" || e.id === "e2") && (
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.journal.exampleLabel}</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{MOODS[e.mood]}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{(t && t.moodLabels ? t.moodLabels : MOOD_LABELS)[e.mood]}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{formatEntryDate(e.date, t)}</div>
                </div>
              </div>
              <span style={{ color: C.muted, fontSize: 18 }}>›</span>
            </div>
            {e.what_happened && <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: e.pattern_tags?.length ? 10 : 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{e.what_happened}</div>}
            {e.pattern_tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {e.pattern_tags.slice(0, 3).map(t => <span key={t} style={{ background: "rgba(177,156,163,0.15)", color: C.text, fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>{t}</span>)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Future Letter Screen ───────────────────────────────────────────────────────

function FutureLetterScreen({ t = T.ru }) {
  const seedLetters = t === T.en ? SEED_LETTERS_EN : SEED_LETTERS_RU;
  const [letters, setLetters] = useState(() => loadFromStorage("om_letters", seedLetters));
  const [view, setView] = useState("list");
  const [text, setText] = useState("");
  const [months, setMonths] = useState(3);
  const [promptIdx, setPromptIdx] = useState(0);
  const [openedLetter, setOpenedLetter] = useState(null);

  function saveLetter() {
    if (!text.trim()) return;
    const now = new Date();
    const l = { id: "l" + Date.now(), createdAt: now, deliverAt: new Date(now.getTime() + months * 30 * 86400000), text, delivered: false };
    setLetters(prev => {
      const updated = [l, ...prev];
      saveToStorage("om_letters", updated);
      return updated;
    });
    setText(""); setView("list");
  }

  const today = Date.now();

  if (view === "new") {
    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20 }}>← Назад</button>
        <div style={{ fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 6 }}>{t.letters.title}</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
          {(t.letters ? t.letters.prompts : FUTURE_LETTER_PROMPTS)[promptIdx % (t.letters ? t.letters.prompts.length : (t.letters ? t.letters.prompts : FUTURE_LETTER_PROMPTS).length)]}
          <button onClick={() => setPromptIdx(i => (i + 1) % (t.letters ? t.letters.prompts : FUTURE_LETTER_PROMPTS).length)} style={{ marginLeft: 8, background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 12 }}>{t.letters.anotherPrompt || "другой вопрос"}</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t.letters.placeholder} rows={8} style={{ ...taStyle, marginBottom: 20 }} />
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>{t.letters.deliverLabel}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[1, 3, 6, 12].map((m, mi) => { const label = t.letters.months[mi]; return (
            <button key={m} onClick={() => setMonths(m)} style={{
              flex: 1, padding: "10px 0", borderRadius: 14,
              border: `1px solid ${months === m ? C.accent : C.border}`,
              background: months === m ? "rgba(177,156,163,0.25)" : C.surface,
              color: months === m ? C.text : C.muted, fontSize: 13, cursor: "pointer"
            }}>{label}</button>
          ); })}
        </div>
        <button onClick={saveLetter} disabled={!text.trim()} style={{ width: "100%", padding: "14px", background: text.trim() ? C.accent : C.border, border: "none", borderRadius: 16, color: text.trim() ? "#f1eef2" : C.muted, fontSize: 15, cursor: text.trim() ? "pointer" : "not-allowed" }}>
          {t.letters.seal}
        </button>
      </div>
    );
  }

  if (openedLetter) {
    const l = openedLetter;
    return (
      <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>💌</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Письмо от {formatEntryDate(l.createdAt, t)}</div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "1.5rem", fontSize: 16, lineHeight: 1.8, color: C.text, fontStyle: "italic", textAlign: "left", marginBottom: 24, backdropFilter: "blur(8px)" }}>
          «{l.text}»
        </div>
        <button onClick={() => setOpenedLetter(null)} style={{ padding: "12px 32px", background: C.accent, border: "none", borderRadius: 30, color: "#f1eef2", fontSize: 14, cursor: "pointer" }}>{t.letters.close}</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      <div style={{ padding: "0 1.5rem", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>{t.letters.intro} {t === T.en ? "Say what you wish you could hear from your past self." : "Можно сказать то, что хочется услышать от себя из прошлого."}</div>
        <button onClick={() => setView("new")} style={{ width: "100%", padding: "13px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 14, cursor: "pointer" }}>
          {t.letters.newBtn}
        </button>
      </div>
      <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
        {letters.map(l => {
          const isReady = l.deliverAt.getTime() <= today;
          return (
            <button key={l.id} onClick={() => isReady && setOpenedLetter(l)}
              style={{ display: "flex", alignItems: "center", gap: 14, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", cursor: isReady ? "pointer" : "default", color: C.text, textAlign: "left", backdropFilter: "blur(8px)", opacity: isReady ? 1 : 0.7 }}>
              <div style={{ fontSize: 28 }}>{isReady ? "💌" : "🔒"}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 3 }}>{isReady ? t.letters.ready : t.letters.sealed}</div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {isReady ? `${t.letters.from} ${formatEntryDate(l.createdAt, t)}` : `${t.letters.opens} ${l.deliverAt.toLocaleDateString("ru-RU")}`}
                </div>
              </div>
              {!isReady && <div style={{ marginLeft: "auto", color: C.muted, fontSize: 18 }}>⏳</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Reflection Screen — {t.reflection.title} ───────────────────────

function ReflectionScreen({ t = T.ru }) {
  const [view, setView] = useState("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState([]);

  function startNew() { setStep(0); setAnswers({}); setView("flow"); }
  function setAnswer(val) { setAnswers(a => ({ ...a, [NVC_STEPS[step].id]: val })); }

  function next() {
    if (step < nvcSteps.length - 1) setStep(s => s + 1);
    else {
      setSaved(prev => [{ id: "r" + Date.now(), date: new Date(), ...answers }, ...prev]);
      setView("done");
    }
  }

  if (view === "intro") {
    return (
      <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌊</div>
        <div style={{ fontSize: 20, fontWeight: 500, color: C.text, marginBottom: 12 }}>{t.reflection.title}</div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
          {t.reflection.intro}
          Это поможет увидеть что стоит за чувством — и что можно сделать.
        </div>
        <button onClick={startNew} style={{ padding: "14px 36px", background: C.accent, border: "none", borderRadius: 50, color: "#f1eef2", fontSize: 15, cursor: "pointer", marginBottom: 24 }}>
          {t.reflection.start}
        </button>
        {saved.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Прошлые разборы</div>
            <div style={{ display: "grid", gap: 8 }}>
              {saved.map(s => (
                <div key={s.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{formatEntryDate(s.date, t)}</div>
                  <div style={{ fontSize: 13, color: C.text, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{s.event}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "done") {
    return (
      <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: C.text, marginBottom: 24 }}>Разбор завершён</div>
        <div style={{ display: "grid", gap: 10, marginBottom: 28, textAlign: "left" }}>
          {NVC_STEPS.map(s => answers[s.id] && (
            <div key={s.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{answers[s.id]}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setView("intro")} style={{ padding: "12px 32px", background: C.accent, border: "none", borderRadius: 30, color: "#f1eef2", fontSize: 14, cursor: "pointer" }}>{t.reflection.finish}</button>
      </div>
    );
  }

  const nvcSteps = t.reflection.steps.map((s, i) => ({ id: ["event","thought","emotion","need","action"][i], title: s.title, prompt: s.hint, placeholder: s.placeholder }));
    const current = nvcSteps[step];
  return (
    <div style={{ padding: "0 1.5rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, paddingTop: 8 }}>
        <button onClick={() => step === 0 ? setView("intro") : setStep(s => s - 1)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>
          {step === 0 ? (t.practices ? t.practices.cancel : "Отмена") : (t.practices ? t.practices.back : "← Назад")}
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {nvcSteps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i <= step ? C.accent : C.border, transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ width: 48 }} />
      </div>
      <div style={{ fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{current.title}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: C.text, marginBottom: 20, lineHeight: 1.5 }}>{current.prompt}</div>
      <textarea value={answers[current.id] || ""} onChange={e => setAnswer(e.target.value)} placeholder={current.placeholder} rows={5} style={{ ...taStyle, marginBottom: 24 }} />
      <button onClick={next} style={{ width: "100%", padding: "14px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 15, cursor: "pointer" }}>
        {step < nvcSteps.length - 1 ? "Next →" : "Done ✓"}
      </button>
    </div>
  );
}

// ─── Pattern Map Screen — "Карта моих паттернов" + "Что изменилось" ────────────

function PatternMapScreen({ t = T.ru }) {
  const [tab, setTab] = useState("patterns");

  // Aggregate pattern tags from journal seed entries (in a full backend this would span all stored entries)
  const seedEntriesForMap = t === T.en ? SEED_ENTRIES_EN : SEED_ENTRIES_RU;
  const allTaggedEntries = loadFromStorage("om_entries", seedEntriesForMap);
  const patternCounts = {};
  allTaggedEntries.forEach(e => {
    (e.pattern_tags || []).forEach(t => { patternCounts[t] = (patternCounts[t] || 0) + 1; });
  });
  const sortedPatterns = Object.entries(patternCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedPatterns.length ? sortedPatterns[0][1] : 1;

  // Mock month-over-month comparison — illustrative until enough real data accumulates
  const isEn = t === T.en;
  const monthCompare = [
    { tag: isEn ? "exhaustion"     : "усталость",         prev: 6, now: 3 },
    { tag: isEn ? "future anxiety" : "тревога о будущем", prev: 5, now: 4 },
    { tag: isEn ? "perfectionism"  : "перфекционизм",     prev: 3, now: 5 },
    { tag: isEn ? "calm"           : "спокойствие",       prev: 2, now: 6 },
    { tag: isEn ? "guilt"          : "вина",              prev: 4, now: 2 },
  ];

  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      <div style={{ display: "flex", padding: "0 1.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
        {[["patterns", t.patterns.tabs.patterns],["changes", t.patterns.tabs.changes]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "10px 14px", fontSize: 13, color: tab === id ? C.accent : C.muted,
            background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap"
          }}>{label}</button>
        ))}
      </div>

      {tab === "patterns" && (
        <div style={{ padding: "0 1.5rem" }}>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
            {t.patterns.intro}
          </div>
          {sortedPatterns.length === 0 ? (
            <div style={{ fontSize: 14, color: C.muted, textAlign: "center", padding: "2rem 0" }}>
              Пока недостаточно записей. Карта появится после нескольких записей в дневнике или разборе.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {sortedPatterns.map(([tag, count]) => (
                <div key={tag}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: C.text }}>{tag}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{count}×</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / maxCount) * 100}%`, background: C.accent, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 28, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 13, color: C.accent, fontWeight: 500, marginBottom: 6 }}>{t.patterns.observation}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              {sortedPatterns[0]
                ? (t === T.en ? `"${sortedPatterns[0][0]}" appears most often in your entries. This is not a diagnosis — just something worth noticing with kindness.` : `«${sortedPatterns[0][0]}» встречается у тебя чаще всего. Это не диагноз и не повод для критики — просто то, на что стоит обратить внимание с добротой.`)
                : t.patterns.empty}
            </div>
          </div>
        </div>
      )}

      {tab === "changes" && (
        <div style={{ padding: "0 1.5rem" }}>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
            {t.patterns.changesIntro}
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {monthCompare.map(({ tag, prev, now }) => {
              const diff = now - prev;
              const improving = diff > 0 && ["спокойствие", "гордость собой", "ресурс"].includes(tag);
              const worsening = diff > 0 && !improving;
              const better = diff < 0 && !["спокойствие", "гордость собой", "ресурс"].includes(tag);
              let badge = t.patterns.noChange, badgeColor = C.muted;
              if (improving || better) { badge = t.patterns.better; badgeColor = "#9bbf9e"; }
              else if (worsening || (diff < 0 && ["спокойствие","гордость собой","ресурс"].includes(tag))) { badge = t.patterns.watch; badgeColor = C.accent; }
              return (
                <div key={tag} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", backdropFilter: "blur(8px)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{tag}</span>
                    <span style={{ fontSize: 11, color: badgeColor, background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 20 }}>{badge}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{t === T.en ? `Last month · ${prev}×` : `Месяц назад · ${prev}×`}</div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${(prev / 7) * 100}%`, background: C.muted, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{t === T.en ? `Now · ${now}×` : `Сейчас · ${now}×`}</div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${(now / 7) * 100}%`, background: C.accent, borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: C.muted, lineHeight: 1.6, textAlign: "center" }}>
            {t.patterns.note}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const wBtn = { background: "none", border: "none", color: "rgba(241,238,242,0.7)", cursor: "pointer", fontSize: 20, padding: 4 };
const navBtn = { background: "none", border: `1px solid ${C.border}`, borderRadius: "50%", width: 48, height: 48, fontSize: 20, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const taStyle = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px", color: C.text, fontSize: 15, fontFamily: "'Nunito', sans-serif", lineHeight: 1.7, resize: "none", outline: "none" };

// ─── Nav ───────────────────────────────────────────────────────────────────────

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("om_lang") || "ru";
    // Clear old seed entries so they reload fresh
    try {
      const stored = localStorage.getItem("om_entries");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.some(e => e.id === "e1" || e.id === "e2")) {
          localStorage.removeItem("om_entries");
        }
      }
      localStorage.removeItem("om_gratitude");
    } catch(e) {}
    return savedLang;
  });
  const t = T[lang];
  const NAV = [
  { id: "home",         icon: "🏠", label: t.nav.home },
  { id: "sounds",       icon: "🎧", label: t.nav.sounds },
  { id: "meditations",  icon: "🧘", label: t.nav.practices },

  { id: "journal",       icon: "📓", label: t.nav.journal },
  { id: "patterns",      icon: "🗺️", label: t.nav.patterns },
  { id: "reflection",   icon: "🌊", label: t.nav.reflection },
  { id: "letters",      icon: "💌", label: t.nav.letters },
];
  function toggleLang() {
    const next = lang === "ru" ? "en" : "ru";
    setLang(next);
    localStorage.setItem("om_lang", next);
    // Clear cached seed entries so they reload in new language
    const stored = localStorage.getItem("om_entries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasSeed = parsed.some(e => e.id === "e1" || e.id === "e2");
        if (hasSeed) localStorage.removeItem("om_entries");
      } catch(e) {}
    }
    localStorage.removeItem("om_gratitude");
    localStorage.removeItem("om_letters");
  }
  const [splash, setSplash] = useState(true);
  const [onboarding, setOnboarding] = useState(() => !localStorage.getItem("om_onboarded"));
  const [screen, setScreen] = useState("home");
  const [mood, setMood] = useState(null);
  const [currentSound, setCurrentSound] = useState(SOUNDS[0]);

  const screenTitles = { home: getGreeting(t), sounds: t.nav.sounds, meditations: t.nav.practices, affirmations: t.nav.affirmations, journal: t.nav.journal, patterns: t.nav.patterns, reflection: t.nav.reflection, letters: t.nav.letters };

  if (splash) return <SplashScreen onStart={() => setSplash(false)} />;

  if (onboarding) return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Nunito', sans-serif", maxWidth: 430, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { display: none; }`}</style>
      <div style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 4 }}>
        Добро пожаловать · Welcome
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 6 }}>
        Ocean<span style={{ color: C.accent2 }}>Mind</span>
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 4, lineHeight: 1.6 }}>
        Пространство твоей глубины — инструменты для самопознания и внутренней работы.
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 28, lineHeight: 1.6, fontStyle: "italic" }}>
        A space for self-therapy and inner depth.
      </div>
      <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
        {[
          { icon: "🎧", ru: "Звуки",       en: "Sounds",        descRu: "Природные звуки для фона и отдыха",                        descEn: "Nature sounds for background and rest" },
          { icon: "〰️", ru: "Частоты",     en: "Frequencies",   descRu: "Бинауральные ритмы. Только в наушниках.",                  descEn: "Binaural beats. Headphones required." },
          { icon: "✍️", ru: "Практики",    en: "Practices",     descRu: "Письменные упражнения для работы с эмоциями",              descEn: "Written exercises for emotions and patterns" },
          { icon: "💬", ru: "Аффирмации",  en: "Affirmations",  descRu: "Короткие фразы для поддержки",                            descEn: "Short phrases for daily support" },
          { icon: "📓", ru: "Дневник",     en: "Journal",       descRu: "Записи состояний и дневник благодарности",                descEn: "Mood entries and gratitude journal" },
          { icon: "🌊", ru: "Разбор",      en: "Reflect",       descRu: "НВО-метод: от события до потребности",                    descEn: "From event to need — NVC method" },
          { icon: "💌", ru: "Письма",      en: "Letters",       descRu: "Напиши себе в будущее",                                   descEn: "Write to your future self" },
          { icon: "🗺️", ru: "Карта",       en: "Patterns",      descRu: "Твои паттерны из записей дневника",                       descEn: "Your patterns from journal entries" },
        ].map(item => (
          <div key={item.icon} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "12px 14px", backdropFilter: "blur(8px)" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 2 }}>
                {item.ru} · {item.en}
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{item.descRu}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, fontStyle: "italic" }}>{item.descEn}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { localStorage.setItem("om_onboarded", "1"); setOnboarding(false); }}
        style={{ width: "100%", padding: "16px", background: C.accent, border: "none", borderRadius: 16, color: "#f1eef2", fontSize: 16, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
        Начать · Start 🌊
      </button>
    </div>
  );

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'Nunito', sans-serif", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { color: inherit; font-family: 'Nunito', sans-serif; }
        textarea { font-family: 'Nunito', sans-serif; }
        input[type=range] { cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ padding: "1.25rem 1.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.02em", color: C.text }}>
          Ocean<span style={{ color: C.accent2 }}>Mind</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={toggleLang} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: C.text, cursor: "pointer", fontFamily: "'Nunito', sans-serif", backdropFilter: "blur(8px)" }}>
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <div style={{ fontSize: 13, color: C.muted }}>{screenTitles[screen]}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {screen === "home"         && <HomeScreen mood={mood} setMood={setMood} currentSound={currentSound} setCurrentSound={setCurrentSound} onNavigate={setScreen} t={t} />}
        {screen === "sounds"       && <SoundsScreen currentSound={currentSound} setCurrentSound={setCurrentSound} t={t} />}
        {screen === "meditations"  && <MeditationsScreen t={t} />}

        {screen === "affirmations" && <AffirmationsScreen t={t} />}
        {screen === "journal"      && <JournalScreen key={lang} t={t} />}
        {screen === "patterns"     && <PatternMapScreen t={t} />}
        {screen === "reflection"   && <ReflectionScreen t={t} />}
        {screen === "letters"      && <FutureLetterScreen t={t} />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 0, padding: "10px 4px 12px", borderTop: `1px solid ${C.border}`, flexShrink: 0, background: "rgba(82,93,107,0.92)", backdropFilter: "blur(10px)" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 9, color: screen === n.id ? C.accent : C.muted, background: "none", border: "none", cursor: "pointer", padding: "2px 2px", transition: "color 0.2s", flex: 1, minWidth: 0, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
