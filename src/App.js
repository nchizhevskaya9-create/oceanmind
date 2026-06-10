import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const SOUNDS = [
  { id: "rain",      emoji: "🌧️", name: "Дождь",          category: "Природа",    duration: 2160, tag: "sleep" },
  { id: "fire",      emoji: "🔥", name: "Камин",           category: "Уют",        duration: 2700, tag: "relax" },
  { id: "ocean",     emoji: "🌊", name: "Океан",           category: "Волны",      duration: 3600, tag: "sleep" },
  { id: "forest",    emoji: "🌲", name: "Лес",             category: "Природа",    duration: 2400, tag: "relax" },
  { id: "white",     emoji: "☁️", name: "Белый шум",      category: "Фокус",      duration: null, tag: "focus" },
  { id: "binaural",  emoji: "🌌", name: "Бинауральные",   category: "Δ 2 Гц",     duration: 3600, tag: "sleep", premium: true },
  { id: "bowl",      emoji: "🎵", name: "Чаши",            category: "Тибет",      duration: 1800, tag: "meditate" },
  { id: "night",     emoji: "🌙", name: "Ночной сад",      category: "Сверчки",   duration: 3000, tag: "sleep" },
  { id: "mountain",  emoji: "🏔️", name: "Горы",            category: "Ветер",      duration: 2100, tag: "relax" },
  { id: "cafe",      emoji: "☕", name: "Кофейня",         category: "Городской", duration: 3600, tag: "focus", premium: true },
  { id: "thunder",   emoji: "⛈️", name: "Гроза",           category: "Природа",    duration: 2400, tag: "sleep" },
  { id: "river",     emoji: "🏞️", name: "Горный ручей",   category: "Природа",    duration: 2700, tag: "relax" },
];

const MEDITATIONS = [
  { id: "m1", tag: "sleep",   title: "Погружение в тишину",       duration: "20 мин", level: "Начинающим",   desc: "Мягкое сканирование тела перед сном" },
  { id: "m2", tag: "stress",  title: "Освобождение от тревоги",   duration: "15 мин", level: "Дыхание",       desc: "Техника 4-7-8 для успокоения нервной системы" },
  { id: "m3", tag: "focus",   title: "Ясность ума",               duration: "10 мин", level: "Осознанность",  desc: "Практика присутствия здесь и сейчас" },
  { id: "m4", tag: "sleep",   title: "Скан тела",                  duration: "30 мин", level: "Body scan",     desc: "Классическая практика MBSR для глубокого сна", premium: true },
  { id: "m5", tag: "stress",  title: "Земля под ногами",          duration: "12 мин", level: "Заземление",    desc: "Практика 5-4-3-2-1 при панике и тревоге" },
  { id: "m6", tag: "focus",   title: "Концентрация на дыхании",   duration: "8 мин",  level: "Базовая",       desc: "Классическая медитация для развития внимания" },
];

const MORNING_PRACTICES = [
  { id: "p1", tag: "morning",    title: "Намерение дня",              duration: "5 мин",  desc: "Задайте тон всему дню через намерение" },
  { id: "p2", tag: "breath",     title: "Бодрящее дыхание",           duration: "8 мин",  desc: "Техника Вим Хофа для энергии с утра" },
  { id: "p3", tag: "gratitude",  title: "Три благодарности",          duration: "3 мин",  desc: "Дневник благодарности для позитивного настроя" },
  { id: "p4", tag: "stretch",    title: "Утренняя растяжка",          duration: "10 мин", desc: "Мягкая йога для пробуждения тела", premium: true },
  { id: "p5", tag: "morning",    title: "Визуализация успеха",        duration: "7 мин",  desc: "Представьте идеальную версию своего дня" },
];

const AFFIRMATIONS = [
  { id: "a1", category: "Самопринятие",   text: "Я достаточен(на). Я делаю всё, что в моих силах, и этого хватает.", author: null },
  { id: "a2", category: "Покой",          text: "Покой живёт внутри меня. Я могу обратиться к нему в любой момент.", author: null },
  { id: "a3", category: "Любовь к себе", text: "Я выбираю мягкость к себе. Мои ошибки — часть роста.", author: null },
  { id: "a4", category: "Новый день",    text: "Каждый новый день — это чистая страница. Я пишу её с любовью.", author: null },
  { id: "a5", category: "Дыхание",       text: "Моё дыхание — мой якорь. Я возвращаюсь к себе снова и снова.", author: null },
  { id: "a6", category: "Сила",          text: "Я справлялся(лась) с трудностями раньше — справлюсь и сейчас.", author: null },
  { id: "a7", category: "Настоящий момент", text: "Прямо сейчас я в безопасности. Всё хорошо в этот момент.", author: null },
  { id: "a8", category: "Рост",          text: "Я расту каждый день, даже когда этого не замечаю.", author: null },
];

