"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Apartment } from "@/lib/types";

export function BuildingSelector({ apartments }: { apartments: Apartment[] }) {
  const buildings = useMemo(() => Array.from(new Set(apartments.map((a) => a.building))).sort(), [apartments]);
  const [building, setBuilding] = useState(buildings[0] ?? "A");
  const floorValues = useMemo(() => {
    const vals = Array.from(new Set(apartments.filter((a) => a.building === building).map((a) => a.floor))).sort((a, b) => b - a);
    return vals.length ? vals : [0];
  }, [apartments, building]);
  const [floor, setFloor] = useState(floorValues[0] ?? 0);

  const units = apartments.filter((a) => a.building === building && a.floor === floor).slice(0, 6);
  const floorStats = (f: number) => apartments.filter((a) => a.building === building && a.floor === f);

  function chooseBuilding(next: string) {
    setBuilding(next);
    const nextFloors = Array.from(new Set(apartments.filter((a) => a.building === next).map((a) => a.floor))).sort((a, b) => b - a);
    setFloor(nextFloors[0] ?? 0);
  }

  return (
    <section className="buildingSelector premiumBuildingSelector cardSoft">
      <div className="buildingInfo">
        <span className="eyebrow">INTERAKTYWNY WYBÓR</span>
        <h2>Wybierz budynek i piętro</h2>
        <p>Wybierz piętro bezpośrednio na wizualizacji inwestycji. Statusy lokali pobierane są z bazy Supabase.</p>
        <div className="buildingTabs">
          {buildings.map((item) => (
            <button key={item} className={`buildingTab ${building === item ? "active" : ""}`} onClick={() => chooseBuilding(item)}>{item}</button>
          ))}
        </div>
        <div className="statusLegend">
          <span><i className="dot available" /> Wolne</span>
          <span><i className="dot reserved" /> Rezerwacja</span>
          <span><i className="dot sold" /> Sprzedane</span>
        </div>
        <div className="selectedFloorSummary">
          <strong>Budynek {building} · piętro {floor}</strong>
          <span>{units.filter((u) => u.status === "available").length} wolnych lokali</span>
        </div>
      </div>

      <div className="buildingVisual realBuildingVisual" aria-label="Wizualizacja budynku Monterra Residence">
        <Image
          src="/media/hero-building.webp"
          alt="Monterra Residence — wizualizacja inwestycji"
          fill
          sizes="(max-width: 760px) 100vw, 70vw"
          className="realBuildingImage"
        />
        <div className="buildingVisualGradient" />
        <div className="floorOverlayStack">
          {floorValues.map((item) => {
            const rows = floorStats(item);
            const available = rows.filter((a) => a.status === "available").length;
            const reserved = rows.filter((a) => a.status === "reserved").length;
            return (
              <button
                key={item}
                onClick={() => setFloor(item)}
                className={`facadeFloorButton ${floor === item ? "active" : ""}`}
                aria-label={`Piętro ${item}`}
              >
                <span className="facadeFloorNumber">{item === 0 ? "P" : item}</span>
                <span className="facadeFloorLine" />
                <span className="facadeFloorCount">{available} wolne{reserved ? ` · ${reserved} rez.` : ""}</span>
              </button>
            );
          })}
        </div>
        <div className="buildingVisualLabel">
          <span>MON TERRA RESIDENCE</span>
          <strong>Budynek {building}</strong>
        </div>
      </div>

      <div className="floorRail premiumFloorRail">
        <span>Piętro</span>
        {floorValues.map((item) => {
          const rows = floorStats(item);
          const available = rows.filter((a) => a.status === "available").length;
          return (
            <button key={item} onClick={() => setFloor(item)} className={floor === item ? "active" : ""} title={`${available} wolnych`}>
              {item}<small>{available}</small>
            </button>
          );
        })}
        <Link href={`/mieszkania?building=${building}&floor=${floor}`} className="floorLink">Zobacz wszystkie</Link>
      </div>

      <div className="buildingUnitsPanel">
        {units.length ? units.map((unit) => (
          <Link key={unit.id} href={`/mieszkania/${unit.slug}`} className={`buildingUnitCard ${unit.status}`}>
            <strong>{unit.unitNumber}</strong><span>{unit.area} m² · {unit.rooms} pok.</span><i>{unit.status === "available" ? "Wolne" : unit.status === "reserved" ? "Rezerwacja" : "Sprzedane"}</i>
          </Link>
        )) : <span className="muted">Brak lokali na tym piętrze.</span>}
      </div>
    </section>
  );
}
