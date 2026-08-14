import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// Хук возвращает { user, loading }. user === null, если не вошёл или Supabase не настроен.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// Вход/регистрация через magic link (без пароля — проще для пользователя)
export async function signInWithEmail(email, lang = "ru") {
  if (!supabase) throw new Error("Supabase не настроен");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { lang },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