const TUNE_INS = [
  { id: "t1", category: "Утренний настрой",  icon: "🌅", title: "Начни день с намерения",      lines: ["Сегодня я выбираю спокойствие.", "Я открыт(а) для хорошего.", "Моя энергия идёт туда, где мне важно."] },
  { id: "t2", category: "После работы",      icon: "🌆", title: "Перезагрузка после дня",      lines: ["Рабочий день окончен — я отпускаю его.", "Мои достижения сегодня реальны.", "Теперь время для себя."] },
  { id: "t3", category: "Перед сном",        icon: "🌙", title: "Плавный уход в ночь",         lines: ["Я благодарен(на) за этот день.", "Я отпускаю всё незавершённое.", "Моё тело готово к отдыху."] },
  { id: "t4", category: "При тревоге",       icon: "🌬️", title: "Если тревога накрывает",      lines: ["Прямо сейчас я в безопасности.", "Это чувство временно — оно пройдёт.", "Я дышу и возвращаюсь к себе."] },
  { id: "t5", category: "Уверенность",       icon: "⚡", title: "Перед важным событием",      lines: ["Я готов(а). Я справлюсь.", "Мой опыт и знания со мной.", "Я делаю всё, что могу — и этого достаточно."] },
  { id: "t6", category: "Благодарность",     icon: "💛", title: "Практика благодарности",     lines: ["Три вещи, за которые я благодарен(на) сегодня...", "Одна маленькая победа этого дня...", "Человек, которому я мысленно говорю спасибо..."] },
];

const MOODS = ["😔", "😐", "🙂", "😊", "✨"];
const MOOD_LABELS = ["Тяжело", "Нейтрально", "Неплохо", "Хорошо", "Отлично"];

const TAG_COLORS = {
  sleep:    { bg: "rgba(88,166,201,0.15)",  text: "#58a6c9", label: "Сон" },
  relax:    { bg: "rgba(126,226,184,0.15)", text: "#7ee2b8", label: "Расслабление" },
  focus:    { bg: "rgba(192,126,247,0.15)", text: "#c07ef7", label: "Фокус" },
  meditate: { bg: "rgba(240,180,100,0.15)", text: "#f0b464", label: "Медитация" },
  stress:   { bg: "rgba(247,126,126,0.15)", text: "#f77e7e", label: "Стресс" },
  morning:  { bg: "rgba(126,226,184,0.15)", text: "#7ee2b8", label: "Утро" },
  breath:   { bg: "rgba(88,166,201,0.15)",  text: "#58a6c9", label: "Дыхание" },
  gratitude:{ bg: "rgba(240,200,80,0.15)",  text: "#f0c850", label: "Благодарность" },
  stretch:  { bg: "rgba(192,126,247,0.15)", text: "#c07ef7", label: "Растяжка" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(sec) {
  if (!sec) return "∞";
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return "Доброй ночи";
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

// ─── Sub-components ────────────────────────────────────────────────────────────

function Tag({ tag }) {
  const c = TAG_COLORS[tag] || TAG_COLORS.relax;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, padding: "3px 10px", borderRadius: 20, display: "inline-block", fontFamily: "sans-serif" }}>
      {c.label}
    </span>
  );
}

function PremiumBadge() {
  return (
    <span style={{ background: "rgba(240,180,80,0.18)", color: "#f0b450", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontFamily: "sans-serif", marginLeft: 6 }}>
      PRO
    </span>
  );
}

