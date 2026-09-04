"use client";

import { useMemo, useState } from "react";
import type { Addon, Apartment } from "@/lib/types";
import { formatPln } from "@/lib/format";
import { LeadForm } from "@/components/LeadForm";

function addonPrice(addon: Addon, area: number) {
  return addon.priceType === "per_sqm" ? Math.round(addon.priceValue * area) : addon.priceValue;
}

export function ApartmentConfigurator({ apartment, addons }: { apartment: Apartment; addons: Addon[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(addon: Addon) {
    setSelected((current) => {
      const exists = current.includes(addon.id);
      if (exists) return current.filter((id) => id !== addon.id);

      const sameGroup = addons
        .filter((item) => item.selectionGroup === addon.selectionGroup)
        .map((item) => item.id);
      const exclusive = addon.selectionGroup === "parking" || addon.selectionGroup === "finish";
      const cleaned = exclusive ? current.filter((id) => !sameGroup.includes(id)) : current;
      return [...cleaned, addon.id];
    });
  }

  const selectedRows = useMemo(() => addons.filter((addon) => selected.includes(addon.id)), [addons, selected]);
  const addonsTotal = selectedRows.reduce((sum, addon) => sum + addonPrice(addon, apartment.area), 0);
  const total = apartment.price + addonsTotal;

  return (
    <aside className="configurator cardSoft">
      <span className="eyebrow">KONFIGURATOR CENY</span>
      <h2>Dopasuj zakup</h2>
      <p className="muted">Wybierz parking, komórkę lub pakiet wykończenia. Cena zmienia się automatycznie.</p>

      <div className="basePriceRow">
        <span>Cena mieszkania</span>
        <strong>{formatPln(apartment.price)}</strong>
      </div>

      <div className="addonList">
        {addons.map((addon) => {
          const price = addonPrice(addon, apartment.area);
          const checked = selected.includes(addon.id);
          return (
            <button key={addon.id} type="button" className={`addonRow ${checked ? "selected" : ""}`} onClick={() => toggle(addon)}>
              <span className="fakeCheckbox">{checked ? "✓" : ""}</span>
              <span className="addonCopy">
                <strong>{addon.name}</strong>
                <small>{addon.description}</small>
              </span>
              <span className="addonPrice">+ {formatPln(price)}</span>
            </button>
          );
        })}
      </div>

      <div className="totalBox">
        <div><span>Dodatki</span><strong>{formatPln(addonsTotal)}</strong></div>
        <div className="grandTotal"><span>Łączna cena</span><strong>{formatPln(total)}</strong></div>
      </div>

      <div className="selectedSummary">
        {selectedRows.length ? selectedRows.map((addon) => (
          <span key={addon.id}>{addon.name}</span>
        )) : <span>Bez dodatków</span>}
      </div>

      <h3>Zapytaj o tę konfigurację</h3>
      <LeadForm payload={{
        apartmentId: apartment.id,
        selectedAddons: selectedRows.map((addon) => ({
          id: addon.id,
          slug: addon.slug,
          name: addon.name,
          price: addonPrice(addon, apartment.area)
        })),
        basePrice: apartment.price,
        addonsTotal,
        totalPrice: total
      }} />
    </aside>
  );
}
