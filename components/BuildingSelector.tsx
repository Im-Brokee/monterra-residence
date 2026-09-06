"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Apartment } from "@/lib/types";

export function BuildingSelector({ apartments }: { apartments: Apartment[] }) {
  const buildings = useMemo(
    () => Array.from(new Set(apartments.map((a) => a.building))).sort(),
    [apartments]
  );
  const [building, setBuilding] = useState(buildings[0] ?? "A");

  const floorValues = useMemo(() => {
    const vals = Array.from(
      new Set(
        apartments
          .filter((a) => a.building === building)
          .map((a) => a.floor)
      )
    ).sort((a, b) => b - a);

    return vals.length ? vals : [0];
  }, [apartments, building]);

  const [floor, setFloor] = useState(floorValues[0] ?? 0);

  useEffect(() => {
    if (!floorValues.includes(floor)) {
      setFloor(floorValues[0] ?? 0);
    }
  }, [floor, floorValues]);

  const units = apartments
    .filter((a) => a.building === building && a.floor === floor)
    .slice(0, 6);

  const floorStats = (f: number) =>
    apartments.filter((a) => a.building === building && a.floor === f);

  const selectedFloorIndex = Math.max(0, floorValues.indexOf(floor));

  function chooseBuilding(next: string) {
    setBuilding(next);
    const nextFloors = Array.from(
      new Set(
        apartments
          .filter((a) => a.building === next)
          .map((a) => a.floor)
      )
    ).sort((a, b) => b - a);
    setFloor(nextFloors[0] ?? 0);
  }

  function floorLabel(value: number) {
    return value === 0 ? "P" : String(value);
  }

  return (
    <section className="buildingSelector premiumBuildingSelector cardSoft">
      <div className="buildingInfo">
        <span className="eyebrow">INTERAKTYWNY WYBÓR</span>
        <h2>Wybierz budynek i piętro</h2>
        <p>
          Kliknij piętro po prawej stronie, a inwestycja zaznaczy aktywny poziom
          bezpośrednio na elewacji. Statusy lokali pobierane są z bazy Supabase.
        </p>

        <div className="buildingTabs">
          {buildings.map((item) => (
            <button
              key={item}
              className={`buildingTab ${building === item ? "active" : ""}`}
              onClick={() => chooseBuilding(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="statusLegend">
          <span>
            <i className="dot available" /> Wolne
          </span>
          <span>
            <i className="dot reserved" /> Rezerwacja
          </span>
          <span>
            <i className="dot sold" /> Sprzedane
          </span>
        </div>

        <div className="selectedFloorSummary">
          <strong>
            Budynek {building} · piętro {floorLabel(floor)}
          </strong>
          <span>{units.filter((u) => u.status === "available").length} wolnych lokali</span>
        </div>
      </div>

      <div
        className="buildingVisual realBuildingVisual"
        aria-label="Wizualizacja budynku Monterra Residence"
      >
        <Image
          src="/media/hero-building.webp"
          alt="Monterra Residence — wizualizacja inwestycji"
          fill
          sizes="(max-width: 760px) 100vw, 70vw"
          className="realBuildingImage"
        />
        <div className="buildingVisualGradient" />

        <div
          className="floorOverlayStack floorOverlayAnimated"
          style={{
            gridTemplateRows: `repeat(${floorValues.length}, minmax(0, 1fr))`,
          }}
        >
          <div
            className="facadeFloorGlow"
            style={{ gridRow: `${selectedFloorIndex + 1}` }}
            aria-hidden="true"
          >
            <div className="facadeFloorGlowFill" />
            <div className="facadeFloorGlowPulse" />
          </div>

          {floorValues.map((item) => {
            const rows = floorStats(item);
            const available = rows.filter((a) => a.status === "available").length;
            const reserved = rows.filter((a) => a.status === "reserved").length;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setFloor(item)}
                className={`facadeFloorButton ${floor === item ? "active" : ""}`}
                aria-label={`Piętro ${item}`}
              >
                <span className="facadeFloorNumber">{floorLabel(item)}</span>
                <span className="facadeFloorLine" />
                <span className="facadeFloorCount">
                  {available} wolne{reserved ? ` · ${reserved} rez.` : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="buildingVisualLabel">
          <span>MON TERRA RESIDENCE</span>
          <strong>Budynek {building}</strong>
          <small>Aktywne piętro {floorLabel(floor)}</small>
        </div>
      </div>

      <div className="floorRail premiumFloorRail">
        <span>Piętro</span>
        {floorValues.map((item) => {
          const rows = floorStats(item);
          const available = rows.filter((a) => a.status === "available").length;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFloor(item)}
              className={floor === item ? "active" : ""}
              title={`${available} wolnych`}
            >
              {floorLabel(item)}
              <small>{available}</small>
            </button>
          );
        })}
        <Link href={`/mieszkania?building=${building}&floor=${floor}`} className="floorLink">
          Zobacz wszystkie
        </Link>
      </div>

      <div className="buildingUnitsPanel">
        {units.length ? (
          units.map((unit) => (
            <Link
              key={unit.id}
              href={`/mieszkania/${unit.slug}`}
              className={`buildingUnitCard ${unit.status}`}
            >
              <strong>{unit.unitNumber}</strong>
              <span>
                {unit.area} m² · {unit.rooms} pok.
              </span>
              <i>
                {unit.status === "available"
                  ? "Wolne"
                  : unit.status === "reserved"
                    ? "Rezerwacja"
                    : "Sprzedane"}
              </i>
            </Link>
          ))
        ) : (
          <span className="muted">Brak lokali na tym piętrze.</span>
        )}
      </div>
    </section>
  );
}
