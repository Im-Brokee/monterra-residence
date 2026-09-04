"use client";

import { useState } from "react";
import type { Apartment } from "@/lib/types";

export function ApartmentExperience({ apartment }: { apartment: Apartment }) {
  const [tab, setTab] = useState<"2d" | "3d" | "tour">("3d");
  const [rotation, setRotation] = useState(0);
  const [roomIndex, setRoomIndex] = useState(0);
  const room = apartment.tourRooms[roomIndex];

  return (
    <section className="experience cardSoft">
      <div className="experienceTabs">
        <button className={tab === "2d" ? "active" : ""} onClick={() => setTab("2d")}>Rzut 2D</button>
        <button className={tab === "3d" ? "active" : ""} onClick={() => setTab("3d")}>Widok 3D</button>
        <button className={tab === "tour" ? "active" : ""} onClick={() => setTab("tour")}>Spacer po mieszkaniu</button>
      </div>

      {tab === "2d" && (
        <div className="experienceCanvas lightCanvas">
          <img src={apartment.floorplanUrl} alt={`Rzut 2D ${apartment.unitNumber}`} />
          <div className="canvasHint">Kliknij Widok 3D, aby zobaczyć mieszkanie w przekroju.</div>
        </div>
      )}

      {tab === "3d" && (
        <div className="experienceCanvas darkCanvas">
          <div className="cutawayStage" style={{ transform: `perspective(1100px) rotateY(${rotation}deg)` }}>
            <img src={apartment.cutawayUrl} alt={`Widok 3D ${apartment.unitNumber}`} />
          </div>
          <div className="canvasControls">
            <button onClick={() => setRotation((r) => r - 12)}>↶ Obróć</button>
            <button onClick={() => setRotation((r) => r + 12)}>Obróć ↷</button>
            <button onClick={() => setRotation(0)}>Reset</button>
          </div>
        </div>
      )}

      {tab === "tour" && (
        <div className="tourWrap">
          <div className="tourViewport">
            {room ? <img src={room.image} alt={room.name} /> : null}
            <div className="tourOverlay">
              <span>WIRTUALNY SPACER</span>
              <strong>{room?.name ?? "Mieszkanie"}</strong>
              <p>W wersji produkcyjnej podmieniasz te grafiki na panoramy 360° lub renderowane sceny.</p>
            </div>
          </div>
          <div className="roomRail">
            {apartment.tourRooms.map((item, index) => (
              <button key={item.id} onClick={() => setRoomIndex(index)} className={roomIndex === index ? "active" : ""}>
                <img src={item.image} alt="" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
