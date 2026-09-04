"use client";

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
    <section className="buildingSelector cardSoft">
      <div className="buildingInfo">
        <span className="eyebrow">INTERAKTYWNY WYBÓR</span>
        <h2>Wybierz budynek i piętro</h2>
        <p>Kolory odpowiadają rzeczywistym statusom lokali z bazy. Kliknij piętro, potem konkretny lokal.</p>
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

      <div className="buildingVisual" aria-label="Wizualizacja budynku">
        <div className="buildingSky" />
        <div className="buildingBody dynamicBuildingBody">
          {floorValues.filter((f) => f > 0).map((item) => {
            const rows = floorStats(item);
            return (
              <button
                key={item}
                className={`buildingFloor ${floor === item ? "selected" : ""}`}
                onClick={() => setFloor(item)}
                title={`Piętro ${item}`}
              >
                {(rows.length ? rows : [null, null, null, null]).slice(0, 6).map((unit, index) => (
                  <span key={unit ? unit.id : index} className={`unit ${unit ? unit.status : "sold"}`} />
                ))}
              </button>
            );
          })}
          <button className={`buildingGround ${floor === 0 ? "selected" : ""}`} onClick={() => setFloor(0)}>PARTER</button>
        </div>
      </div>

      <div className="floorRail">
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
