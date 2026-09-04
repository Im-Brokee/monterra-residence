"use client";

import { useMemo, useState } from "react";
import type { Apartment, ApartmentStatus } from "@/lib/types";
import { ApartmentCard } from "@/components/ApartmentCard";

export function ApartmentCatalog({ apartments, initialFloor }: { apartments: Apartment[]; initialFloor?: number }) {
  const [rooms, setRooms] = useState("all");
  const [status, setStatus] = useState<ApartmentStatus | "all">("all");
  const [floor, setFloor] = useState(initialFloor ? String(initialFloor) : "all");
  const [minArea, setMinArea] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [feature, setFeature] = useState("all");
  const [sort, setSort] = useState("price-asc");

  const result = useMemo(() => {
    const filtered = apartments.filter((a) => {
      if (rooms !== "all" && a.rooms !== Number(rooms)) return false;
      if (status !== "all" && a.status !== status) return false;
      if (floor !== "all" && a.floor !== Number(floor)) return false;
      if (minArea && a.area < Number(minArea)) return false;
      if (maxPrice && a.price > Number(maxPrice)) return false;
      if (feature !== "all" && a.balconyType !== feature) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "area-asc") return a.area - b.area;
      if (sort === "area-desc") return b.area - a.area;
      return a.price - b.price;
    });
  }, [apartments, rooms, status, floor, minArea, maxPrice, feature, sort]);

  const reset = () => {
    setRooms("all"); setStatus("all"); setFloor("all"); setMinArea(""); setMaxPrice(""); setFeature("all"); setSort("price-asc");
  };

  return (
    <>
      <section className="filters cardSoft">
        <label>Pokoi
          <select value={rooms} onChange={(e) => setRooms(e.target.value)}>
            <option value="all">Wszystkie</option>
            {[1,2,3,4,5].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label>Min. metraż
          <input value={minArea} onChange={(e) => setMinArea(e.target.value)} inputMode="numeric" placeholder="np. 45" />
        </label>
        <label>Maks. cena
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder="np. 900000" />
        </label>
        <label>Piętro
          <select value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="all">Wszystkie</option>
            {[0,1,2,3,4,5,6].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label>Status
          <select value={status} onChange={(e) => setStatus(e.target.value as ApartmentStatus | "all")}>
            <option value="all">Wszystkie</option>
            <option value="available">Wolne</option>
            <option value="reserved">Rezerwacja</option>
            <option value="sold">Sprzedane</option>
          </select>
        </label>
        <label>Balkon / taras / ogród
          <select value={feature} onChange={(e) => setFeature(e.target.value)}>
            <option value="all">Wszystkie</option>
            <option value="balcony">Balkon</option>
            <option value="terrace">Taras</option>
            <option value="garden">Ogród</option>
          </select>
        </label>
        <label>Sortowanie
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="price-asc">Cena rosnąco</option>
            <option value="price-desc">Cena malejąco</option>
            <option value="area-asc">Metraż rosnąco</option>
            <option value="area-desc">Metraż malejąco</option>
          </select>
        </label>
        <button onClick={reset} className="button buttonGhost filterReset">Wyczyść</button>
      </section>

      <div className="resultBar">
        <span>Znaleziono: <strong>{result.length}</strong></span>
        <span className="muted">Kliknij lokal, aby zobaczyć 2D, 3D i spacer.</span>
      </div>

      <section className="apartmentGrid">
        {result.map((apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />)}
      </section>
      {!result.length && <div className="emptyState">Brak mieszkań spełniających wybrane kryteria.</div>}
    </>
  );
}
