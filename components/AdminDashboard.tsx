"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPln } from "@/lib/format";

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

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  total_price: number;
  status: string;
  apartment_id: string;
};

export function AdminDashboard({ initialApartments, leads }: { initialApartments: AdminApartment[]; leads: Lead[] }) {
  const [apartments, setApartments] = useState(initialApartments);
  const [selectedId, setSelectedId] = useState(initialApartments[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const selected = apartments.find((a) => a.id === selectedId);

  const stats = useMemo(() => ({
    total: apartments.length,
    available: apartments.filter((a) => a.status === "available").length,
    reserved: apartments.filter((a) => a.status === "reserved").length,
    sold: apartments.filter((a) => a.status === "sold").length
  }), [apartments]);

  async function saveSelected(formData: FormData) {
    if (!selected) return;
    const price = Number(formData.get("price"));
    const status = String(formData.get("status")) as AdminApartment["status"];
    const supabase = createClient();
    if (!supabase) return alert("Dodaj zmienne Supabase. W trybie demo zapis jest wyłączony.");

    setSaving(true);
    const { error } = await supabase
      .from("apartments")
      .update({ price, status })
      .eq("id", selected.id);
    setSaving(false);

    if (error) return alert(error.message);
    setApartments((rows) => rows.map((row) => row.id === selected.id ? {
      ...row,
      price,
      status,
      pricePerSqm: Math.round(price / row.area)
    } : row));
  }

  async function logout() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div className="brand adminBrand"><span className="brandMain">Monterra</span><span className="brandSub">RESIDENCE</span></div>
        <span className="adminSectionLabel">PANEL SPRZEDAŻY</span>
        {['Dashboard','Mieszkania','Budynki','Klienci','Zapytania','Cennik','Historia cen','Galeria','Postęp budowy','Ustawienia'].map((item, i) => (
          <button className={i === 0 ? "adminNav active" : "adminNav"} key={item}>{item}</button>
        ))}
        <button onClick={logout} className="adminLogout">Wyloguj się</button>
      </aside>

      <main className="adminMain">
        <div className="adminTopbar">
          <div><h1>Dashboard</h1><p>Przegląd sprzedaży i zarządzanie ofertą</p></div>
          <span className="adminProjectPill">Monterra Residence</span>
        </div>

        <section className="kpiGrid">
          <div className="kpi"><span>Wszystkich mieszkań</span><strong>{stats.total}</strong></div>
          <div className="kpi"><span>Dostępne</span><strong>{stats.available}</strong></div>
          <div className="kpi"><span>Zarezerwowane</span><strong>{stats.reserved}</strong></div>
          <div className="kpi"><span>Sprzedane</span><strong>{stats.sold}</strong></div>
          <div className="kpi"><span>Nowe zapytania</span><strong>{leads.length}</strong></div>
        </section>

        <section className="adminGrid">
          <div className="adminCard adminTableCard">
            <div className="adminCardHead"><div><h2>Mieszkania</h2><p>Aktualna oferta inwestycji</p></div></div>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead><tr><th>Nr</th><th>Metraż</th><th>Pokoi</th><th>Piętro</th><th>Status</th><th>Cena</th><th>Cena/m²</th></tr></thead>
                <tbody>{apartments.slice(0, 20).map((a) => (
                  <tr key={a.id} onClick={() => setSelectedId(a.id)} className={selectedId === a.id ? "selectedRow" : ""}>
                    <td>{a.unitNumber}</td><td>{a.area} m²</td><td>{a.rooms}</td><td>{a.floor}</td>
                    <td><span className={`statusPill ${a.status}`}>{a.status === "available" ? "Dostępne" : a.status === "reserved" ? "Rezerwacja" : "Sprzedane"}</span></td>
                    <td>{formatPln(a.price)}</td><td>{formatPln(a.pricePerSqm)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <div className="adminCard editCard">
            <h2>Aktualizuj mieszkanie</h2>
            {selected ? (
              <form action={saveSelected}>
                <label>Mieszkanie<input value={`${selected.unitNumber} (${selected.area} m²)`} disabled /></label>
                <label>Status<select name="status" defaultValue={selected.status} key={`${selected.id}-status`}>
                  <option value="available">Dostępne</option><option value="reserved">Rezerwacja</option><option value="sold">Sprzedane</option>
                </select></label>
                <label>Cena brutto<input name="price" type="number" defaultValue={selected.price} key={`${selected.id}-price`} /></label>
                <label>Cena za m²<input value={selected.pricePerSqm} disabled /></label>
                <button className="button buttonGold full" disabled={saving}>{saving ? "Zapisywanie…" : "Zapisz zmiany"}</button>
              </form>
            ) : <p>Brak mieszkań.</p>}
          </div>
        </section>

        <section className="adminLowerGrid">
          <div className="adminCard">
            <h2>Historia cen</h2>
            <div className="fakeChart">
              {[35,52,46,66,58,72,68,82].map((h, i) => <span key={i} style={{height:`${h}%`}} />)}
            </div>
            <p className="muted">Każda zmiana ceny wykonana w panelu jest automatycznie zapisywana przez trigger w Supabase.</p>
          </div>
          <div className="adminCard">
            <h2>Najnowsze zapytania</h2>
            <div className="leadList">
              {leads.length ? leads.map((lead) => (
                <div key={lead.id}><div><strong>{lead.name}</strong><span>{lead.email}</span><span>{lead.phone}</span></div><strong>{formatPln(Number(lead.total_price || 0))}</strong></div>
              )) : <p className="muted">Leady pojawią się tutaj po wysłaniu formularza.</p>}
            </div>
          </div>
          <div className="adminCard constructionCard">
            <h2>Postęp budowy</h2>
            <div className="constructionVisual"><span>62%</span></div>
            <strong>Stan surowy zamknięty</strong>
            <p>Ostatnia aktualizacja: demo</p>
          </div>
        </section>
      </main>
    </div>
  );
}
