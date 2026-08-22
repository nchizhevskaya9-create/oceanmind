import { supabase } from "../supabaseClient";

const MIGRATION_FLAG = "om_migrated_to_cloud";

// Вызывать один раз после успешного входа пользователя.
// Переносит om_entries, om_gratitude, om_letters из localStorage в Supabase,
// затем ставит флаг, чтобы не дублировать при повторных входах на этом устройстве.
export async function migrateLocalDataIfNeeded(userId) {
  if (!supabase || !userId) return;
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  try {
    // Дневник
    const rawEntries = localStorage.getItem("om_entries");
    if (rawEntries) {
      const entries = JSON.parse(rawEntries);
      if (Array.isArray(entries) && entries.length) {
        const rows = entries.map((e) => ({
          user_id: userId,
          mood: e.mood ?? null,
          what_happened: e.what_happened ?? "",
          what_felt: e.what_felt ?? "",
          what_helped: e.what_helped ?? "",
          insight: e.insight ?? "",
          tags: e.pattern_tags ?? [],
        }));
        await supabase.from("journal_entries").insert(rows);
      }
    }

    // Благодарность
    const rawGratitude = localStorage.getItem("om_gratitude");
    if (rawGratitude) {
      const items = JSON.parse(rawGratitude);
      if (Array.isArray(items) && items.length) {
        const rows = items.map((g) => ({
          user_id: userId,
          items: Array.isArray(g.items) ? g.items : [],
        }));
        await supabase.from("gratitude_entries").insert(rows);
      }
    }

    // Письма
    const rawLetters = localStorage.getItem("om_letters");
    if (rawLetters) {
      const letters = JSON.parse(rawLetters);
      if (Array.isArray(letters) && letters.length) {
        const rows = letters
          .filter((l) => l.text)
          .map((l) => ({
            user_id: userId,
            text: l.text,
            unlock_at: l.unlockAt || new Date().toISOString(),
            opened_at: l.opened ? new Date().toISOString() : null,
          }));
        if (rows.length) await supabase.from("letters").insert(rows);
      }
    }

    localStorage.setItem(MIGRATION_FLAG, "1");
  } catch (err) {
    console.error("Ошибка миграции локальных данных:", err);
    // Не ставим флаг — попробуем снова при следующем входе
  }
}
