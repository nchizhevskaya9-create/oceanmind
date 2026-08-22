import { supabase } from "../supabaseClient";

// Все функции работают только если пользователь вошёл (supabase выставляет user_id сам через RLS,
// но auth.uid() должен совпадать — поэтому user_id передаём явно при insert).

// ─── Дневник ────────────────────────────────────────────────
export async function fetchJournalEntries(userId) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addJournalEntry(userId, entry) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      mood: entry.mood,
      what_happened: entry.what_happened,
      what_felt: entry.what_felt,
      what_helped: entry.what_helped,
      insight: entry.insight,
      tags: entry.pattern_tags ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(entryId) {
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId);
  if (error) throw error;
}

// ─── Благодарность ──────────────────────────────────────────
export async function fetchGratitudeEntries(userId) {
  const { data, error } = await supabase
    .from("gratitude_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addGratitudeEntry(userId, items) {
  const { data, error } = await supabase
    .from("gratitude_entries")
    .insert({ user_id: userId, items })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Письма себе ────────────────────────────────────────────
export async function fetchLetters(userId) {
  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addLetter(userId, text, monthsAhead) {
  const unlockAt = new Date();
  unlockAt.setMonth(unlockAt.getMonth() + monthsAhead);
  const { data, error } = await supabase
    .from("letters")
    .insert({ user_id: userId, text, unlock_at: unlockAt.toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markLetterOpened(letterId) {
  const { error } = await supabase
    .from("letters")
    .update({ opened_at: new Date().toISOString() })
    .eq("id", letterId);
  if (error) throw error;
}

// ─── Рефлексия / "Карта" ────────────────────────────────────
export async function fetchReflections(userId) {
  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addReflection(userId, answers, aiSummary = null) {
  const { data, error } = await supabase
    .from("reflections")
    .insert({ user_id: userId, answers, ai_summary: aiSummary })
    .select()
    .single();
  if (error) throw error;
  return data;
}
