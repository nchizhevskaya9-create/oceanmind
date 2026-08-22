import { createClient } from "@supabase/supabase-js";

// Переменные окружения задаются в Netlify:
// Site configuration → Environment variables →
//   REACT_APP_SUPABASE_URL = https://lusdbgwmmkeignnkxkbz.supabase.co
//   REACT_APP_SUPABASE_ANON_KEY = <anon public key из Supabase → Settings → API>

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "OceanMind: переменные окружения Supabase не заданы. " +
    "Приложение будет работать в офлайн-режиме (только localStorage)."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
