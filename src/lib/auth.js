import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// Хук возвращает { user, isPro, loading }. user === null, если не вошёл или Supabase не настроен.
// isPro === false для гостей и для вошедших без активной Pro-подписки.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchProStatus(currentUser) {
    if (!supabase || !currentUser) {
      setIsPro(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", currentUser.id)
      .single();
    setIsPro(Boolean(data?.is_pro));
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      fetchProStatus(currentUser).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        fetchProStatus(currentUser);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, isPro, loading };
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
