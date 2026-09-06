"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";
import type { Apartment, TourRoom } from "@/lib/types";

type Hotspot = {
  target: number;
  label: string;
  x: number;
  y: number;
  direction: "left" | "right" | "center";
};

function findRoomIndex(rooms: TourRoom[], keywords: string[]) {
  return rooms.findIndex((room) => {
    const value = `${room.id} ${room.name}`.toLowerCase();
    return keywords.some((keyword) => value.includes(keyword));
  });
}

function roomDescription(room: TourRoom | undefined) {
  if (!room) return "Poruszaj się pomiędzy pomieszczeniami, jak w prostym spacerze po nieruchomości.";

  const value = `${room.id} ${room.name}`.toLowerCase();

  if (value.includes("living") || value.includes("salon")) {
    return "Strefa dzienna z naturalnym światłem i otwartym przejściem do pozostałych części mieszkania.";
  }
  if (value.includes("bedroom") || value.includes("sypial")) {
    return "Prywatna część mieszkania — przejdź dalej lub wróć do strefy dziennej jednym kliknięciem.";
  }
  if (value.includes("bathroom") || value.includes("łaz") || value.includes("laz")) {
    return "Wizualizacja łazienki z możliwością szybkiego powrotu do sąsiednich pomieszczeń.";
  }

  return "Klikaj hotspoty i przechodź między pomieszczeniami bez opuszczania strony mieszkania.";
}

function buildHotspots(rooms: TourRoom[], roomIndex: number): Hotspot[] {
  const livingIndex = findRoomIndex(rooms, ["living", "salon"]);
  const bedroomIndex = findRoomIndex(rooms, ["bedroom", "sypial"]);
  const bathroomIndex = findRoomIndex(rooms, ["bathroom", "łaz", "laz"]);
  const current = rooms[roomIndex];
  const value = `${current?.id ?? ""} ${current?.name ?? ""}`.toLowerCase();

  const hotspots: Hotspot[] = [];

  if (value.includes("living") || value.includes("salon")) {
    if (bedroomIndex !== -1) {
      hotspots.push({
        target: bedroomIndex,
        label: "Przejdź do sypialni",
        x: 67,
        y: 58,
        direction: "right",
      });
    }
    if (bathroomIndex !== -1) {
      hotspots.push({
        target: bathroomIndex,
        label: "Przejdź do łazienki",
        x: 84,
        y: 54,
        direction: "right",
      });
    }
  } else if (value.includes("bedroom") || value.includes("sypial")) {
    if (livingIndex !== -1) {
      hotspots.push({
        target: livingIndex,
        label: "Wróć do salonu",
        x: 20,
        y: 58,
        direction: "left",
      });
    }
    if (bathroomIndex !== -1 && bathroomIndex !== roomIndex) {
      hotspots.push({
        target: bathroomIndex,
        label: "Przejdź do łazienki",
        x: 77,
        y: 55,
        direction: "right",
      });
    }
  } else if (value.includes("bathroom") || value.includes("łaz") || value.includes("laz")) {
    if (livingIndex !== -1) {
      hotspots.push({
        target: livingIndex,
        label: "Wróć do salonu",
        x: 23,
        y: 60,
        direction: "left",
      });
    }
    if (bedroomIndex !== -1) {
      hotspots.push({
        target: bedroomIndex,
        label: "Przejdź do sypialni",
        x: 74,
        y: 53,
        direction: "right",
      });
    }
  } else if (livingIndex !== -1) {
    hotspots.push({
      target: livingIndex,
      label: "Wróć do części dziennej",
      x: 50,
      y: 58,
      direction: "center",
    });
  }

  if (!hotspots.length && rooms.length > 1) {
    const next = (roomIndex + 1) % rooms.length;
    hotspots.push({
      target: next,
      label: `Przejdź do ${rooms[next].name.toLowerCase()}`,
      x: 72,
      y: 56,
      direction: "right",
    });
  }

  return hotspots;
}

