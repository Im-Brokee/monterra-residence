"use client";

import { useState } from "react";
import Link from "next/link";

export function BuildingSelector() {
  const [floor, setFloor] = useState(4);
  const floors = [6, 5, 4, 3, 2, 1, 0];

  return (
    <section className="buildingSelector cardSoft">
      <div className="buildingInfo">
        <span className="eyebrow">INTERAKTYWNY WYBÓR</span>
        <h2>Wybierz budynek i piętro</h2>
        <p>Kliknij piętro, aby od razu przejść do mieszkań dostępnych na wybranym poziomie.</p>
        <div className="buildingTabs">
          <button className="buildingTab active">A</button>
          <button className="buildingTab">B</button>
        </div>
        <div className="statusLegend">
          <span><i className="dot available" /> Wolne</span>
          <span><i className="dot reserved" /> Rezerwacja</span>
          <span><i className="dot sold" /> Sprzedane</span>
        </div>
      </div>

      <div className="buildingVisual" aria-label="Wizualizacja budynku">
        <div className="buildingSky" />
        <div className="buildingBody">
          {floors.slice(0, -1).map((item) => (
            <button
              key={item}
              className={`buildingFloor ${floor === item ? "selected" : ""}`}
              onClick={() => setFloor(item)}
              title={`Piętro ${item}`}
            >
              <span className="unit unitA" />
              <span className="unit unitB" />
              <span className="unit unitC" />
              <span className="unit unitD" />
            </button>
          ))}
          <div className="buildingGround">LOBBY · USŁUGI</div>
        </div>
      </div>

      <div className="floorRail">
        <span>Piętro</span>
        {floors.map((item) => (
          <button key={item} onClick={() => setFloor(item)} className={floor === item ? "active" : ""}>
            {item}
          </button>
        ))}
        <Link href={`/mieszkania?floor=${floor}`} className="floorLink">Zobacz</Link>
      </div>
    </section>
  );
}
