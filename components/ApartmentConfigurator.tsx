"use client";

import { useMemo, useState } from "react";
import type { Addon, Apartment, InventoryItem } from "@/lib/types";
import { formatPln } from "@/lib/format";
import { LeadForm } from "@/components/LeadForm";

function addonPrice(addon: Addon, area: number) {
  return addon.priceType === "per_sqm" ? Math.round(addon.priceValue * area) : addon.priceValue;
}

export function ApartmentConfigurator({
  apartment,
  addons,
  inventory
}: {
  apartment: Apartment;
  addons: Addon[];
  inventory: InventoryItem[];
}) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedParking, setSelectedParking] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");

  const publicAddons = useMemo(
    () => addons.filter((addon) => addon.category === "finish" || addon.category === "smart"),
    [addons]
  );

  const parking = inventory.filter((item) => item.type === "parking" && item.status !== "sold" && item.active);
  const storage = inventory.filter((item) => item.type === "storage" && item.status !== "sold" && item.active);

  function toggleAddon(addon: Addon) {
    setSelectedAddons((current) => {
      if (current.includes(addon.id)) return current.filter((id) => id !== addon.id);
      const sameGroupIds = publicAddons
        .filter((item) => item.selectionGroup === addon.selectionGroup)
        .map((item) => item.id);
      const exclusive = addon.selectionGroup === "finish";
      const cleaned = exclusive ? current.filter((id) => !sameGroupIds.includes(id)) : current;
      return [...cleaned, addon.id];
    });
  }

  const selectedAddonRows = publicAddons.filter((addon) => selectedAddons.includes(addon.id));
  const selectedInventoryRows = inventory.filter((item) => item.id === selectedParking || item.id === selectedStorage);

  const addonsTotal = selectedAddonRows.reduce((sum, addon) => sum + addonPrice(addon, apartment.area), 0);
  const inventoryTotal = selectedInventoryRows.reduce((sum, item) => sum + item.price, 0);
  const total = apartment.price + addonsTotal + inventoryTotal;

  return (
    <aside className="configurator cardSoft stickyConfigurator">
      <span className="eyebrow">KONFIGURATOR CENY</span>
      <h2>Skonfiguruj zakup</h2>
      <p className="muted">Wybierz konkretne miejsce postojowe, komórkę i pakiet wykończenia. Suma zmienia się od razu.</p>

      <div className="basePriceRow">
        <span>Cena mieszkania</span>
        <strong>{formatPln(apartment.price)}</strong>
      </div>

      <div className="configSection">
        <div className="configSectionTitle"><strong>1. Miejsce postojowe</strong><span>opcjonalnie</span></div>
        <select value={selectedParking} onChange={(e) => setSelectedParking(e.target.value)}>
          <option value="">Bez miejsca postojowego</option>
          {parking.map((item) => (
            <option key={item.id} value={item.id} disabled={item.status === "reserved"}>
              {item.code} · {item.status === "reserved" ? "rezerwacja" : formatPln(item.price)}
            </option>
          ))}
        </select>
        <div className="parkingPlan" aria-label="Plan miejsc postojowych">
          <div className="parkingDriveLane">DROGA MANEWROWA</div>
          <div className="parkingSpaces">
            {parking.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={item.status !== "available"}
                onClick={() => setSelectedParking(selectedParking === item.id ? "" : item.id)}
                className={`${item.status} ${selectedParking === item.id ? "selected" : ""}`}
                title={`${item.code} · ${item.status === "available" ? formatPln(item.price) : "Rezerwacja"}`}
              >
                <span>{item.code}</span><i>▰</i>
              </button>
            ))}
          </div>
          <div className="parkingLegend"><span><i className="pAvailable"/> wolne</span><span><i className="pReserved"/> rezerwacja</span><span><i className="pSelected"/> wybrane</span></div>
        </div>
        {selectedParking && <InventoryPreview item={inventory.find((item) => item.id === selectedParking)!} />}
      </div>

      <div className="configSection">
        <div className="configSectionTitle"><strong>2. Komórka lokatorska</strong><span>opcjonalnie</span></div>
        <select value={selectedStorage} onChange={(e) => setSelectedStorage(e.target.value)}>
          <option value="">Bez komórki</option>
          {storage.map((item) => (
            <option key={item.id} value={item.id} disabled={item.status === "reserved"}>
              {item.code}{item.area ? ` · ${item.area} m²` : ""} · {item.status === "reserved" ? "rezerwacja" : formatPln(item.price)}
            </option>
          ))}
        </select>
        {selectedStorage && <InventoryPreview item={inventory.find((item) => item.id === selectedStorage)!} />}
      </div>

      <div className="configSection">
        <div className="configSectionTitle"><strong>3. Wykończenie i technologie</strong><span>opcjonalnie</span></div>
        <div className="addonList compactAddons">
          {publicAddons.map((addon) => {
            const price = addonPrice(addon, apartment.area);
            const checked = selectedAddons.includes(addon.id);
            return (
              <button key={addon.id} type="button" className={`addonRow ${checked ? "selected" : ""}`} onClick={() => toggleAddon(addon)}>
                <span className="fakeCheckbox">{checked ? "✓" : ""}</span>
                <span className="addonCopy"><strong>{addon.name}</strong><small>{addon.description}</small></span>
                <span className="addonPrice">+ {formatPln(price)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="totalBox">
        <div><span>Mieszkanie</span><strong>{formatPln(apartment.price)}</strong></div>
        <div><span>Parking / komórka</span><strong>{formatPln(inventoryTotal)}</strong></div>
        <div><span>Pakiety</span><strong>{formatPln(addonsTotal)}</strong></div>
        <div className="grandTotal"><span>Łącznie</span><strong>{formatPln(total)}</strong></div>
      </div>

      <div className="selectedSummary">
        {selectedInventoryRows.map((item) => <span key={item.id}>{item.code}</span>)}
        {selectedAddonRows.map((addon) => <span key={addon.id}>{addon.name}</span>)}
        {!selectedInventoryRows.length && !selectedAddonRows.length && <span>Bez dodatków</span>}
      </div>

      <MortgageMini total={total} />

      <h3>Zapytaj o tę konfigurację</h3>
      <LeadForm payload={{
        apartmentId: apartment.id,
        selectedAddons: selectedAddonRows.map((addon) => ({
          id: addon.id,
          slug: addon.slug,
          name: addon.name,
          price: addonPrice(addon, apartment.area)
        })),
        selectedInventory: selectedInventoryRows.map((item) => ({
          id: item.id,
          code: item.code,
          type: item.type,
          name: item.name,
          price: item.price
        })),
        basePrice: apartment.price,
        addonsTotal,
        inventoryTotal,
        totalPrice: total
      }} />
    </aside>
  );
}

function InventoryPreview({ item }: { item: InventoryItem }) {
  return (
    <div className="inventoryPreview">
      <div><strong>{item.name}</strong><span>{item.description}</span></div>
      <b>{formatPln(item.price)}</b>
    </div>
  );
}

function MortgageMini({ total }: { total: number }) {
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(6.5);

  const principal = Math.max(0, total * (1 - downPayment / 100));
  const months = Math.max(1, years * 12);
  const monthlyRate = rate / 100 / 12;
  const payment = monthlyRate === 0
    ? principal / months
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

  return (
    <details className="mortgageMini">
      <summary>Orientacyjna rata kredytu</summary>
      <div className="mortgageGrid">
        <label>Wkład własny
          <select value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}>
            <option value={10}>10%</option><option value={20}>20%</option><option value={30}>30%</option>
          </select>
        </label>
        <label>Okres
          <select value={years} onChange={(e) => setYears(Number(e.target.value))}>
            <option value={20}>20 lat</option><option value={25}>25 lat</option><option value={30}>30 lat</option><option value={35}>35 lat</option>
          </select>
        </label>
        <label>Oprocentowanie
          <input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
      </div>
      <div className="mortgageResult"><span>Szacunkowo</span><strong>{formatPln(Math.round(payment))} / mies.</strong></div>
      <small>Symulacja orientacyjna, nie stanowi oferty kredytowej.</small>
    </details>
  );
}
