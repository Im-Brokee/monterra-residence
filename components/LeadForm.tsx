"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeadPayload } from "@/lib/types";

export function LeadForm({ payload }: { payload: Omit<LeadPayload, "name" | "phone" | "email" | "message"> }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "demo">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    if (!supabase) {
      setState("demo");
      return;
    }

    setState("sending");
    const { error: insertError } = await supabase.from("leads").insert({
      apartment_id: payload.apartmentId,
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      selected_addons: payload.selectedAddons,
      base_price: payload.basePrice,
      addons_total: payload.addonsTotal,
      total_price: payload.totalPrice,
      source: "website",
      status: "new"
    });

    if (insertError) {
      setError(insertError.message);
      setState("error");
      return;
    }
    setState("sent");
    e.currentTarget.reset();
  }

  return (
    <form className="leadForm" onSubmit={submit}>
      <div className="formGrid3">
        <input name="name" placeholder="Imię i nazwisko" required />
        <input name="phone" placeholder="Telefon" required minLength={7} />
        <input name="email" type="email" placeholder="E-mail" required />
      </div>
      <textarea name="message" placeholder="Wiadomość (opcjonalnie)" rows={3} />
      <label className="consent"><input type="checkbox" required /> Wyrażam zgodę na kontakt w sprawie wybranego mieszkania.</label>
      <button className="button buttonGold" disabled={state === "sending"}>
        {state === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
      </button>
      {state === "sent" && <p className="formSuccess">Dziękujemy. Zapytanie zostało zapisane.</p>}
      {state === "demo" && <p className="formNotice">Tryb demo: po dodaniu kluczy Supabase formularz zacznie zapisywać leady do bazy.</p>}
      {state === "error" && <p className="formError">{error}</p>}
    </form>
  );
}