export function ApartmentExperience({ apartment }: { apartment: Apartment }) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [pan, setPan] = useState(0);
  const [zoom, setZoom] = useState(1.08);
  const dragRef = useRef<{ x: number; pan: number } | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const room = apartment.tourRooms[roomIndex];
  const hotspots = useMemo(
    () => buildHotspots(apartment.tourRooms, roomIndex),
    [apartment.tourRooms, roomIndex]
  );

  function onTourDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, pan };
  }

  function onTourMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setPan(
      Math.max(
        -20,
        Math.min(20, dragRef.current.pan + (e.clientX - dragRef.current.x) * 0.04)
      )
    );
  }

  function changeRoom(next: number) {
    if (!apartment.tourRooms.length) return;
    const normalized = (next + apartment.tourRooms.length) % apartment.tourRooms.length;
    setRoomIndex(normalized);
    setPan(0);
    setZoom(1.08);
  }

  async function fullscreen() {
    await viewerRef.current?.requestFullscreen?.();
  }

  return (
    <section className="experience cardSoft streetExperience" ref={viewerRef}>
      <div className="streetExperienceTop">
        <div>
          <span className="eyebrow">INTERAKTYWNY SPACER</span>
          <h3>Przejdź przez mieszkanie krok po kroku</h3>
          <p>
            Klikaj punkty przejścia jak w uproszczonym spacerze po wnętrzu i
            przechodź między pomieszczeniami w jednym, płynnym widoku.
          </p>
        </div>
        <button className="experienceFullscreen" onClick={fullscreen} type="button">
          Pełny ekran ↗
        </button>
      </div>

      <div className="tourWrap tourWrapStreet">
        <div
          className="tourViewport immersiveTour streetTour"
          onPointerDown={onTourDown}
          onPointerMove={onTourMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          {room ? (
            <img
              key={room.id}
              src={room.image}
              alt={room.name}
              draggable={false}
              style={{ transform: `scale(${zoom}) translateX(${pan}%)` }}
            />
          ) : null}

          <div className="tourVignette" />
          <div className="streetTourGrid" />

          <div className="streetViewBadge">Spacer po mieszkaniu</div>
          <div className="tourDragNotice">przeciągnij, aby rozejrzeć się po wnętrzu</div>

          <div className="tourOverlay streetTourOverlay">
            <span>POKÓJ {roomIndex + 1} / {apartment.tourRooms.length}</span>
            <strong>{room?.name ?? "Mieszkanie"}</strong>
            <p>{roomDescription(room)}</p>
          </div>

          <div className="streetControls">
            <button type="button" onClick={() => setZoom((value) => Math.min(1.24, value + 0.04))}>＋</button>
            <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.04))}>－</button>
            <button type="button" onClick={() => { setPan(0); setZoom(1.08); }}>Reset</button>
          </div>

          {hotspots.map((hotspot) => (
            <button
              key={`${roomIndex}-${hotspot.target}-${hotspot.label}`}
              type="button"
              className={`walkHotspot ${hotspot.direction}`}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onClick={() => changeRoom(hotspot.target)}
              aria-label={hotspot.label}
              title={hotspot.label}
            >
              <span className="walkHotspotDot" />
              <b>{hotspot.label}</b>
            </button>
          ))}
        </div>

        <div className="streetBottomBar">
          <div className="tourMiniMap cardSoft">
            <span className="tourMiniMapLabel">Mapa przejścia</span>
            <div className="tourMiniMapTrack">
              {apartment.tourRooms.map((item, index) => (
                <div key={item.id} className={`tourMiniNode ${roomIndex === index ? "active" : ""}`}>
                  <button type="button" onClick={() => changeRoom(index)}>
                    <small>{index + 1}</small>
                    <strong>{item.name}</strong>
                  </button>
                  {index < apartment.tourRooms.length - 1 ? <span className="tourMiniLine" /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="roomRail streetRoomRail">
            {apartment.tourRooms.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => changeRoom(index)}
                className={roomIndex === index ? "active" : ""}
              >
                <img src={item.image} alt="" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
