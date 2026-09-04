"use client";

import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPln } from "@/lib/format";
import type { Addon, AdminLead, ConstructionUpdate, InventoryItem, LeadStatus, PriceHistoryEntry } from "@/lib/types";

type AdminApartment = {
  id: string;
  slug: string;
  unitNumber: string;
  building: string;
  floor: number;
  rooms: number;
  area: number;
  status: "available" | "reserved" | "sold";
  price: number;
  pricePerSqm: number;
  published: boolean;
};

type HistoryRow = PriceHistoryEntry & { apartmentId: string };
type Tab = "dashboard" | "apartments" | "leads" | "inventory" | "addons" | "construction";

export function AdminDashboard({
  projectId,
  initialApartments,
  initialLeads,
  initialInventory,
  initialAddons,
  priceHistory,
  initialConstruction
}: {
  projectId: string | null;
  initialApartments: AdminApartment[];
  initialLeads: AdminLead[];
  initialInventory: InventoryItem[];
  initialAddons: Addon[];
  priceHistory: HistoryRow[];
  initialConstruction: ConstructionUpdate[];
}) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [apartments, setApartments] = useState(initialApartments);
  const [leads, setLeads] = useState(initialLeads);
  const [inventory, setInventory] = useState(initialInventory);
  const [addons, setAddons] = useState(initialAddons);
  const [construction, setConstruction] = useState(initialConstruction);
  const [selectedId, setSelectedId] = useState(initialApartments[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const selected = apartments.find((a) => a.id === selectedId);

  const stats = useMemo(() => ({
    total: apartments.length,
    available: apartments.filter((a) => a.status === "available").length,
    reserved: apartments.filter((a) => a.status === "reserved").length,
    sold: apartments.filter((a) => a.status === "sold").length,
    newLeads: leads.filter((l) => l.status === "new").length,
    availableParking: inventory.filter((i) => i.type === "parking" && i.status === "available").length
  }), [apartments, leads, inventory]);

  async function saveApartment(formData: FormData) {
    if (!selected) return;
    const price = Number(formData.get("price"));
    const status = String(formData.get("status")) as AdminApartment["status"];
    const published = formData.get("published") === "on";
    const supabase = createClient();
    if (!supabase) return alert("Brak połączenia z Supabase.");

    setSaving(true);
    const { error } = await supabase.from("apartments").update({ price, status, published }).eq("id", selected.id);
    setSaving(false);
    if (error) return alert(error.message);

    setApartments((rows) => rows.map((row) => row.id === selected.id ? {
      ...row, price, status, published, pricePerSqm: Math.round(price / row.area)
    } : row));
  }

  async function updateLeadStatus(id: string, status: LeadStatus) {
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return alert(error.message);
    setLeads((rows) => rows.map((lead) => lead.id === id ? { ...lead, status } : lead));
  }

  async function saveInventory(item: InventoryItem, patch: Partial<InventoryItem>) {
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.from("inventory_items").update({
      price: patch.price ?? item.price,
      status: patch.status ?? item.status,
      active: patch.active ?? item.active
    }).eq("id", item.id);
    if (error) return alert(error.message);
    setInventory((rows) => rows.map((row) => row.id === item.id ? { ...row, ...patch } : row));
  }

  async function saveAddon(addon: Addon, patch: Partial<Addon>) {
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.from("addons").update({
      price_value: patch.priceValue ?? addon.priceValue,
      active: patch.active ?? addon.active
    }).eq("id", addon.id);
    if (error) return alert(error.message);
    setAddons((rows) => rows.map((row) => row.id === addon.id ? { ...row, ...patch } : row));
  }

  async function addConstruction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) return alert("Nie znaleziono projektu.");
    const form = new FormData(e.currentTarget);
    const payload = {
      project_id: projectId,
      title: String(form.get("title") ?? ""),
      body: String(form.get("body") ?? ""),
      progress: Number(form.get("progress") ?? 0),
      published: true,
      published_at: new Date().toISOString()
    };
    const supabase = createClient();
    if (!supabase) return;
    const { data, error } = await supabase.from("construction_updates").insert(payload).select("id, title, body, progress, image_url, published_at, published").single();
    if (error) return alert(error.message);
    setConstruction((rows) => [{ id: data.id, title: data.title, body: data.body ?? "", progress: Number(data.progress), imageUrl: data.image_url ?? null, publishedAt: data.published_at, published: Boolean(data.published) }, ...rows]);
    e.currentTarget.reset();
  }

  async function logout() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    window.location.href = "/admin/login";
  }

  const nav: Array<[Tab, string]> = [
    ["dashboard", "Dashboard"], ["apartments", "Mieszkania"], ["leads", "Zapytania"],
    ["inventory", "Parking i komórki"], ["addons", "Pakiety"], ["construction", "Postęp budowy"]
  ];

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div className="brand adminBrand"><span className="brandMain">Monterra</span><span className="brandSub">RESIDENCE</span></div>
        <span className="adminSectionLabel">PANEL SPRZEDAŻY</span>
        {nav.map(([id, label]) => <button className={tab === id ? "adminNav active" : "adminNav"} key={id} onClick={() => setTab(id)}>{label}</button>)}
        <button onClick={logout} className="adminLogout">Wyloguj się</button>
      </aside>

      <main className="adminMain">
        <div className="adminTopbar"><div><h1>{nav.find(([id]) => id === tab)?.[1]}</h1><p>Monterra Residence · panel sprzedaży</p></div><span className="adminProjectPill">Production</span></div>

        <section className="kpiGrid">
          <div className="kpi"><span>Wszystkich mieszkań</span><strong>{stats.total}</strong></div>
          <div className="kpi"><span>Dostępne</span><strong>{stats.available}</strong></div>
          <div className="kpi"><span>Rezerwacja</span><strong>{stats.reserved}</strong></div>
          <div className="kpi"><span>Sprzedane</span><strong>{stats.sold}</strong></div>
          <div className="kpi"><span>Nowe zapytania</span><strong>{stats.newLeads}</strong></div>
          <div className="kpi"><span>Wolny parking</span><strong>{stats.availableParking}</strong></div>
        </section>

        {(tab === "dashboard" || tab === "apartments") && <section className="adminGrid">
          <div className="adminCard adminTableCard">
            <div className="adminCardHead"><div><h2>Mieszkania</h2><p>Kliknij lokal, aby edytować cenę i status.</p></div></div>
            <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Nr</th><th>Metraż</th><th>Pokoi</th><th>Piętro</th><th>Status</th><th>Cena</th><th>Cena/m²</th></tr></thead><tbody>{apartments.map((a) => (
              <tr key={a.id} onClick={() => setSelectedId(a.id)} className={selectedId === a.id ? "selectedRow" : ""}><td>{a.unitNumber}</td><td>{a.area} m²</td><td>{a.rooms}</td><td>{a.floor}</td><td><span className={`statusPill ${a.status}`}>{a.status === "available" ? "Dostępne" : a.status === "reserved" ? "Rezerwacja" : "Sprzedane"}</span></td><td>{formatPln(a.price)}</td><td>{formatPln(a.pricePerSqm)}</td></tr>
            ))}</tbody></table></div>
          </div>
          <div className="adminCard editCard"><h2>Aktualizuj mieszkanie</h2>{selected ? <form action={saveApartment}>
            <label>Mieszkanie<input value={`${selected.unitNumber} (${selected.area} m²)`} disabled /></label>
            <label>Status<select name="status" defaultValue={selected.status} key={`${selected.id}-status`}><option value="available">Dostępne</option><option value="reserved">Rezerwacja</option><option value="sold">Sprzedane</option></select></label>
            <label>Cena brutto<input name="price" type="number" defaultValue={selected.price} key={`${selected.id}-price`} /></label>
            <label>Cena za m²<input value={selected.pricePerSqm} disabled /></label>
            <label className="adminCheckbox"><input name="published" type="checkbox" defaultChecked={selected.published} key={`${selected.id}-published`} /> Widoczne na stronie</label>
            <button className="button buttonGold full" disabled={saving}>{saving ? "Zapisywanie…" : "Zapisz zmiany"}</button>
          </form> : <p>Brak mieszkań.</p>}</div>
        </section>}

        {(tab === "dashboard" || tab === "leads") && <section className="adminCard adminWideCard"><div className="adminCardHead"><div><h2>Zapytania</h2><p>Konfiguracja klienta razem z wybraną ceną.</p></div></div><div className="leadAdminGrid">{leads.length ? leads.map((lead) => (
          <article className="leadAdminCard" key={lead.id}><div className="leadAdminTop"><div><strong>{lead.name}</strong><span>{lead.email}</span><span>{lead.phone}</span></div><b>{formatPln(lead.totalPrice)}</b></div><div className="leadTags">{lead.selectedInventory.map((i) => <span key={i.id}>{i.code}</span>)}{lead.selectedAddons.map((i) => <span key={i.id}>{i.name}</span>)}</div><select value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}><option value="new">Nowe</option><option value="contacted">Kontakt</option><option value="meeting">Spotkanie</option><option value="won">Wygrane</option><option value="lost">Przegrane</option></select></article>
        )) : <p className="muted">Brak zapytań.</p>}</div></section>}

        {tab === "inventory" && <section className="adminCard adminWideCard"><h2>Parking i komórki</h2><div className="inventoryAdminGrid">{inventory.map((item) => <InventoryAdminRow key={item.id} item={item} onSave={saveInventory} />)}</div></section>}

        {tab === "addons" && <section className="adminCard adminWideCard"><h2>Pakiety wykończenia i Smart Home</h2><div className="inventoryAdminGrid">{addons.map((addon) => <AddonAdminRow key={addon.id} addon={addon} onSave={saveAddon} />)}</div></section>}

        {tab === "construction" && <section className="adminGrid"><div className="adminCard"><h2>Dodaj aktualizację</h2><form className="adminStackForm" onSubmit={addConstruction}><label>Tytuł<input name="title" required /></label><label>Opis<textarea name="body" rows={4} /></label><label>Postęp %<input name="progress" type="number" min="0" max="100" defaultValue="62" /></label><button className="button buttonGold">Dodaj aktualizację</button></form></div><div className="adminCard"><h2>Ostatnie aktualizacje</h2><div className="constructionAdminList">{construction.map((item) => <div key={item.id}><strong>{item.progress}% · {item.title}</strong><span>{item.body}</span><small>{new Date(item.publishedAt).toLocaleDateString("pl-PL")}</small></div>)}</div></div></section>}

        {tab === "dashboard" && <section className="adminLowerGrid"><div className="adminCard"><h2>Historia cen</h2><div className="fakeChart">{priceHistory.slice(0, 10).reverse().map((row, i) => <span key={row.id} title={formatPln(row.newPrice)} style={{height:`${35 + ((i * 11) % 50)}%`}} />)}</div><p className="muted">{priceHistory.length} zapisanych zmian cen.</p></div><div className="adminCard"><h2>Postęp budowy</h2><div className="constructionVisual"><span>{construction[0]?.progress ?? 62}%</span></div><strong>{construction[0]?.title ?? "Stan surowy zamknięty"}</strong></div><div className="adminCard"><h2>System</h2><p>Zmiana ceny → historia cen. Formularz → lead. Konfigurator → parking, komórka i pakiety w jednym zapytaniu.</p></div></section>}
      </main>
    </div>
  );
}

