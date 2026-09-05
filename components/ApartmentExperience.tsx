"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";
import type { Apartment } from "@/lib/types";
import { balconyLabel, formatArea } from "@/lib/format";

export function ApartmentExperience({ apartment }: { apartment: Apartment }) {
  const [tab, setTab] = useState<"2d" | "3d" | "tour">("3d");
  const [rotation, setRotation] = useState(-6);
  const [zoom, setZoom] = useState(1);
  const [roomIndex, setRoomIndex] = useState(0);
  const [pan, setPan] = useState(0);
  const dragRef = useRef<{ x: number; rotation: number } | null>(null);
  const tourDragRef = useRef<{ x: number; pan: number } | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const room = apartment.tourRooms[roomIndex];

  const insights = useMemo(
    () => [
      { label: "Układ", value: `${apartment.rooms} ${apartment.rooms === 1 ? "pokój" : apartment.rooms < 5 ? "pokoje" : "pokoi"}` },
      { label: balconyLabel[apartment.balconyType], value: apartment.balconyArea ? formatArea(apartment.balconyArea) : "—" },
      { label: "Ekspozycja", value: apartment.exposure },
      { label: "Wysokość", value: `${apartment.ceilingHeight.toFixed(2)} m` }
    ],
    [apartment]
  );

  function on3dDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, rotation };
  }

  function on3dMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setRotation(Math.max(-32, Math.min(32, dragRef.current.rotation + (e.clientX - dragRef.current.x) * 0.1)));
  }

  function onTourDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    tourDragRef.current = { x: e.clientX, pan };
  }

  function onTourMove(e: PointerEvent<HTMLDivElement>) {
    if (!tourDragRef.current) return;
    setPan(Math.max(-16, Math.min(16, tourDragRef.current.pan + (e.clientX - tourDragRef.current.x) * 0.03)));
  }

  function changeRoom(next: number) {
    if (!apartment.tourRooms.length) return;
    const normalized = (next + apartment.tourRooms.length) % apartment.tourRooms.length;
    setRoomIndex(normalized);
    setPan(0);
  }

  async function fullscreen() {
    await viewerRef.current?.requestFullscreen?.();
  }

  return (
    <section className="experience cardSoft premiumExperienceCard" ref={viewerRef}>
      <div className="experienceTabs premiumTabs">
        <button className={tab === "2d" ? "active" : ""} onClick={() => setTab("2d")}>Rzut 2D</button>
        <button className={tab === "3d" ? "active" : ""} onClick={() => setTab("3d")}>Widok 3D</button>
        <button className={tab === "tour" ? "active" : ""} onClick={() => setTab("tour")}>Spacer</button>
        <button className="experienceFullscreen" onClick={fullscreen}>Pełny ekran ↗</button>
      </div>

      <div className="experienceTopline">
        <div>
          <span>Prezentacja lokalu</span>
          <strong>{apartment.unitNumber} · {formatArea(apartment.area)}</strong>
        </div>
        <div className="experienceMiniLegend">
          <i className="legendDay" /> strefa dzienna
          <i className="legendPrivate" /> strefa prywatna
          <i className="legendBath" /> łazienka / komunikacja
        </div>
      </div>

      {tab === "2d" && (
        <div className="experienceCanvas lightCanvas premiumCanvas">
          <img src={apartment.floorplanUrl} alt={`Rzut 2D ${apartment.unitNumber}`} />
          <div className="canvasBadge">PLAN SPRZEDAŻOWY · {apartment.styleName}</div>
          <div className="canvasHint">Każdy lokal ma własny plan 2D przygotowany pod sprzedaż i konfigurację.</div>
        </div>
      )}

      {tab === "3d" && (
        <div
          className="experienceCanvas darkCanvas interactive3d premiumCanvas"
          onPointerDown={on3dDown}
          onPointerMove={on3dMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          <div className="cutawayStage premiumCutawayStage" style={{ transform: `perspective(1200px) rotateX(1deg) rotateY(${rotation}deg) scale(${zoom})` }}>
            <img src={apartment.cutawayUrl} alt={`Widok 3D ${apartment.unitNumber}`} draggable={false} />
          </div>
          <div className="dragHint">← przeciągnij, aby obrócić model →</div>
          <div className="canvasControls premiumControls">
            <button onClick={() => setRotation((r) => Math.max(-32, r - 10))}>↶ Obróć</button>
            <button onClick={() => setRotation((r) => Math.min(32, r + 10))}>Obróć ↷</button>
            <button onClick={() => setZoom((z) => Math.min(1.32, z + 0.08))}>＋</button>
            <button onClick={() => setZoom((z) => Math.max(0.82, z - 0.08))}>−</button>
            <button onClick={() => { setRotation(-6); setZoom(1); }}>Reset</button>
          </div>
        </div>
      )}

      {tab === "tour" && (
        <div className="tourWrap">
          <div
            className="tourViewport immersiveTour premiumTour"
            onPointerDown={onTourDown}
            onPointerMove={onTourMove}
            onPointerUp={() => {
              tourDragRef.current = null;
            }}
            onPointerCancel={() => {
              tourDragRef.current = null;
            }}
          >
            {room ? <img src={room.image} alt={room.name} draggable={false} style={{ transform: `scale(1.14) translateX(${pan}%)` }} /> : null}
            <div className="tourVignette" />
            <div className="tourOverlay">
              <span>WIRTUALNY SPACER</span>
              <strong>{room?.name ?? "Mieszkanie"}</strong>
              <p>Przechodź pomiędzy pomieszczeniami i zobacz klimat wnętrza zanim umówisz spotkanie.</p>
            </div>
            {apartment.tourRooms.length > 1 && (
              <>
                <button className="tourHotspot tourPrev" onClick={() => changeRoom(roomIndex - 1)} aria-label="Poprzednie pomieszczenie">‹</button>
                <button className="tourHotspot tourNext" onClick={() => changeRoom(roomIndex + 1)} aria-label="Następne pomieszczenie">›</button>
              </>
            )}
          </div>
          <div className="roomRail premiumRoomRail">
            {apartment.tourRooms.map((item, index) => (
              <button key={item.id} onClick={() => changeRoom(index)} className={roomIndex === index ? "active" : ""}>
                <img src={item.image} alt="" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="experienceInsights">
        {insights.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
