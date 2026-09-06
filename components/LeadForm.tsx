"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeadPayload } from "@/lib/types";
import { formatPln } from "@/lib/format";

export function LeadForm({ payload }: { payload: Omit<LeadPayload, "name" | "phone" | "email" | "message"> }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "demo">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const phone = String(form.get("phone") ?? "").replace(/\s/g, "");
    const email = String(form.get("email") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();

    if (name.length < 2 || phone.length < 7 || !email.includes("@")) {
      setError("Sprawdź imię, telefon i e-mail.");
      setState("error");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setState("demo");
      return;
    }

    setState("sending");
    setError("");
    const { error: insertError } = await supabase.from("leads").insert({
      apartment_id: payload.apartmentId,
      name,
      phone,
      email,
      message: String(form.get("message") ?? ""),
      selected_addons: payload.selectedAddons,
      selected_inventory: payload.selectedInventory,
      base_price: payload.basePrice,
      addons_total: payload.addonsTotal,
      inventory_total: payload.inventoryTotal,
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
    formEl.reset();
  }

  return (
    <form className="leadForm" onSubmit={submit}>
      <div className="formGrid3">
        <input name="name" placeholder="Imię i nazwisko" autoComplete="name" required />
        <input name="phone" placeholder="Telefon" inputMode="tel" autoComplete="tel" required minLength={7} />
        <input name="email" type="email" placeholder="E-mail" autoComplete="email" required />
      </div>
      <textarea name="message" placeholder="Wiadomość (opcjonalnie)" rows={3} />
      <div className="leadOrderSummary">
        <span>Wybrana konfiguracja</span>
        <strong>{formatPln(payload.totalPrice)}</strong>
      </div>
      <label className="consent"><input type="checkbox" required /> Wyrażam zgodę na kontakt w sprawie wybranego mieszkania.</label>
      <button className="button buttonGold full" disabled={state === "sending" || state === "sent"}>
        {state === "sending" ? "Wysyłanie…" : state === "sent" ? "Zapytanie wysłane ✓" : "Wyślij zapytanie"}
      </button>
      {state === "sent" && <p className="formSuccess">Dziękujemy. Doradca otrzymał lokal, dodatki i łączną cenę.</p>}
      {state === "demo" && <p className="formNotice">Tryb demo: po dodaniu zmiennych Supabase formularz zapisze zapytanie do bazy.</p>}
      {state === "error" && <p className="formError">{error}</p>}
    </form>
  );
}