function InventoryAdminRow({ item, onSave }: { item: InventoryItem; onSave: (item: InventoryItem, patch: Partial<InventoryItem>) => Promise<void> }) {
  const [price, setPrice] = useState(item.price);
  const [status, setStatus] = useState(item.status);
  return <div className="inventoryAdminRow"><div><strong>{item.code} · {item.name}</strong><span>{item.description}</span></div><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /><select value={status} onChange={(e) => setStatus(e.target.value as InventoryItem["status"])}><option value="available">Dostępne</option><option value="reserved">Rezerwacja</option><option value="sold">Sprzedane</option></select><button className="button buttonGhost" onClick={() => onSave(item, { price, status })}>Zapisz</button></div>;
}

function AddonAdminRow({ addon, onSave }: { addon: Addon; onSave: (addon: Addon, patch: Partial<Addon>) => Promise<void> }) {
  const [priceValue, setPriceValue] = useState(addon.priceValue);
  const [active, setActive] = useState(addon.active);
  return <div className="inventoryAdminRow"><div><strong>{addon.name}</strong><span>{addon.priceType === "per_sqm" ? "Cena za m²" : "Cena stała"}</span></div><input type="number" value={priceValue} onChange={(e) => setPriceValue(Number(e.target.value))} /><label className="inlineToggle"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> aktywny</label><button className="button buttonGhost" onClick={() => onSave(addon, { priceValue, active })}>Zapisz</button></div>;
}
