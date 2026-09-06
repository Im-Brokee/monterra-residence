"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    if (!supabase) {
      setError("Najpierw dodaj NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? "")
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="loginPage">
      <div className="loginCard">
        <Link href="/" className="brand"><span className="brandMain">Monterra</span><span className="brandSub">RESIDENCE</span></Link>
        <span className="eyebrow">PANEL SPRZEDAŻY</span>
        <h1>Zaloguj się</h1>
        <p>Panel służy do zmiany cen, statusów mieszkań i obsługi zapytań.</p>
        <form onSubmit={submit} className="loginForm">
          <label>E-mail<input type="email" name="email" required /></label>
          <label>Hasło<input type="password" name="password" required /></label>
          <button className="button buttonGold full" disabled={loading}>{loading ? "Logowanie…" : "Zaloguj"}</button>
        </form>
        {error && <p className="formError">{error}</p>}
        <Link href="/" className="backLink">← Wróć na stronę</Link>
      </div>
    </main>
  );
}
