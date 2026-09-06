"use client";

import { useState } from "react";

export function ApartmentActions({ label }: { label: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Monterra Residence · ${label}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // User cancelled the native share sheet.
    }
  }

  return (
    <div className="apartmentQuickActions">
      <button onClick={() => window.print()}>↧ Karta mieszkania / PDF</button>
      <button onClick={share}>{copied ? "✓ Link skopiowany" : "↗ Udostępnij"}</button>
    </div>
  );
}
