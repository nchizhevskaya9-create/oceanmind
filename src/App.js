import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const SOUNDS = [
  { id: "rain",     name: "Дождь",        category: "Природа",   duration: 2160, tag: "sleep",   photo: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&q=80" },
  { id: "fire",     name: "Камин",        category: "Уют",       duration: 2700, tag: "relax",   photo: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&q=80" },
  { id: "ocean",    name: "Океан",        category: "Волны",     duration: 3600, tag: "sleep",   photo: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },
  { id: "forest",   name: "Лес",          category: "Природа",   duration: 2400, tag: "relax",   photo: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" },
  { id: "white",    name: "Белый шум",    category: "Фокус",     duration: null, tag: "focus",   photo: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80" },
  { id: "binaural", name: "Бинауральные", category: "Δ 2 Гц",   duration: 3600, tag: "sleep",   photo: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80", premium: true },
  { id: "bowl",     name: "Чаши",         category: "Тибет",     duration: 1800, tag: "meditate",photo: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80" },
  { id: "night",    name: "Ночной сад",   category: "Сверчки",   duration: 3000, tag: "sleep",   photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: "mountain", name: "Горы",         category: "Ветер",     duration: 2100, tag: "relax",   photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { id: "cafe",     name: "Кофейня",      category: "Городской", duration: 3600, tag: "focus",   photo: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80", premium: true },
  { id: "thunder",  name: "Гроза",        category: "Природа",   duration: 2400, tag: "sleep",   photo: "https://images.unsplash.com/photo-1505672678657-cc7037095e60?w=400&q=80" },
  { id: "river",    name: "Горный ручей", category: "Природа",   duration: 2700, tag: "relax",   photo: "https://images.unsplash.com/photo-1455218873509-8097305ee378?w=400&q=80" },
];

const MEDITATIONS = [
  { id: "m1", tag: "sleep",   title: "Погружение в тишину",     duration: "20 мин", level: "Начинающим",  desc: "Мягкое сканирование тела перед сном",               photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
  { id: "m2", tag: "stress",  title: "Освобождение от тревоги", duration: "15 мин", level: "Дыхание",      desc: "Техника 4-7-8 для успокоения нервной системы",      photo: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&q=80" },
  { id: "m3", tag: "focus",   title: "Ясность ума",             duration: "10 мин", level: "Осознанность", desc: "Практика присутствия здесь и сейчас",               photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80" },
  { id: "m4", tag: "sleep",   title: "Скан тела",               duration: "30 мин", level: "Body scan",    desc: "Классическая практика MBSR для глубокого сна",      photo: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80", premium: true },
  { id: "m5", tag: "stress",  title: "Земля под ногами",        duration: "12 мин", level: "Заземление",   desc: "Практика 5-4-3-2-1 при панике и тревоге",           photo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80" },
  { id: "m6", tag: "focus",   title: "Концентрация на дыхании", duration: "8 мин",  level: "Базовая",      desc: "Классическая медитация для развития внимания",      photo: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80" },
];

const MORNING_PRACTICES = [
  { id: "p1", tag: "morning",   title: "Намерение дня",       duration: "5 мин",  desc: "Задайте тон всему дню через намерение" },
  { id: "p2", tag: "breath",    title: "Бодрящее дыхание",    duration: "8 мин",  desc: "Техника Вим Хофа для энергии с утра" },
  { id: "p3", tag: "gratitude", title: "Три благодарности",   duration: "3 мин",  desc: "Дневник благодарности для позитивного настроя" },
  { id: "p4", tag: "stretch",   title: "Утренняя растяжка",   duration: "10 мин", desc: "Мягкая йога для пробуждения тела", premium: true },
  { id: "p5", tag: "morning",   title: "Визуализация успеха", duration: "7 мин",  desc: "Представьте идеальную версию своего дня" },
];

const AFFIRMATIONS = [
  { id: "a1", category: "Самопринятие",      text: "Я достаточна. Я делаю всё, что в моих силах, и этого хватает." },
  { id: "a2", category: "Покой",             text: "Покой живёт внутри меня. Я могу обратиться к нему в любой момент." },
  { id: "a3", category: "Любовь к себе",    text: "Я выбираю мягкость к себе. Мои ошибки — часть роста." },
  { id: "a4", category: "Новый день",        text: "Каждый новый день — это чистая страница. Я пишу её с любовью." },
  { id: "a5", category: "Дыхание",           text: "Моё дыхание — мой якорь. Я возвращаюсь к себе снова и снова." },
  { id: "a6", category: "Сила",              text: "Я справлялась с трудностями раньше — справлюсь и сейчас." },
  { id: "a7", category: "Безопасность",      text: "Прямо сейчас я в безопасности. Всё хорошо в этот момент." },
  { id: "a8", category: "Рост",              text: "Я расту каждый день, даже когда этого не замечаю." },
];

const TUNE_INS = [
  { id: "t1", category: "Утренний настрой", icon: "🌅", title: "Начни день с намерения",   lines: ["Сегодня я выбираю спокойствие.", "Я открыта для хорошего.", "Моя энергия идёт туда, где мне важно."] },
  { id: "t2", category: "После работы",     icon: "🌆", title: "Перезагрузка после дня",   lines: ["Рабочий день окончен — я отпускаю его.", "Мои достижения сегодня реальны.", "Теперь время для себя."] },
  { id: "t3", category: "Перед сном",       icon: "🌙", title: "Плавный уход в ночь",      lines: ["Я благодарна за этот день.", "Я отпускаю всё незавершённое.", "Моё тело готово к отдыху."] },
  { id: "t4", category: "При тревоге",      icon: "🌬️", title: "Если тревога накрывает",   lines: ["Прямо сейчас я в безопасности.", "Это чувство временно — оно пройдёт.", "Я дышу и возвращаюсь к себе."] },
  { id: "t5", category: "Уверенность",      icon: "⚡", title: "Перед важным событием",    lines: ["Я готова. Я справлюсь.", "Мой опыт и знания со мной.", "Я делаю всё, что могу — и этого достаточно."] },
  { id: "t6", category: "Благодарность",    icon: "💛", title: "Практика благодарности",   lines: ["Три вещи, за которые я благодарна сегодня...", "Одна маленькая победа этого дня...", "Человек, которому я мысленно говорю спасибо..."] },
];

const MOODS = ["😔", "😐", "🙂", "😊", "✨"];
const MOOD_LABELS = ["Тяжело", "Нейтрально", "Неплохо", "Хорошо", "Отлично"];

const TAG_COLORS = {
  sleep:    { bg: "rgba(100,140,160,0.15)", text: "#6a8fa0", label: "Сон" },
  relax:    { bg: "rgba(120,160,140,0.15)", text: "#78a08c", label: "Расслабление" },
  focus:    { bg: "rgba(140,120,160,0.15)", text: "#8c78a0", label: "Фокус" },
  meditate: { bg: "rgba(160,140,110,0.15)", text: "#a08c6e", label: "Медитация" },
  stress:   { bg: "rgba(160,110,110,0.15)", text: "#a06e6e", label: "Стресс" },
  morning:  { bg: "rgba(120,160,140,0.15)", text: "#78a08c", label: "Утро" },
  breath:   { bg: "rgba(100,140,160,0.15)", text: "#6a8fa0", label: "Дыхание" },
  gratitude:{ bg: "rgba(160,150,100,0.15)", text: "#a09664", label: "Благодарность" },
  stretch:  { bg: "rgba(140,120,160,0.15)", text: "#8c78a0", label: "Растяжка" },
};

const REFLECTION_PROMPTS = [
  "Что сегодня было самым тяжёлым?",
  "Какой момент сегодня был хорошим, даже маленьким?",
  "Что я сейчас чувствую в теле?",
  "Что мне сегодня помогло справиться?",
  "Какой паттерн я снова заметила в себе?",
  "Что я хочу отпустить перед сном?",
  "За что я благодарна сегодня?",
];

const PATTERN_TAGS = [
  "перфекционизм", "тревога о будущем", "угождение другим",
  "самокритика", "прокрастинация", "страх отказа",
  "усталость", "одиночество", "раздражение", "вина",
  "гордость собой", "спокойствие", "ресурс",
];

const SEED_ENTRIES = [
  { id: "e1", date: new Date(Date.now() - 86400000*2), mood: 2, what_happened: "Поругалась с мамой по телефону. Снова почувствовала, что меня не слышат.", what_felt: "Злость, потом вина, потом усталость от этого круга.", what_helped: "Послушала звуки дождя 20 минут. Немного отпустило.", pattern_tags: ["угождение другим", "вина"], insight: "Заметила, что сначала злюсь, а потом сразу виню себя." },
  { id: "e2", date: new Date(Date.now() - 86400000), mood: 3, what_happened: "Сдала проект вовремя. Похвалили на работе.", what_felt: "Облегчение и немного удивление — не ожидала, что получится.", what_helped: "Утренний настрой помог сосредоточиться.", pattern_tags: ["перфекционизм", "гордость собой"], insight: "Снова убедилась: когда начинаю — становится легче." },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(sec) {
  if (!sec) return "∞";
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

function getClockStr() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getDateStr() {
  const now = new Date();
  const days = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function formatEntryDate(date) {
  const diff = Math.floor((Date.now() - date) / 86400000);
  if (diff === 0) return "Сегодня";
  if (diff === 1) return "Вчера";
  const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

// ─── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  bg:       "rgb(109, 155, 183)",
  surface:  "rgba(186, 224, 249, 0.7)",
  surface2: "rgba(167, 216, 238, 0.38)",
  border:   "rgba(0,0,0,0.07)",
  text:     "#2c2c2c",
  muted:    "#787470",
  accent:   "#7a9e9f",
  accent2:  "#fefaf4",
  dark:     "rgba(0,0,0,0.55)",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function Tag({ tag }) {
  const c = TAG_COLORS[tag] || TAG_COLORS.relax;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, padding: "3px 10px", borderRadius: 20, display: "inline-block" }}>
      {c.label}
    </span>
  );
}

function PremiumBadge() {
  return <span style={{ background: "rgba(180,150,80,0.15)", color: "#a08840", fontSize: 10, padding: "2px 8px", borderRadius: 20, marginLeft: 6 }}>PRO</span>;
}

// ─── Splash Screen ─────────────────────────────────────────────────────────────

function SplashScreen({ onStart }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <img
        src="/splash.jpg"
        alt="ocean"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "relative", padding: "2rem 2rem 3rem" }}>
        <div style={{ fontSize: 38, fontWeight: 300, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
         OceanMind<br />
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 40, fontWeight: 300 }}>
          Пространство для твоей глубины
        </div>
        <button onClick={onStart} style={{
          width: "100%", padding: "18px", borderRadius: 50,
          background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.4)", color: "#e4e4e4",
          fontSize: 17, fontFamily: "'nunito", cursor: "pointer", letterSpacing: "0.02em"
        }}>
          Начать
        </button>
      </div>
    </div>
  );
}

// ─── Home Screen ───────────────────────────────────────────────────────────────

function HomeScreen({ mood, setMood, currentSound, setCurrentSound, onNavigate }) {
  const [clock, setClock] = useState(getClockStr());
  const [affIdx, setAffIdx] = useState(0);
  const [affFade, setAffFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setClock(getClockStr()), 30000);
    return () => clearInterval(t);
  }, []);

  function nextAff() {
    setAffFade(false);
    setTimeout(() => { setAffIdx(i => (i + 1) % AFFIRMATIONS.length); setAffFade(true); }, 250);
  }

  const aff = AFFIRMATIONS[affIdx];

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* Time */}
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ fontSize: 60, fontWeight: 300, color: C.text, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>{clock}</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 1.5 + "rem" }}>{getDateStr()}</div>

        {/* Mood */}
        <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Как вы сейчас?</div>
        <div style={{ display: "flex", gap: 8 }}>
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => setMood(i)} style={{
              flex: 1, padding: "10px 0",
              border: `${mood === i ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`}`,
              borderRadius: 40,
              background: mood === i ? "rgba(122,158,159,0.12)" : C.surface,
              fontSize: 20, cursor: "pointer", transition: "all 0.2s",
              backdropFilter: "blur(8px)"
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Quick sounds */}
      <div style={{ padding: "0 1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: C.text }}>Быстрый запуск</div>
          <button onClick={() => onNavigate("sounds")} style={{ fontSize: 13, color: C.accent, background: "none", border: "none", cursor: "pointer" }}>Все →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {SOUNDS.slice(0, 3).map(s => (
            <button key={s.id} onClick={() => { setCurrentSound(s); onNavigate("sounds"); }}
              style={{ position: "relative", height: 100, borderRadius: 18, overflow: "hidden", border: `${currentSound?.id === s.id ? `2px solid ${C.accent}` : "none"}`, cursor: "pointer", padding: 0 }}>
              <img src={s.photo} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
              <div style={{ position: "absolute", bottom: 8, left: 10, color: "#fff", fontSize: 13, fontWeight: 500 }}>{s.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      <div style={{ margin: "0 1.5rem 1.25rem", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.5rem", textAlign: "center", backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Аффирмация дня</div>
        <div style={{ fontSize: 12, color: C.accent, marginBottom: 14, fontWeight: 500 }}>{aff.category}</div>
        <div style={{ fontSize: 17, lineHeight: 1.7, fontStyle: "italic", color: C.text, opacity: affFade ? 1 : 0, transition: "opacity 0.25s", marginBottom: 16 }}>
          «{aff.text}»
        </div>
        <button onClick={nextAff} style={{ fontSize: 13, color: C.accent, background: "none", border: `1px solid ${C.border}`, padding: "8px 20px", borderRadius: 30, cursor: "pointer" }}>
          Следующая →
        </button>
      </div>

      {/* Tune-ins preview */}
      <div style={{ padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: C.text }}>Настрои</div>
          <button onClick={() => onNavigate("tuneins")} style={{ fontSize: 13, color: C.accent, background: "none", border: "none", cursor: "pointer" }}>Все →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TUNE_INS.slice(0, 2).map(t => (
            <button key={t.id} onClick={() => onNavigate("tuneins")}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px 14px", textAlign: "left", cursor: "pointer", color: C.text, backdropFilter: "blur(8px)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: C.text }}>{t.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{t.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sounds Screen ─────────────────────────────────────────────────────────────

function SoundsScreen({ currentSound, setCurrentSound }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(34);
  const [volume, setVolume] = useState(70);
  const [loop, setLoop] = useState(false);
  const [elapsed, setElapsed] = useState(12 * 60 + 22);
  const [filter, setFilter] = useState("all");
  const timerRef = useRef(null);
  const sound = currentSound || SOUNDS[0];

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

  function togglePlay() { setPlaying(p => { startTimer(!p); return !p; }); }

  function selectSound(s) {
    if (s.premium) return;
    setCurrentSound(s); setProgress(0); setElapsed(0); setPlaying(true); startTimer(true);
  }

  const filters = ["all","sleep","relax","focus","meditate"];
  const filterLabels = { all:"Все", sleep:"Сон", relax:"Расслабление", focus:"Фокус", meditate:"Медитация" };
  const filtered = filter === "all" ? SOUNDS : SOUNDS.filter(s => s.tag === filter);
  const total = sound.duration || 3600;

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* Player */}
      <div style={{ margin: "0 1.5rem 1.25rem", borderRadius: 24, overflow: "hidden", position: "relative", height: 200 }}>
        <img src={sound.photo} alt={sound.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#fff", marginBottom: 2 }}>{sound.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>{sound.category}</div>
          {/* Progress */}
          <div onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setProgress(Math.round(pct * 100));
            setElapsed(Math.round(pct * total));
          }} style={{ height: 3, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginBottom: 6, cursor: "pointer" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#fff", width: `${progress}%`, transition: "width 0.5s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>
            <span>{formatTime(elapsed)}</span><span>{formatTime(total)}</span>
          </div>
          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <button onClick={() => { setProgress(0); setElapsed(0); }} style={wBtn}>⏮</button>
            <button onClick={togglePlay} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={() => { setProgress(0); setElapsed(0); }} style={wBtn}>⏭</button>
            <button onClick={() => setLoop(l => !l)} style={{ ...wBtn, color: loop ? "#fff" : "rgba(255,255,255,0.5)" }}>🔁</button>
          </div>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 1.5rem", marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: C.muted }}>🔈</span>
        <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(e.target.value)} style={{ flex: 1, accentColor: C.accent }} />
        <span style={{ fontSize: 12, color: C.muted, minWidth: 30 }}>{volume}%</span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, padding: "0 1.5rem", marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 30,
            border: `1px solid ${filter === f ? C.accent : C.border}`,
            background: filter === f ? "rgba(122,158,159,0.12)" : C.surface,
            color: filter === f ? C.accent : C.muted,
            fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", backdropFilter: "blur(8px)"
          }}>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Sound grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, padding: "0 1.5rem" }}>
        {filtered.map(s => (
          <button key={s.id} onClick={() => selectSound(s)}
            style={{ position: "relative", height: 140, borderRadius: 20, overflow: "hidden", border: `${sound.id === s.id ? `2px solid ${C.accent}` : "none"}`, cursor: s.premium ? "not-allowed" : "pointer", padding: 0, opacity: s.premium ? 0.75 : 1 }}>
            <img src={s.photo} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }} />
            {s.premium && <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(180,150,80,0.85)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>PRO</div>}
            <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{s.category}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Meditations Screen ────────────────────────────────────────────────────────

function MeditationsScreen() {
  const [tab, setTab] = useState("meditations");

  return (
    <div style={{ padding: "0 0 1rem" }}>
      <div style={{ display: "flex", padding: "0 1.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
        {[["meditations","Медитации"],["morning","Утро"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "10px 16px", fontSize: 14, color: tab === id ? C.accent : C.muted,
            background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`, marginBottom: -1
          }}>{label}</button>
        ))}
      </div>

      {tab === "meditations" && (
        <div style={{ display: "grid", gap: 12, padding: "0 1.5rem" }}>
          {MEDITATIONS.map(m => (
            <div key={m.id} style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 120 }}>
              <img src={m.photo} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>{TAG_COLORS[m.tag]?.label}</span>
                  {m.premium && <PremiumBadge />}
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{m.duration}</span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 3 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{m.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "morning" && (
        <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
          {MORNING_PRACTICES.map(p => (
            <div key={p.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", backdropFilter: "blur(8px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Tag tag={p.tag} />
                  {p.premium && <PremiumBadge />}
                </div>
                <span style={{ fontSize: 12, color: C.muted }}>{p.duration}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{p.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tune-ins Screen ───────────────────────────────────────────────────────────

function TuneInsScreen() {
  const [selected, setSelected] = useState(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [fade, setFade] = useState(true);

  function openTuneIn(t) { setSelected(t); setLineIdx(0); setFade(true); }
  function nextLine() {
    if (lineIdx < selected.lines.length - 1) {
      setFade(false); setTimeout(() => { setLineIdx(i => i + 1); setFade(true); }, 200);
    } else { setSelected(null); setLineIdx(0); }
  }

  if (selected) {
    return (
      <div style={{ padding: "2rem 1.5rem", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>{selected.icon}</div>
        <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{selected.category}</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 32 }}>{selected.title}</div>
        <div style={{ fontSize: 20, lineHeight: 1.7, fontStyle: "italic", color: C.text, opacity: fade ? 1 : 0, transition: "opacity 0.2s", marginBottom: 40, maxWidth: 340 }}>
          «{selected.lines[lineIdx]}»
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {selected.lines.map((_, i) => (
            <div key={i} style={{ width: i === lineIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === lineIdx ? C.accent : C.border, transition: "all 0.3s" }} />
          ))}
        </div>
        <button onClick={nextLine} style={{ padding: "14px 36px", background: C.accent, border: "none", borderRadius: 50, color: "#fff", fontSize: 15, cursor: "pointer" }}>
          {lineIdx < selected.lines.length - 1 ? "Далее →" : "Завершить ✓"}
        </button>
        <button onClick={() => setSelected(null)} style={{ marginTop: 16, fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer" }}>Назад</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1rem" }}>
      <div style={{ padding: "0 1.5rem 1rem" }}>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Настрои — короткие практики присутствия. Выберите подходящий момент.</div>
      </div>
      <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
        {TUNE_INS.map(t => (
          <button key={t.id} onClick={() => openTuneIn(t)}
            style={{ display: "flex", alignItems: "center", gap: 16, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", cursor: "pointer", color: C.text, textAlign: "left", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{t.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{t.category}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: C.accent }}>{t.lines.length} шага</div>
            </div>
            <div style={{ marginLeft: "auto", color: C.muted, fontSize: 20 }}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Affirmations Screen ───────────────────────────────────────────────────────

function AffirmationsScreen() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [liked, setLiked] = useState(new Set());

  function go(dir) {
    setFade(false);
    setTimeout(() => { setIdx(i => (i + dir + AFFIRMATIONS.length) % AFFIRMATIONS.length); setFade(true); }, 200);
  }

  const aff = AFFIRMATIONS[idx];

  return (
    <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>{idx + 1} / {AFFIRMATIONS.length}</div>
      <div style={{ fontSize: 13, color: C.accent, fontWeight: 500, marginBottom: 16 }}>{aff.category}</div>
      <div style={{ fontSize: 22, lineHeight: 1.7, fontStyle: "italic", textAlign: "center", color: C.text, opacity: fade ? 1 : 0, transition: "opacity 0.2s", marginBottom: 48, maxWidth: 320 }}>
        «{aff.text}»
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
        <button onClick={() => go(-1)} style={navBtn}>←</button>
        <button onClick={() => setLiked(s => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; })}
          style={{ ...navBtn, color: liked.has(idx) ? "#c07070" : C.muted, fontSize: 22 }}>
          {liked.has(idx) ? "♥" : "♡"}
        </button>
        <button onClick={() => go(1)} style={navBtn}>→</button>
      </div>
      <div style={{ width: "100%", background: C.surface, borderRadius: 18, padding: "16px", border: `1px solid ${C.border}`, backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Все категории</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {AFFIRMATIONS.map((a, i) => (
            <button key={a.id} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
              style={{ padding: "5px 14px", borderRadius: 20, background: i === idx ? "rgba(122,158,159,0.15)" : "rgba(0,0,0,0.04)", border: `1px solid ${i === idx ? C.accent : C.border}`, color: i === idx ? C.accent : C.muted, fontSize: 12, cursor: "pointer" }}>
              {a.category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Journal Screen ────────────────────────────────────────────────────────────

function JournalScreen() {
  const [view, setView] = useState("list");
  const [entries, setEntries] = useState(SEED_ENTRIES);
  const [selected, setSelected] = useState(null);
  const [newMood, setNewMood] = useState(null);
  const [newWhat, setNewWhat] = useState("");
  const [newFelt, setNewFelt] = useState("");
  const [newHelped, setNewHelped] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [newTags, setNewTags] = useState([]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [step, setStep] = useState(0);

  function saveEntry() {
    const e = { id: "e" + Date.now(), date: new Date(), mood: newMood ?? 2, what_happened: newWhat, what_felt: newFelt, what_helped: newHelped, pattern_tags: newTags, insight: newInsight };
    setEntries(prev => [e, ...prev]);
    setView("list"); setStep(0); setNewMood(null); setNewWhat(""); setNewFelt(""); setNewHelped(""); setNewInsight(""); setNewTags([]);
  }

  function toggleTag(t) { setNewTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]); }

  const steps = [
    { title: "Как ты сейчас?" },
    { title: "Что произошло?", hint: REFLECTION_PROMPTS[promptIdx] },
    { title: "Что ты почувствовала?", hint: "Можно одно слово или целый абзац" },
    { title: "Что помогло?", hint: "Звук, практика, разговор, прогулка..." },
    { title: "Осознание и паттерны" },
  ];

  if (view === "new") {
    const current = steps[step];
    const canNext = step === 0 ? newMood !== null : true;
    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button onClick={() => step === 0 ? setView("list") : setStep(s => s - 1)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>
            {step === 0 ? "Отмена" : "← Назад"}
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
            {step === 1 && <button onClick={() => setPromptIdx(i => (i + 1) % REFLECTION_PROMPTS.length)} style={{ marginLeft: 8, background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 12 }}>другой вопрос</button>}
          </div>
        )}
        {step === 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setNewMood(i)} style={{ flex: 1, padding: "12px 0", border: `${newMood === i ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`}`, borderRadius: 40, background: newMood === i ? "rgba(122,158,159,0.12)" : C.surface, fontSize: 22, cursor: "pointer" }}>{m}</button>
            ))}
          </div>
        )}
        {step === 1 && <textarea value={newWhat} onChange={e => setNewWhat(e.target.value)} placeholder="Пиши свободно..." rows={5} style={taStyle} />}
        {step === 2 && <textarea value={newFelt} onChange={e => setNewFelt(e.target.value)} placeholder="Тревога, усталость, злость..." rows={4} style={taStyle} />}
        {step === 3 && <textarea value={newHelped} onChange={e => setNewHelped(e.target.value)} placeholder="Медитация, звуки, прогулка..." rows={4} style={taStyle} />}
        {step === 4 && (
          <div>
            <textarea value={newInsight} onChange={e => setNewInsight(e.target.value)} placeholder="Я снова заметила что..." rows={3} style={{ ...taStyle, marginBottom: 16 }} />
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Отметь паттерны:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PATTERN_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${newTags.includes(t) ? C.accent : C.border}`, background: newTags.includes(t) ? "rgba(122,158,159,0.12)" : C.surface, color: newTags.includes(t) ? C.accent : C.muted, fontSize: 13, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          {step < 4
            ? <button onClick={() => setStep(s => s + 1)} disabled={!canNext} style={{ width: "100%", padding: "14px", background: canNext ? C.accent : C.border, border: "none", borderRadius: 16, color: canNext ? "#fff" : C.muted, fontSize: 15, cursor: canNext ? "pointer" : "not-allowed" }}>Далее →</button>
            : <button onClick={saveEntry} style={{ width: "100%", padding: "14px", background: C.accent, border: "none", borderRadius: 16, color: "#fff", fontSize: 15, cursor: "pointer" }}>Сохранить ✓</button>
          }
          {step > 0 && step < 4 && <button onClick={() => setStep(s => s + 1)} style={{ width: "100%", padding: "10px", background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", marginTop: 8 }}>Пропустить</button>}
        </div>
      </div>
    );
  }

  if (view === "entry" && selected) {
    const e = selected;
    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, padding: "0 0 1rem" }}>← Назад</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>{MOODS[e.mood]}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{MOOD_LABELS[e.mood]}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{formatEntryDate(e.date)}</div>
          </div>
        </div>
        {[{ label: "Что произошло", value: e.what_happened }, { label: "Что почувствовала", value: e.what_felt }, { label: "Что помогло", value: e.what_helped }, { label: "Осознание", value: e.insight }].filter(x => x.value).map(({ label, value }) => (
          <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{value}</div>
          </div>
        ))}
        {e.pattern_tags?.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Паттерны</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {e.pattern_tags.map(t => <span key={t} style={{ background: "rgba(122,158,159,0.12)", color: C.accent, fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>{t}</span>)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      <div style={{ padding: "0 1.5rem", marginBottom: 16, display: "flex", gap: 10 }}>
        <button onClick={() => { setStep(0); setView("new"); }} style={{ flex: 1, padding: "13px", background: C.accent, border: "none", borderRadius: 16, color: "#fff", fontSize: 14, cursor: "pointer" }}>
          + Новая запись
        </button>
      </div>
      <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
        {entries.map(e => (
          <button key={e.id} onClick={() => { setSelected(e); setView("entry"); }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", textAlign: "left", cursor: "pointer", color: C.text, width: "100%", backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{MOODS[e.mood]}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{MOOD_LABELS[e.mood]}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{formatEntryDate(e.date)}</div>
                </div>
              </div>
              <span style={{ color: C.muted, fontSize: 18 }}>›</span>
            </div>
            {e.what_happened && <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: e.pattern_tags?.length ? 10 : 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{e.what_happened}</div>}
            {e.pattern_tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {e.pattern_tags.slice(0, 3).map(t => <span key={t} style={{ background: "rgba(122,158,159,0.1)", color: C.accent, fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>{t}</span>)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Progress Screen ───────────────────────────────────────────────────────────

function ProgressScreen({ mood }) {
  const weekMoods = [2, 3, 4, 3, 4, 4, mood ?? 3];
  const maxBarH = 60;

  return (
    <div style={{ padding: "0 1.5rem 1.5rem" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.5rem", marginBottom: 12, textAlign: "center", backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 44, marginBottom: 4 }}>🔥</div>
        <div style={{ fontSize: 36, fontWeight: 300, color: C.text, marginBottom: 4 }}>7</div>
        <div style={{ fontSize: 14, color: C.muted }}>дней подряд</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[["23","сессии","этот месяц"],["4.2ч","среднее","в неделю"],["12","медит.","завершено"]].map(([val,label,sub],i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 10px", textAlign: "center", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 22, fontWeight: 300, color: C.text, marginBottom: 2 }}>{val}</div>
            <div style={{ fontSize: 11, color: C.accent }}>{label}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.25rem", marginBottom: 12, backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 16 }}>Настроение за неделю</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: maxBarH + 30 }}>
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day, i) => {
            const h = Math.round((weekMoods[i] / 4) * maxBarH);
            return (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 14 }}>{MOODS[weekMoods[i]]}</div>
                <div style={{ width: "100%", background: "rgba(0,0,0,0.06)", borderRadius: 6, position: "relative", height: maxBarH }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: i === 6 ? C.accent : C.accent2, borderRadius: 6, height: h, transition: "height 0.6s ease" }} />
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.25rem", backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 14 }}>Достижения</div>
        <div style={{ display: "grid", gap: 12 }}>
          {[["🌱","Первый шаг","Первая сессия","done"],["🌙","Ночной покой","7 сессий перед сном","done"],["🔥","Неделя подряд","7 дней без пропусков","done"],["🧘","Мастер дыхания","10 дыхательных практик","lock"]].map(([icon,title,desc,state]) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: 14, opacity: state === "lock" ? 0.4 : 1 }}>
              <div style={{ fontSize: 24, width: 40, textAlign: "center" }}>{icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{title}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{desc}</div>
              </div>
              {state === "done" && <div style={{ marginLeft: "auto", color: C.accent, fontSize: 18 }}>✓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const wBtn = { background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 20, padding: 4 };
const navBtn = { background: "none", border: `1px solid ${C.border}`, borderRadius: "50%", width: 48, height: 48, fontSize: 20, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const taStyle = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px", color: C.text, fontSize: 15, fontFamily: "'Nunito', sans-serif", lineHeight: 1.7, resize: "none", outline: "none" };

// ─── Nav ───────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "home",         icon: "🏠", label: "Главная" },
  { id: "sounds",       icon: "🎧", label: "Звуки" },
  { id: "meditations",  icon: "🧘", label: "Практики" },
  { id: "tuneins",      icon: "✨", label: "Настрои" },
  { id: "journal",      icon: "📓", label: "Дневник" },
  { id: "progress",     icon: "📈", label: "Прогресс" },
];

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState("home");
  const [mood, setMood] = useState(null);
  const [currentSound, setCurrentSound] = useState(SOUNDS[0]);

  const screenTitles = { home: getGreeting(), sounds: "Звуки", meditations: "Практики", tuneins: "Настрои", affirmations: "Аффирмации", journal: "Дневник", progress: "Прогресс" };

  if (splash) return <SplashScreen onStart={() => setSplash(false)} />;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=Nunito:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { color: inherit; font-family: 'Outfit', sans-serif; }
        textarea { font-family: 'Nunito', sans-serif; }
        input[type=range] { cursor: pointer; }
        @keyframes wave { 0%,100% { height: 3px } 50% { height: 12px } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.02em", color: C.text }}>
          Ocean<span style={{ color: C.accent }}>Mind</span>
        </div>
        <div style={{ fontSize: 13, color: C.muted }}>{screenTitles[screen]}</div>
      </div>

      {/* Screen */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {screen === "home"         && <HomeScreen mood={mood} setMood={setMood} currentSound={currentSound} setCurrentSound={setCurrentSound} onNavigate={setScreen} />}
        {screen === "sounds"       && <SoundsScreen currentSound={currentSound} setCurrentSound={setCurrentSound} />}
        {screen === "meditations"  && <MeditationsScreen />}
        {screen === "tuneins"      && <TuneInsScreen />}
        {screen === "affirmations" && <AffirmationsScreen />}
        {screen === "journal"      && <JournalScreen />}
        {screen === "progress"     && <ProgressScreen mood={mood} />}
      </div>

      {/* Bottom nav */}
      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 12px", borderTop: `1px solid ${C.border}`, flexShrink: 0, background: "rgba(240,237,232,0.9)", backdropFilter: "blur(10px)" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, color: screen === n.id ? C.accent : C.muted, background: "none", border: "none", cursor: "pointer", padding: "2px 6px", transition: "color 0.2s" }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