function WaveAnim() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 14, marginTop: 6 }}>
      {[0,100,200,100].map((delay, i) => (
        <span key={i} style={{
          width: 3, background: "#58a6c9", borderRadius: 2, height: 3,
          animation: `wave 0.8s ease-in-out ${delay}ms infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────────

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
  const suggested = SOUNDS.slice(0, 3);

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* Time & mood */}
      <div style={{ padding: "0 1.5rem 1rem" }}>
        <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>{clock}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 1.5 + "rem" }}>{getDateStr()}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Как вы сейчас?</div>
        <div style={{ display: "flex", gap: 10 }}>
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => setMood(i)}
              title={MOOD_LABELS[i]}
              style={{
                flex: 1, padding: "10px 0", border: `${mood === i ? "1px solid #58a6c9" : "0.5px solid rgba(255,255,255,0.08)"}`,
                borderRadius: 40, background: mood === i ? "#1c2333" : "#161b22",
                fontSize: 20, cursor: "pointer", transition: "all 0.2s"
              }}>
              {m}
            </button>
          ))}
        </div>
        {mood !== null && <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", marginTop: 8, textAlign: "center" }}>
          Настроение отмечено: {MOOD_LABELS[mood]}
        </div>}
      </div>

      {/* Quick sounds */}
      <div style={{ padding: "0 1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16 }}>Быстрый запуск</div>
          <button onClick={() => onNavigate("sounds")} style={{ fontSize: 12, color: "#58a6c9", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>Все звуки →</button>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {suggested.map(s => (
            <button key={s.id} onClick={() => { setCurrentSound(s); onNavigate("sounds"); }}
              style={{
                flex: 1, padding: "14px 8px", background: currentSound?.id === s.id ? "#1c2333" : "#161b22",
                border: `${currentSound?.id === s.id ? "1px solid #58a6c9" : "0.5px solid rgba(255,255,255,0.08)"}`,
                borderRadius: 14, cursor: "pointer", textAlign: "center", color: "var(--text)", transition: "all 0.2s"
              }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontSize: 12, fontFamily: "sans-serif" }}>{s.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      <div style={{ margin: "0 1.5rem 1rem", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Аффирмация дня</div>
        <div style={{ fontSize: 11, color: "#7ee2b8", fontFamily: "sans-serif", marginBottom: 12 }}>{aff.category}</div>
        <div style={{ fontSize: 16, lineHeight: 1.7, fontStyle: "italic", opacity: affFade ? 1 : 0, transition: "opacity 0.25s", marginBottom: 14 }}>
          «{aff.text}»
        </div>
        <button onClick={nextAff} style={{ fontSize: 13, color: "#58a6c9", fontFamily: "sans-serif", background: "none", border: "0.5px solid rgba(255,255,255,0.08)", padding: "8px 20px", borderRadius: 30, cursor: "pointer" }}>
          Следующая →
        </button>
      </div>

      {/* Tune-in preview */}
      <div style={{ padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16 }}>Настрои</div>
          <button onClick={() => onNavigate("tuneins")} style={{ fontSize: 12, color: "#58a6c9", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>Все →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TUNE_INS.slice(0, 2).map(t => (
            <button key={t.id} onClick={() => onNavigate("tuneins")}
              style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 14px", textAlign: "left", cursor: "pointer", color: "var(--text)" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif" }}>{t.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    startTimer(playing);
    return () => clearInterval(timerRef.current);
  }, [playing, startTimer]);

  function togglePlay() {
    setPlaying(p => { startTimer(!p); return !p; });
  }

  function selectSound(s) {
    if (s.premium) return;
    setCurrentSound(s);
    setProgress(0);
    setElapsed(0);
    setPlaying(true);
    startTimer(true);
  }

  const filters = ["all", "sleep", "relax", "focus", "meditate"];
  const filterLabels = { all: "Все", sleep: "Сон", relax: "Расслабление", focus: "Фокус", meditate: "Медитация" };
  const filtered = filter === "all" ? SOUNDS : SOUNDS.filter(s => s.tag === filter);
  const total = sound.duration || 3600;

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* Player */}
      <div style={{ margin: "0 1.5rem 1rem", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Сейчас играет</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg,#1a2a3a,#2a1a3a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
            {sound.emoji}
          </div>
          <div>
            <div style={{ fontSize: 17, marginBottom: 3 }}>{sound.name}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif" }}>{sound.category} · {sound.duration ? `${Math.floor(sound.duration / 60)} мин` : "∞"}</div>
          </div>
        </div>
        {/* Progress */}
        <div onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          setProgress(Math.round(pct * 100));
          setElapsed(Math.round(pct * total));
        }} style={{ height: 3, background: "#1c2333", borderRadius: 2, marginBottom: 8, cursor: "pointer" }}>
          <div style={{ height: "100%", borderRadius: 2, background: "#58a6c9", width: `${progress}%`, transition: "width 0.5s linear" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 14 }}>
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(total)}</span>
        </div>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 14 }}>
          <button onClick={() => { setProgress(0); setElapsed(0); }} style={ctrlStyle}>⏮</button>
          <button onClick={togglePlay} style={{ width: 52, height: 52, borderRadius: "50%", background: "#58a6c9", border: "none", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {playing ? "⏸" : "▶"}
          </button>
          <button onClick={() => { setProgress(0); setElapsed(0); }} style={ctrlStyle}>⏭</button>
          <button onClick={() => setLoop(l => !l)} style={{ ...ctrlStyle, color: loop ? "#58a6c9" : "var(--muted)" }}>🔁</button>
        </div>
        {/* Volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>🔈</span>
          <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(e.target.value)}
            style={{ flex: 1, accentColor: "#58a6c9" }} />
          <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", minWidth: 30 }}>{volume}%</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "0 1.5rem", marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 30, border: `0.5px solid ${filter === f ? "#58a6c9" : "rgba(255,255,255,0.08)"}`,
            background: filter === f ? "rgba(88,166,201,0.12)" : "#161b22",
            color: filter === f ? "#58a6c9" : "var(--muted)", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", whiteSpace: "nowrap"
          }}>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Sound grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "0 1.5rem" }}>
        {filtered.map(s => (
          <button key={s.id} onClick={() => selectSound(s)}
            style={{
              background: sound.id === s.id ? "#1c2333" : "#161b22",
              border: `${sound.id === s.id ? "1px solid #58a6c9" : "0.5px solid rgba(255,255,255,0.08)"}`,
              borderRadius: 14, padding: "14px 10px 12px", textAlign: "center", cursor: s.premium ? "not-allowed" : "pointer",
              color: "var(--text)", opacity: s.premium ? 0.6 : 1, transition: "all 0.2s"
            }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontSize: 13, fontFamily: "sans-serif", marginBottom: 3 }}>{s.name}{s.premium && " 🔒"}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif" }}>{s.category}</div>
            {sound.id === s.id && playing && <WaveAnim />}
          </button>
        ))}
      </div>
    </div>
  );
}

function MeditationsScreen() {
  const [tab, setTab] = useState("meditations");
  const tabs = [
    { id: "meditations", label: "Медитации" },
    { id: "morning",     label: "Утро" },
  ];

  return (
    <div style={{ padding: "0 0 1rem" }}>
      <div style={{ display: "flex", padding: "0 1.5rem", borderBottom: "0.5px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", fontSize: 14, fontFamily: "sans-serif",
            color: tab === t.id ? "#58a6c9" : "var(--muted)",
            background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === t.id ? "#58a6c9" : "transparent"}`,
            marginBottom: -1
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "meditations" && (
        <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
          {MEDITATIONS.map(m => (
            <div key={m.id} style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Tag tag={m.tag} />
                  {m.premium && <PremiumBadge />}
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif" }}>{m.duration}</span>
              </div>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 12 }}>{m.desc}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif" }}>{m.level}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "morning" && (
        <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
          {MORNING_PRACTICES.map(p => (
            <div key={p.id} style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Tag tag={p.tag} />
                  {p.premium && <PremiumBadge />}
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif" }}>{p.duration}</span>
              </div>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TuneInsScreen() {
  const [selected, setSelected] = useState(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [fade, setFade] = useState(true);

  function openTuneIn(t) { setSelected(t); setLineIdx(0); setFade(true); }
  function nextLine() {
    if (lineIdx < selected.lines.length - 1) {
      setFade(false);
      setTimeout(() => { setLineIdx(i => i + 1); setFade(true); }, 200);
    } else {
      setSelected(null); setLineIdx(0);
    }
  }

  if (selected) {
    return (
      <div style={{ padding: "2rem 1.5rem", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{selected.icon}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{selected.category}</div>
        <div style={{ fontSize: 20, marginBottom: 32 }}>{selected.title}</div>
        <div style={{ fontSize: 18, lineHeight: 1.7, fontStyle: "italic", opacity: fade ? 1 : 0, transition: "opacity 0.2s", marginBottom: 40, maxWidth: 340 }}>
          «{selected.lines[lineIdx]}»
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {selected.lines.map((_, i) => (
            <div key={i} style={{ width: i === lineIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === lineIdx ? "#58a6c9" : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />
          ))}
        </div>
        <button onClick={nextLine} style={{ padding: "12px 32px", background: "#58a6c9", border: "none", borderRadius: 30, color: "#0d1117", fontSize: 15, fontFamily: "sans-serif", cursor: "pointer" }}>
          {lineIdx < selected.lines.length - 1 ? "Далее →" : "Завершить ✓"}
        </button>
        <button onClick={() => setSelected(null)} style={{ marginTop: 16, fontSize: 13, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>
          Назад
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 1rem" }}>
      <div style={{ padding: "0 1.5rem 1rem" }}>
        <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", lineHeight: 1.6 }}>
          Настрои — это короткие практики присутствия. Выберите подходящий момент.
        </div>
      </div>
      <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
        {TUNE_INS.map(t => (
          <button key={t.id} onClick={() => openTuneIn(t)}
            style={{ display: "flex", alignItems: "center", gap: 16, background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px", cursor: "pointer", color: "var(--text)", textAlign: "left", transition: "all 0.2s" }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{t.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 4 }}>{t.category}</div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: "#58a6c9", fontFamily: "sans-serif" }}>{t.lines.length} шага</div>
            </div>
            <div style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 18 }}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AffirmationsScreen() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [liked, setLiked] = useState(new Set());

  function go(dir) {
    setFade(false);
    setTimeout(() => {
      setIdx(i => (i + dir + AFFIRMATIONS.length) % AFFIRMATIONS.length);
      setFade(true);
    }, 200);
  }

  function toggleLike() {
    setLiked(s => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  }

  const aff = AFFIRMATIONS[idx];

  return (
    <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>
        {idx + 1} / {AFFIRMATIONS.length}
      </div>
      <div style={{ fontSize: 12, color: "#7ee2b8", fontFamily: "sans-serif", marginBottom: 16 }}>{aff.category}</div>
      <div style={{ fontSize: 22, lineHeight: 1.7, fontStyle: "italic", textAlign: "center", opacity: fade ? 1 : 0, transition: "opacity 0.2s", marginBottom: 40, maxWidth: 340 }}>
        «{aff.text}»
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        <button onClick={() => go(-1)} style={navBtnStyle}>←</button>
        <button onClick={toggleLike} style={{ ...navBtnStyle, color: liked.has(idx) ? "#f77e7e" : "var(--muted)", fontSize: 22 }}>
          {liked.has(idx) ? "♥" : "♡"}
        </button>
        <button onClick={() => go(1)} style={navBtnStyle}>→</button>
      </div>
      <div style={{ width: "100%", background: "#161b22", borderRadius: 14, padding: "16px", border: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 12 }}>Все аффирмации</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {AFFIRMATIONS.map((a, i) => (
            <button key={a.id} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
              style={{ padding: "4px 12px", borderRadius: 20, background: i === idx ? "rgba(88,166,201,0.15)" : "rgba(255,255,255,0.04)", border: `0.5px solid ${i === idx ? "#58a6c9" : "rgba(255,255,255,0.08)"}`, color: i === idx ? "#58a6c9" : "var(--muted)", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer" }}>
              {a.category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressScreen({ mood }) {
  const streak = 7;
  const weekMoods = [2, 3, 4, 3, 4, 4, mood ?? 3];
  const maxBarH = 60;

  return (
    <div style={{ padding: "0 1.5rem 1rem" }}>
      {/* Streak */}
      <div style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem", marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 4 }}>🔥</div>
        <div style={{ fontSize: 32, fontWeight: 300, marginBottom: 4 }}>{streak}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif" }}>дней подряд</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[["23", "сессии", "этот месяц"], ["4.2ч", "среднее", "в неделю"], ["12", "медит.", "завершено"]].map(([val, label, sub], i) => (
          <div key={i} style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 300, marginBottom: 2 }}>{val}</div>
            <div style={{ fontSize: 11, color: "#7ee2b8", fontFamily: "sans-serif" }}>{label}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "sans-serif" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Mood chart */}
      <div style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem", marginBottom: 12 }}>
        <div style={{ fontSize: 14, marginBottom: 16 }}>Настроение за неделю</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: maxBarH + 30 }}>
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day, i) => {
            const h = Math.round((weekMoods[i] / 4) * maxBarH);
            return (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 16 }}>{MOODS[weekMoods[i]]}</div>
                <div style={{ width: "100%", background: i === 6 ? "rgba(88,166,201,0.3)" : "rgba(255,255,255,0.06)", borderRadius: 6, position: "relative", height: maxBarH }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: i === 6 ? "#58a6c9" : "rgba(88,166,201,0.4)", borderRadius: 6, height: h, transition: "height 0.6s ease" }} />
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "sans-serif" }}>{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem" }}>
        <div style={{ fontSize: 14, marginBottom: 12 }}>Достижения</div>
        <div style={{ display: "grid", gap: 10 }}>
          {[["🌱","Первый шаг","Первая сессия","done"],["🌙","Ночной покой","7 сессий перед сном","done"],["🔥","Неделя подряд","7 дней без пропусков","done"],["🧘","Мастер дыхания","10 дыхательных практик","lock"]].map(([icon,title,desc,state]) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: 14, opacity: state === "lock" ? 0.4 : 1 }}>
              <div style={{ fontSize: 24, width: 40, textAlign: "center" }}>{icon}</div>
              <div>
                <div style={{ fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif" }}>{desc}</div>
              </div>
              {state === "done" && <div style={{ marginLeft: "auto", color: "#7ee2b8", fontSize: 18 }}>✓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Journal Screen ────────────────────────────────────────────────────────────

const REFLECTION_PROMPTS = [
  "Что сегодня было самым тяжёлым?",
  "Какой момент сегодня был хорошим, даже маленьким?",
  "Что я сейчас чувствую в теле?",
  "Что мне сегодня помогло справиться?",
  "Какой паттерн я снова заметила в себе?",
  "Что я хочу отпустить перед сном?",
  "За что я благодарна сегодня?",
  "Что я бы сказала себе утром, зная, как пройдёт день?",
];

const PATTERN_TAGS = [
  "перфекционизм", "тревога о будущем", "угождение другим",
  "самокритика", "прокрастинация", "страх отказа",
  "усталость", "одиночество", "раздражение", "вина",
  "гордость собой", "спокойствие", "ресурс",
];

const SEED_ENTRIES = [
  {
    id: "e1",
    date: new Date(Date.now() - 86400000 * 2),
    mood: 2,
    what_happened: "Поругалась с мамой по телефону. Снова почувствовала, что меня не слышат.",
    what_felt: "Злость, потом вина, потом усталость от этого круга.",
    what_helped: "Послушала звуки дождя 20 минут. Немного отпустило.",
    pattern_tags: ["угождение другим", "вина"],
    insight: "Заметила, что сначала злюсь, а потом сразу виню себя — будто злиться нельзя.",
  },
  {
    id: "e2",
    date: new Date(Date.now() - 86400000),
    mood: 3,
    what_happened: "Сдала проект вовремя. Похвалили на работе.",
    what_felt: "Облегчение и немного удивление — не ожидала, что получится.",
    what_helped: "Утренний настрой помог сосредоточиться.",
    pattern_tags: ["перфекционизм", "гордость собой"],
    insight: "Снова убедилась: когда начинаю — становится легче. Страх хуже самого дела.",
  },
];

function formatEntryDate(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 86400000);
  if (diff === 0) return "Сегодня";
  if (diff === 1) return "Вчера";
  const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function JournalScreen() {
  const [view, setView] = useState("list"); // list | new | entry | patterns
  const [entries, setEntries] = useState(SEED_ENTRIES);
  const [selected, setSelected] = useState(null);

  // new entry state
  const [newMood, setNewMood] = useState(null);
  const [newWhat, setNewWhat] = useState("");
  const [newFelt, setNewFelt] = useState("");
  const [newHelped, setNewHelped] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [newTags, setNewTags] = useState([]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [step, setStep] = useState(0); // 0=mood 1=what 2=felt 3=helped 4=insight+tags 5=done

  function saveEntry() {
    const e = {
      id: "e" + Date.now(),
      date: new Date(),
      mood: newMood ?? 2,
      what_happened: newWhat,
      what_felt: newFelt,
      what_helped: newHelped,
      pattern_tags: newTags,
      insight: newInsight,
    };
    setEntries(prev => [e, ...prev]);
    setView("list");
    setStep(0); setNewMood(null); setNewWhat(""); setNewFelt(""); setNewHelped(""); setNewInsight(""); setNewTags([]);
  }

  function toggleTag(t) {
    setNewTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);
  }

  // ── Patterns view ──
  if (view === "patterns") {
    const allTags = entries.flatMap(e => e.pattern_tags);
    const freq = {};
    allTags.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const moodAvg = entries.length ? Math.round(entries.reduce((s, e) => s + e.mood, 0) / entries.length) : 2;

    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, padding: "0 0 1rem", display: "flex", alignItems: "center", gap: 6 }}>
          ← Назад
        </button>
        <div style={{ fontSize: 16, marginBottom: 6 }}>Мои паттерны</div>
        <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 20, lineHeight: 1.6 }}>
          Это темы, которые чаще всего появляются в твоих записях. Они не ярлыки — это просто карта.
        </div>

        <div style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 12 }}>Среднее настроение за период</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 36 }}>{MOODS[moodAvg]}</div>
            <div>
              <div style={{ fontSize: 18 }}>{MOOD_LABELS[moodAvg]}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "sans-serif" }}>по {entries.length} записям</div>
            </div>
          </div>
        </div>

        {sorted.length === 0 && (
          <div style={{ color: "var(--muted)", fontFamily: "sans-serif", fontSize: 13, textAlign: "center", padding: "2rem 0" }}>
            Паттерны появятся после нескольких записей с тегами
          </div>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {sorted.map(([tag, count]) => (
            <div key={tag} style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{tag}</div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                  <div style={{ height: "100%", borderRadius: 2, background: count >= 3 ? "#f77e7e" : count === 2 ? "#f0b464" : "#7ee2b8", width: `${Math.min(100, count * 25)}%`, transition: "width 0.6s ease" }} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", minWidth: 20, textAlign: "right" }}>{count}×</div>
            </div>
          ))}
        </div>

        {sorted.length > 0 && (
          <div style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem", marginTop: 12 }}>
            <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", lineHeight: 1.7 }}>
              💡 Паттерны — это не приговор. Это просто повторяющиеся реакции, которые когда-то помогали выжить. Теперь, когда ты их видишь — у тебя есть выбор.
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Entry detail ──
  if (view === "entry" && selected) {
    const e = selected;
    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, padding: "0 0 1rem", display: "flex", alignItems: "center", gap: 6 }}>
          ← Назад
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>{MOODS[e.mood]}</div>
          <div>
            <div style={{ fontSize: 16 }}>{MOOD_LABELS[e.mood]}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif" }}>{formatEntryDate(e.date)}</div>
          </div>
        </div>

        {[
          { label: "Что произошло", value: e.what_happened },
          { label: "Что я почувствовала", value: e.what_felt },
          { label: "Что помогло", value: e.what_helped },
          { label: "Осознание", value: e.insight },
        ].filter(x => x.value).map(({ label, value }) => (
          <div key={label} style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7 }}>{value}</div>
          </div>
        ))}

        {e.pattern_tags?.length > 0 && (
          <div style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Паттерны</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {e.pattern_tags.map(t => (
                <span key={t} style={{ background: "rgba(88,166,201,0.12)", color: "#58a6c9", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── New entry wizard ──
  if (view === "new") {
    const steps = [
      { title: "Как ты сейчас?", hint: null },
      { title: "Что произошло?", hint: REFLECTION_PROMPTS[promptIdx] },
      { title: "Что ты почувствовала?", hint: "Можно одно слово или целый абзац" },
      { title: "Что помогло или могло помочь?", hint: "Звук, практика, разговор, прогулка..." },
      { title: "Осознание и паттерны", hint: "Не обязательно — если что-то заметила в себе" },
    ];
    const current = steps[step];
    const canNext = step === 0 ? newMood !== null : true;

    return (
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <button onClick={() => step === 0 ? setView("list") : setStep(s => s - 1)}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
            {step === 0 ? "Отмена" : "← Назад"}
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i <= step ? "#58a6c9" : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
            ))}
          </div>
          <div style={{ width: 48 }} />
        </div>

        <div style={{ fontSize: 20, marginBottom: 6, lineHeight: 1.4 }}>{current.title}</div>
        {current.hint && (
          <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 20, lineHeight: 1.6 }}>
            {current.hint}
            {step === 1 && (
              <button onClick={() => setPromptIdx(i => (i + 1) % REFLECTION_PROMPTS.length)}
                style={{ display: "inline", marginLeft: 8, background: "none", border: "none", color: "#58a6c9", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12 }}>
                другой вопрос
              </button>
            )}
          </div>
        )}

        {step === 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setNewMood(i)}
                style={{ flex: 1, padding: "14px 0", border: `${newMood === i ? "1px solid #58a6c9" : "0.5px solid rgba(255,255,255,0.08)"}`, borderRadius: 40, background: newMood === i ? "#1c2333" : "#161b22", fontSize: 22, cursor: "pointer", transition: "all 0.2s" }}>
                {m}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <textarea value={newWhat} onChange={e => setNewWhat(e.target.value)} placeholder="Пиши свободно, без цензуры — это только для тебя..." rows={5}
            style={{ width: "100%", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px", color: "#e6edf3", fontSize: 15, fontFamily: "'Outfit', sans-serif", lineHeight: 1.7, resize: "none", outline: "none" }} />
        )}

        {step === 2 && (
          <textarea value={newFelt} onChange={e => setNewFelt(e.target.value)} placeholder="Тревога, усталость, злость, облегчение... любые слова подходят" rows={4}
            style={{ width: "100%", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px", color: "#e6edf3", fontSize: 15, fontFamily: "'Outfit', sans-serif", lineHeight: 1.7, resize: "none", outline: "none" }} />
        )}

        {step === 3 && (
          <textarea value={newHelped} onChange={e => setNewHelped(e.target.value)} placeholder="Медитация, звуки, разговор, прогулка, просто время..." rows={4}
            style={{ width: "100%", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px", color: "#e6edf3", fontSize: 15, fontFamily: "", lineHeight: 1.7, resize: "none", outline: "none" }} />
        )}

        {step === 4 && (
          <div>
            <textarea value={newInsight} onChange={e => setNewInsight(e.target.value)} placeholder="Я снова заметила, что... / Сегодня я поняла..." rows={3}
              style={{ width: "100%", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px", color: "#e6edf3", fontSize: 15, fontFamily: "Georgia, serif", lineHeight: 1.7, resize: "none", outline: "none", marginBottom: 16 }} />
            <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", marginBottom: 10 }}>Отметь паттерны, если узнала что-то в себе:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PATTERN_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)}
                  style={{ padding: "6px 14px", borderRadius: 20, border: `0.5px solid ${newTags.includes(t) ? "#58a6c9" : "rgba(255,255,255,0.08)"}`, background: newTags.includes(t) ? "rgba(88,166,201,0.15)" : "#161b22", color: newTags.includes(t) ? "#58a6c9" : "var(--muted)", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
              style={{ width: "100%", padding: "14px", background: canNext ? "#58a6c9" : "rgba(88,166,201,0.2)", border: "none", borderRadius: 14, color: canNext ? "#0d1117" : "var(--muted)", fontSize: 15, fontFamily: "sans-serif", cursor: canNext ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              Далее →
            </button>
          ) : (
            <button onClick={saveEntry}
              style={{ width: "100%", padding: "14px", background: "#7ee2b8", border: "none", borderRadius: 14, color: "#0d1117", fontSize: 15, fontFamily: "sans-serif", cursor: "pointer" }}>
              Сохранить запись ✓
            </button>
          )}
          {step > 0 && step < 4 && (
            <button onClick={() => setStep(s => s + 1)}
              style={{ width: "100%", padding: "10px", background: "none", border: "none", color: "var(--muted)", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", marginTop: 8 }}>
              Пропустить этот шаг
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Entry list ──
  return (
    <div style={{ padding: "0 0 1.5rem" }}>
      <div style={{ padding: "0 1.5rem", marginBottom: 16, display: "flex", gap: 10 }}>
        <button onClick={() => { setStep(0); setView("new"); }}
          style={{ flex: 1, padding: "12px", background: "#58a6c9", border: "none", borderRadius: 14, color: "#0d1117", fontSize: 14, fontFamily: "sans-serif", cursor: "pointer" }}>
          + Новая запись
        </button>
        <button onClick={() => setView("patterns")}
          style={{ padding: "12px 16px", background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "var(--muted)", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer" }}>
          📊 Паттерны
        </button>
      </div>

      {entries.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--muted)", fontFamily: "sans-serif" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📓</div>
          <div style={{ fontSize: 15, marginBottom: 6 }}>Дневник пока пустой</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>Первая запись — это уже шаг к пониманию себя</div>
        </div>
      )}

      <div style={{ display: "grid", gap: 10, padding: "0 1.5rem" }}>
        {entries.map(e => (
          <button key={e.id} onClick={() => { setSelected(e); setView("entry"); }}
            style={{ background: "#161b22", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px", textAlign: "left", cursor: "pointer", color: "var(--text)", display: "block", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{MOODS[e.mood]}</span>
                <div>
                  <div style={{ fontSize: 13, fontFamily: "sans-serif" }}>{MOOD_LABELS[e.mood]}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "sans-serif" }}>{formatEntryDate(e.date)}</div>
                </div>
              </div>
              <span style={{ color: "var(--muted)", fontSize: 18 }}>›</span>
            </div>
            {e.what_happened && (
              <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: e.pattern_tags?.length ? 10 : 0,
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {e.what_happened}
              </div>
            )}
            {e.pattern_tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {e.pattern_tags.slice(0, 3).map(t => (
                  <span key={t} style={{ background: "rgba(88,166,201,0.1)", color: "#58a6c9", fontSize: 11, padding: "2px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const ctrlStyle = { background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20, display: "flex", transition: "color 0.2s", padding: 4 };
const navBtnStyle = { background: "none", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 48, height: 48, fontSize: 20, color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

// ─── App Shell ─────────────────────────────────────────────────────────────────

const NAV = [
  { id: "home",        icon: "🏠", label: "Главная" },
  { id: "sounds",      icon: "🎧", label: "Звуки" },
  { id: "meditations", icon: "🧘", label: "Практики" },
  { id: "tuneins",     icon: "✨", label: "Настрои" },
  { id: "journal",     icon: "📓", label: "Дневник" },
  { id: "progress",    icon: "📈", label: "Прогресс" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [mood, setMood] = useState(null);
  const [currentSound, setCurrentSound] = useState(SOUNDS[0]);

  const screenTitles = {
    home: getGreeting(),
    sounds: "Звуки",
    meditations: "Практики",
    tuneins: "Настрои",
    affirmations: "Аффирмации",
    journal: "Дневник",
    progress: "Прогресс",
  };

  return (
    <div style={{ background: "#51a2c7", color: "#51a2c7", minHeight: "100vh", fontFamily: "Georgia, serif", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`
        :root { --muted: #7d8590; --text: #e6edf3; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { color: inherit; }
        input[type=range] { cursor: pointer; }
        textarea:focus { border-color: rgba(88,166,201,0.5) !important; }
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=Nunito:ital,wght@0,400;1,400&display=swap');@keyframes wave { 0%,100% { height: 3px } 50% { height: 12px } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 22, letterSpacing: "0.04em" }}>
         Ocean<span style={{ color: "#7ee2b8" }}>Mind</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "sans-serif" }}>{screenTitles[screen]}</div>
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
      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 12px", borderTop: "0.5px solid rgba(255,255,255,0.08)", flexShrink: 0, background: "#db91cb" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, fontFamily: "sans-serif", color: screen === n.id ? "#58a6c9" : "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", transition: "color 0.2s" }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
