"use client";

import { useMemo, useState } from "react";
import type { Apartment, ApartmentStatus } from "@/lib/types";
import { ApartmentCard } from "@/components/ApartmentCard";
import { formatPln } from "@/lib/format";
import Link from "next/link";

export function ApartmentCatalog({ apartments, initialFloor, initialBuilding }: { apartments: Apartment[]; initialFloor?: number; initialBuilding?: string }) {
  const [rooms, setRooms] = useState("all");
  const [status, setStatus] = useState<ApartmentStatus | "all">("all");
  const [building, setBuilding] = useState(initialBuilding ?? "all");
  const [floor, setFloor] = useState(initialFloor !== undefined ? String(initialFloor) : "all");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [feature, setFeature] = useState("all");
  const [sort, setSort] = useState("price-asc");
  const [view, setView] = useState<"cards" | "list" | "plans">("cards");

  const buildings = Array.from(new Set(apartments.map((a) => a.building))).sort();
  const floors = Array.from(new Set(apartments.map((a) => a.floor))).sort((a, b) => a - b);

  const result = useMemo(() => {
    const filtered = apartments.filter((a) => {
      if (rooms !== "all" && a.rooms !== Number(rooms)) return false;
      if (status !== "all" && a.status !== status) return false;
      if (building !== "all" && a.building !== building) return false;
      if (floor !== "all" && a.floor !== Number(floor)) return false;
      if (minArea && a.area < Number(minArea)) return false;
      if (maxArea && a.area > Number(maxArea)) return false;
      if (minPrice && a.price < Number(minPrice)) return false;
      if (maxPrice && a.price > Number(maxPrice)) return false;
      if (feature !== "all" && a.balconyType !== feature) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "area-asc") return a.area - b.area;
      if (sort === "area-desc") return b.area - a.area;
      if (sort === "floor-asc") return a.floor - b.floor;
      return a.price - b.price;
    });
  }, [apartments, rooms, status, building, floor, minArea, maxArea, minPrice, maxPrice, feature, sort]);

  const reset = () => {
    setRooms("all"); setStatus("all"); setBuilding("all"); setFloor("all");
    setMinArea(""); setMaxArea(""); setMinPrice(""); setMaxPrice(""); setFeature("all"); setSort("price-asc");
  };

  return (
    <>
      <section className="filters cardSoft expandedFilters">
        <label>Pokoi<select value={rooms} onChange={(e) => setRooms(e.target.value)}><option value="all">Wszystkie</option>{[1,2,3,4,5].map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        <label>Budynek<select value={building} onChange={(e) => setBuilding(e.target.value)}><option value="all">Wszystkie</option>{buildings.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        <label>Piętro<select value={floor} onChange={(e) => setFloor(e.target.value)}><option value="all">Wszystkie</option>{floors.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value as ApartmentStatus | "all")}><option value="all">Wszystkie</option><option value="available">Wolne</option><option value="reserved">Rezerwacja</option><option value="sold">Sprzedane</option></select></label>
        <label>Min. metraż<input value={minArea} onChange={(e) => setMinArea(e.target.value)} inputMode="numeric" placeholder="35" /></label>
        <label>Maks. metraż<input value={maxArea} onChange={(e) => setMaxArea(e.target.value)} inputMode="numeric" placeholder="90" /></label>
        <label>Cena od<input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} inputMode="numeric" placeholder="500000" /></label>
        <label>Cena do<input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder="1200000" /></label>
        <label>Balkon / taras / ogród<select value={feature} onChange={(e) => setFeature(e.target.value)}><option value="all">Wszystkie</option><option value="balcony">Balkon</option><option value="terrace">Taras</option><option value="garden">Ogród</option></select></label>
        <label>Sortowanie<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="price-asc">Cena rosnąco</option><option value="price-desc">Cena malejąco</option><option value="area-asc">Metraż rosnąco</option><option value="area-desc">Metraż malejąco</option><option value="floor-asc">Piętro</option></select></label>
        <button onClick={reset} className="button buttonGhost filterReset">Wyczyść filtry</button>
      </section>

      <div className="resultBar catalogToolbar">
        <span>Znaleziono: <strong>{result.length}</strong></span>
        <div className="viewSwitch">
          <button onClick={() => setView("cards")} className={view === "cards" ? "active" : ""}>Karty</button>
          <button onClick={() => setView("list")} className={view === "list" ? "active" : ""}>Lista</button>
          <button onClick={() => setView("plans")} className={view === "plans" ? "active" : ""}>Rzuty 2D</button>
        </div>
      </div>

      {view === "cards" && <section className="apartmentGrid">{result.map((apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />)}</section>}

      {view === "plans" && <section className="planCatalogGrid">{result.map((a) => (
        <Link key={a.id} href={`/mieszkania/${a.slug}`} className="planCatalogCard cardSoft"><img src={a.floorplanUrl} alt={`Rzut ${a.unitNumber}`} /><div><strong>{a.unitNumber}</strong><span>{a.area} m² · {a.rooms} pok. · piętro {a.floor}</span><b>{formatPln(a.price)}</b></div></Link>
      ))}</section>}

      {view === "list" && <div className="catalogTableWrap cardSoft"><table className="catalogTable"><thead><tr><th>Lokal</th><th>Metraż</th><th>Pokoi</th><th>Piętro</th><th>Atut</th><th>Status</th><th>Cena</th><th></th></tr></thead><tbody>{result.map((a) => (
        <tr key={a.id}><td><strong>{a.unitNumber}</strong></td><td>{a.area} m²</td><td>{a.rooms}</td><td>{a.floor}</td><td>{a.balconyType === "garden" ? "Ogród" : a.balconyType === "terrace" ? "Taras" : a.balconyType === "balcony" ? "Balkon" : "—"}</td><td><span className={`statusPill ${a.status}`}>{a.status === "available" ? "Wolne" : a.status === "reserved" ? "Rezerwacja" : "Sprzedane"}</span></td><td>{formatPln(a.price)}</td><td><Link href={`/mieszkania/${a.slug}`} className="tableLink">Zobacz →</Link></td></tr>
      ))}</tbody></table></div>}

      {!result.length && <div className="emptyState">Brak mieszkań spełniających wybrane kryteria.</div>}
    </>
  );
}
