"use client";

import { PointerEvent, useRef, useState } from "react";
import type { Apartment } from "@/lib/types";

export function ApartmentExperience({ apartment }: { apartment: Apartment }) {
  const [tab, setTab] = useState<"2d" | "3d" | "tour">("3d");
  const [rotation, setRotation] = useState(-8);
  const [zoom, setZoom] = useState(1);
  const [roomIndex, setRoomIndex] = useState(0);
  const [pan, setPan] = useState(0);
  const dragRef = useRef<{ x: number; rotation: number } | null>(null);
  const tourDragRef = useRef<{ x: number; pan: number } | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const room = apartment.tourRooms[roomIndex];

  function on3dDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, rotation };
  }

  function on3dMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setRotation(Math.max(-38, Math.min(38, dragRef.current.rotation + (e.clientX - dragRef.current.x) * 0.12)));
  }

  function onTourDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    tourDragRef.current = { x: e.clientX, pan };
  }

  function onTourMove(e: PointerEvent<HTMLDivElement>) {
    if (!tourDragRef.current) return;
    setPan(Math.max(-18, Math.min(18, tourDragRef.current.pan + (e.clientX - tourDragRef.current.x) * 0.035)));
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
    <section className="experience cardSoft" ref={viewerRef}>
      <div className="experienceTabs">
        <button className={tab === "2d" ? "active" : ""} onClick={() => setTab("2d")}>Rzut 2D</button>
        <button className={tab === "3d" ? "active" : ""} onClick={() => setTab("3d")}>Widok 3D</button>
        <button className={tab === "tour" ? "active" : ""} onClick={() => setTab("tour")}>Spacer po mieszkaniu</button>
        <button className="experienceFullscreen" onClick={fullscreen}>Pełny ekran ↗</button>
      </div>

      {tab === "2d" && (
        <div className="experienceCanvas lightCanvas">
          <img src={apartment.floorplanUrl} alt={`Rzut 2D ${apartment.unitNumber}`} />
          <div className="canvasBadge">RZUT TECHNICZNY · {apartment.area} m²</div>
          <div className="canvasHint">Przejdź do Widoku 3D, aby zobaczyć układ w przekroju.</div>
        </div>
      )}

      {tab === "3d" && (
        <div
          className="experienceCanvas darkCanvas interactive3d"
          onPointerDown={on3dDown}
          onPointerMove={on3dMove}
          onPointerUp={() => { dragRef.current = null; }}
          onPointerCancel={() => { dragRef.current = null; }}
        >
          <div className="cutawayStage" style={{ transform: `perspective(1200px) rotateX(2deg) rotateY(${rotation}deg) scale(${zoom})` }}>
            <img src={apartment.cutawayUrl} alt={`Widok 3D ${apartment.unitNumber}`} draggable={false} />
          </div>
          <div className="dragHint">← przeciągnij, aby obrócić →</div>
          <div className="canvasControls">
            <button onClick={() => setRotation((r) => Math.max(-38, r - 12))}>↶ Obróć</button>
            <button onClick={() => setRotation((r) => Math.min(38, r + 12))}>Obróć ↷</button>
            <button onClick={() => setZoom((z) => Math.min(1.35, z + 0.1))}>＋</button>
            <button onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}>−</button>
            <button onClick={() => { setRotation(-8); setZoom(1); }}>Reset</button>
          </div>
        </div>
      )}

      {tab === "tour" && (
        <div className="tourWrap">
          <div
            className="tourViewport immersiveTour"
            onPointerDown={onTourDown}
            onPointerMove={onTourMove}
            onPointerUp={() => { tourDragRef.current = null; }}
            onPointerCancel={() => { tourDragRef.current = null; }}
          >
            {room ? <img src={room.image} alt={room.name} draggable={false} style={{ transform: `scale(1.14) translateX(${pan}%)` }} /> : null}
            <div className="tourVignette" />
            <div className="tourOverlay">
              <span>WIRTUALNY SPACER</span>
              <strong>{room?.name ?? "Mieszkanie"}</strong>
              <p>Przeciągnij obraz, rozejrzyj się i przechodź między pomieszczeniami.</p>
            </div>
            {apartment.tourRooms.length > 1 && <>
              <button className="tourHotspot tourPrev" onClick={() => changeRoom(roomIndex - 1)} aria-label="Poprzednie pomieszczenie">‹</button>
              <button className="tourHotspot tourNext" onClick={() => changeRoom(roomIndex + 1)} aria-label="Następne pomieszczenie">›</button>
            </>}
          </div>
          <div className="roomRail">
            {apartment.tourRooms.map((item, index) => (
              <button key={item.id} onClick={() => changeRoom(index)} className={roomIndex === index ? "active" : ""}>
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
