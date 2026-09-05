const fs = require('fs');
const path = require('path');

const floorplansDir = path.join(process.cwd(), 'public/demo/floorplans');
const cutawaysDir = path.join(process.cwd(), 'public/demo/cutaways');
fs.mkdirSync(floorplansDir, { recursive: true });
fs.mkdirSync(cutawaysDir, { recursive: true });

const defs = [
  {
    code: 'studio-27',
    title: 'Studio Urban', area: 27, rooms: 1, outdoor: { label: 'OGRÓD / TARAS', area: 12.5 },
    size: { w: 520, h: 350 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 17.4, x: 0, y: 0, w: 320, h: 350, type: 'day', furnish: 'studio' },
      { name: 'HOL', area: 5.5, x: 320, y: 0, w: 200, h: 140, type: 'hall', furnish: 'hall' },
      { name: 'ŁAZIENKA', area: 4.1, x: 320, y: 140, w: 200, h: 210, type: 'bath', furnish: 'bath' }
    ]
  },
  {
    code: 'compact-34',
    title: 'Soft Minimal', area: 34, rooms: 2, outdoor: { label: 'BALKON', area: 6.8 },
    size: { w: 560, h: 360 },
    roomsDef: [
      { name: 'SALON + ANEKS', area: 16.5, x: 0, y: 0, w: 300, h: 220, type: 'day', furnish: 'living' },
      { name: 'SYPIALNIA', area: 9.8, x: 300, y: 0, w: 260, h: 170, type: 'private', furnish: 'bedroom' },
      { name: 'ŁAZIENKA', area: 4.3, x: 300, y: 170, w: 130, h: 120, type: 'bath', furnish: 'bath' },
      { name: 'HOL', area: 3.4, x: 430, y: 170, w: 130, h: 120, type: 'hall', furnish: 'hall' },
      { name: 'PRACA / SZAFA', area: 3.0, x: 0, y: 220, w: 300, h: 140, type: 'private', furnish: 'office' }
    ]
  },
  {
    code: 'city-42',
    title: 'Scandinavian', area: 42, rooms: 2, outdoor: { label: 'BALKON', area: 7.2 },
    size: { w: 580, h: 370 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 20.6, x: 0, y: 0, w: 340, h: 240, type: 'day', furnish: 'living' },
      { name: 'SYPIALNIA', area: 11.2, x: 340, y: 0, w: 240, h: 190, type: 'private', furnish: 'bedroom' },
      { name: 'ŁAZIENKA', area: 4.4, x: 340, y: 190, w: 130, h: 180, type: 'bath', furnish: 'bath' },
      { name: 'HOL', area: 5.8, x: 470, y: 190, w: 110, h: 180, type: 'hall', furnish: 'hall' }
    ]
  },
  {
    code: 'family-51',
    title: 'Warm Modern', area: 51, rooms: 3, outdoor: { label: 'BALKON', area: 8.1 },
    size: { w: 620, h: 390 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 22.8, x: 0, y: 0, w: 330, h: 240, type: 'day', furnish: 'living' },
      { name: 'SYPIALNIA', area: 10.4, x: 330, y: 0, w: 180, h: 170, type: 'private', furnish: 'bedroom' },
      { name: 'POKÓJ', area: 8.9, x: 510, y: 0, w: 110, h: 170, type: 'private', furnish: 'office' },
      { name: 'ŁAZIENKA', area: 4.5, x: 330, y: 170, w: 140, h: 120, type: 'bath', furnish: 'bath' },
      { name: 'HOL', area: 4.4, x: 470, y: 170, w: 150, h: 120, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 5.0, x: 0, y: 240, w: 330, h: 150, type: 'day', furnish: 'dining' }
    ]
  },
  {
    code: 'family-58',
    title: 'Natural Beige', area: 58, rooms: 3, outdoor: { label: 'BALKON', area: 9.3 },
    size: { w: 640, h: 400 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 25.4, x: 0, y: 0, w: 360, h: 240, type: 'day', furnish: 'living' },
      { name: 'MASTER', area: 12.1, x: 360, y: 0, w: 170, h: 180, type: 'private', furnish: 'bedroom' },
      { name: 'POKÓJ', area: 9.1, x: 530, y: 0, w: 110, h: 180, type: 'private', furnish: 'office' },
      { name: 'ŁAZIENKA', area: 5.2, x: 360, y: 180, w: 150, h: 120, type: 'bath', furnish: 'bath' },
      { name: 'HOL', area: 6.2, x: 510, y: 180, w: 130, h: 120, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 6.0, x: 0, y: 240, w: 360, h: 160, type: 'day', furnish: 'dining' }
    ]
  },
  {
    code: 'premium-67',
    title: 'Premium Light', area: 67, rooms: 3, outdoor: { label: 'TARAS', area: 15.6 },
    size: { w: 690, h: 410 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 28.6, x: 0, y: 0, w: 370, h: 250, type: 'day', furnish: 'living' },
      { name: 'MASTER', area: 13.2, x: 370, y: 0, w: 170, h: 180, type: 'private', furnish: 'bedroom' },
      { name: 'GABINET', area: 10.5, x: 540, y: 0, w: 150, h: 180, type: 'private', furnish: 'office' },
      { name: 'ŁAZIENKA', area: 5.8, x: 370, y: 180, w: 160, h: 120, type: 'bath', furnish: 'bath' },
      { name: 'WC', area: 2.1, x: 530, y: 180, w: 70, h: 120, type: 'bath', furnish: 'wc' },
      { name: 'HOL', area: 6.8, x: 600, y: 180, w: 90, h: 120, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 7.0, x: 0, y: 250, w: 370, h: 160, type: 'day', furnish: 'dining' }
    ]
  },
  {
    code: 'family-76',
    title: 'Family Cozy', area: 76, rooms: 4, outdoor: { label: 'BALKON / TARAS', area: 16.9 },
    size: { w: 740, h: 430 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 31.9, x: 0, y: 0, w: 410, h: 250, type: 'day', furnish: 'living' },
      { name: 'SYPIALNIA', area: 12.0, x: 410, y: 0, w: 180, h: 170, type: 'private', furnish: 'bedroom' },
      { name: 'POKÓJ', area: 9.2, x: 590, y: 0, w: 150, h: 170, type: 'private', furnish: 'office' },
      { name: 'ŁAZIENKA', area: 5.1, x: 410, y: 170, w: 180, h: 140, type: 'bath', furnish: 'bath' },
      { name: 'POKÓJ', area: 8.1, x: 590, y: 170, w: 150, h: 140, type: 'private', furnish: 'bedroom' },
      { name: 'HOL', area: 5.4, x: 410, y: 310, w: 330, h: 120, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 7.4, x: 0, y: 250, w: 410, h: 180, type: 'day', furnish: 'dining' }
    ]
  },
  {
    code: 'premium-88',
    title: 'Elegant Stone', area: 88, rooms: 4, outdoor: { label: 'TARAS', area: 20.1 },
    size: { w: 790, h: 450 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 34.2, x: 0, y: 0, w: 430, h: 260, type: 'day', furnish: 'living' },
      { name: 'MASTER', area: 14.1, x: 430, y: 0, w: 180, h: 180, type: 'private', furnish: 'bedroom' },
      { name: 'POKÓJ', area: 10.4, x: 610, y: 0, w: 180, h: 180, type: 'private', furnish: 'office' },
      { name: 'ŁAZIENKA', area: 6.3, x: 430, y: 180, w: 180, h: 140, type: 'bath', furnish: 'bath' },
      { name: 'POKÓJ', area: 9.5, x: 610, y: 180, w: 180, h: 140, type: 'private', furnish: 'bedroom' },
      { name: 'HOL', area: 6.5, x: 430, y: 320, w: 360, h: 130, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 7.0, x: 0, y: 260, w: 430, h: 190, type: 'day', furnish: 'dining' }
    ]
  },
  {
    code: 'apartment-102',
    title: 'Luxury Dark', area: 102, rooms: 4, outdoor: { label: 'TARAS', area: 25.8 },
    size: { w: 840, h: 470 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 39.8, x: 0, y: 0, w: 470, h: 270, type: 'day', furnish: 'living' },
      { name: 'MASTER', area: 16.2, x: 470, y: 0, w: 190, h: 190, type: 'private', furnish: 'bedroom' },
      { name: 'POKÓJ', area: 11.3, x: 660, y: 0, w: 180, h: 190, type: 'private', furnish: 'office' },
      { name: 'ŁAZIENKA', area: 7.0, x: 470, y: 190, w: 190, h: 140, type: 'bath', furnish: 'bath' },
      { name: 'POKÓJ', area: 10.1, x: 660, y: 190, w: 180, h: 140, type: 'private', furnish: 'bedroom' },
      { name: 'WC / PRALNIA', area: 3.1, x: 470, y: 330, w: 160, h: 140, type: 'bath', furnish: 'wc' },
      { name: 'HOL', area: 7.5, x: 630, y: 330, w: 210, h: 140, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 8.0, x: 0, y: 270, w: 470, h: 200, type: 'day', furnish: 'dining' }
    ]
  },
  {
    code: 'penthouse-121',
    title: 'Penthouse Signature', area: 121, rooms: 5, outdoor: { label: 'TARAS PANORAMICZNY', area: 38.7 },
    size: { w: 920, h: 520 },
    roomsDef: [
      { name: 'SALON + KUCHNIA', area: 42.6, x: 0, y: 0, w: 470, h: 300, type: 'day', furnish: 'living' },
      { name: 'MASTER', area: 18.2, x: 470, y: 0, w: 190, h: 190, type: 'private', furnish: 'bedroom' },
      { name: 'POKÓJ', area: 12.2, x: 660, y: 0, w: 130, h: 190, type: 'private', furnish: 'office' },
      { name: 'POKÓJ', area: 11.1, x: 790, y: 0, w: 130, h: 190, type: 'private', furnish: 'bedroom' },
      { name: 'ŁAZIENKA', area: 8.4, x: 470, y: 190, w: 190, h: 160, type: 'bath', furnish: 'bath' },
      { name: 'POKÓJ', area: 10.0, x: 660, y: 190, w: 130, h: 160, type: 'private', furnish: 'bedroom' },
      { name: 'WC', area: 2.2, x: 790, y: 190, w: 130, h: 80, type: 'bath', furnish: 'wc' },
      { name: 'HOL', area: 7.3, x: 790, y: 270, w: 130, h: 80, type: 'hall', furnish: 'hall' },
      { name: 'JADALNIA', area: 9.0, x: 0, y: 300, w: 470, h: 220, type: 'day', furnish: 'dining' },
      { name: 'GARDEROBA', area: 4.4, x: 470, y: 350, w: 450, h: 170, type: 'hall', furnish: 'hall' }
    ]
  }
];

const palette = {
  day: { fill: '#f7f3eb', accent: '#d7cebf', top: '#dfe7dc', left: '#b9beb6', right: '#9fa59c' },
  private: { fill: '#f1ede5', accent: '#dfd5c7', top: '#e3ded0', left: '#b8b1a7', right: '#9e978e' },
  bath: { fill: '#edf3ef', accent: '#ced9d3', top: '#d3e0db', left: '#aeb9b4', right: '#95a09b' },
  hall: { fill: '#f5f0e8', accent: '#ddd5ca', top: '#d8d2c8', left: '#b1aca4', right: '#9b968f' }
};

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function roomFurniture(room) {
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2;
  const f = [];
  if (room.furnish === 'living' || room.furnish === 'studio') {
    f.push(`<rect x="${room.x + 28}" y="${room.y + room.h - 110}" width="${Math.min(130, room.w - 60)}" height="72" rx="22" fill="#d8cebf"/>`);
    f.push(`<rect x="${room.x + 180}" y="${room.y + room.h - 85}" width="${Math.min(88, room.w - 210)}" height="52" rx="12" fill="#e8dfd0"/>`);
    f.push(`<circle cx="${Math.min(room.x + room.w - 72, cx + 60)}" cy="${room.y + 88}" r="38" fill="#ebe2d3"/>`);
    f.push(`<rect x="${room.x + room.w - 132}" y="${room.y + 26}" width="104" height="24" rx="10" fill="#cbd7cd"/>`);
  }
  if (room.furnish === 'dining') {
    f.push(`<rect x="${cx - 80}" y="${cy - 28}" width="160" height="56" rx="16" fill="#d8cebf"/>`);
    f.push(`<circle cx="${cx - 96}" cy="${cy - 30}" r="12" fill="#e7ded1"/><circle cx="${cx + 96}" cy="${cy - 30}" r="12" fill="#e7ded1"/><circle cx="${cx - 96}" cy="${cy + 30}" r="12" fill="#e7ded1"/><circle cx="${cx + 96}" cy="${cy + 30}" r="12" fill="#e7ded1"/>`);
  }
  if (room.furnish === 'bedroom') {
    f.push(`<rect x="${room.x + 32}" y="${room.y + 38}" width="${Math.min(room.w - 64, 116)}" height="${Math.min(room.h - 84, 78)}" rx="12" fill="#ddd5ca"/>`);
    f.push(`<rect x="${room.x + 32}" y="${room.y + 38}" width="${Math.min(room.w - 64, 116)}" height="20" rx="10" fill="#c6bbb0"/>`);
  }
  if (room.furnish === 'office') {
    f.push(`<rect x="${room.x + 36}" y="${room.y + room.h - 96}" width="${Math.min(room.w - 72, 98)}" height="58" rx="10" fill="#d4cabd"/>`);
    f.push(`<rect x="${room.x + room.w - 58}" y="${room.y + 38}" width="24" height="84" rx="10" fill="#d8d1c8"/>`);
  }
  if (room.furnish === 'bath') {
    f.push(`<rect x="${cx - 44}" y="${room.y + room.h - 70}" width="88" height="40" rx="16" fill="#cdd8d4"/>`);
    f.push(`<rect x="${room.x + room.w - 70}" y="${room.y + 26}" width="28" height="84" rx="12" fill="#e0e7e5" stroke="#99a9a4" stroke-width="2"/>`);
  }
  if (room.furnish === 'wc') {
    f.push(`<rect x="${cx - 32}" y="${cy - 22}" width="64" height="44" rx="16" fill="#d7e2de"/>`);
  }
  if (room.furnish === 'hall') {
    f.push(`<rect x="${room.x + 28}" y="${room.y + 30}" width="${Math.min(room.w - 56, 124)}" height="20" rx="10" fill="#ddd5ca"/>`);
    f.push(`<rect x="${room.x + 28}" y="${room.y + 62}" width="${Math.min(room.w - 56, 124)}" height="20" rx="10" fill="#e7ded1"/>`);
  }
  return f.join('\n');
}

function centeredText(text, x, y, size, weight='700', color='#2f2a24') {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(text)}</text>`;
}

function renderFloorplan(def) {
  const { w, h } = def.size;
  const vbW = 1280;
  const vbH = 900;
  const planX = 120;
  const planY = 190;
  const scale = Math.min(920 / w, 500 / h);
  const planW = w * scale;
  const planH = h * scale;
  const outX = planX;
  const outY = 126;
  const outW = planW;
  const outH = 58;

  const roomSvg = def.roomsDef.map((room) => {
    const p = palette[room.type];
    const x = planX + room.x * scale;
    const y = planY + room.y * scale;
    const rw = room.w * scale;
    const rh = room.h * scale;
    const labelY = y + rh / 2 - 4;
    const areaY = labelY + 34;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${p.fill}" stroke="#23201c" stroke-width="6"/>
        ${roomFurniture({ ...room, x, y, w: rw, h: rh })}
        ${centeredText(room.name, x + rw / 2, labelY, Math.max(16, Math.min(28, rw / 11)), '700')}
        ${centeredText(`${room.area} m²`, x + rw / 2, areaY, 18, '400', '#6f675c')}
      </g>`;
  }).join('\n');

  const footerLegend = [
    ['#8aa070', 'strefa dzienna'],
    ['#c9b287', 'strefa prywatna'],
    ['#b4c5be', 'łazienka / komunikacja']
  ].map((item, i) => `
    <g transform="translate(${92 + i * 196} 782)">
      <rect width="170" height="32" rx="16" fill="#1f1f1d"/>
      <circle cx="18" cy="16" r="5" fill="${item[0]}"/>
      <text x="32" y="21" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#f2ede4">${esc(item[1])}</text>
    </g>
  `).join('\n');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}">
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#b59b74" flood-opacity="0.14"/></filter>
    <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fbf8f1"/><stop offset="1" stop-color="#efe8dc"/></linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#paper)"/>
  <g filter="url(#softShadow)">
    <rect x="42" y="42" width="1196" height="816" rx="28" fill="#fffdfa" stroke="#d9cfbe" stroke-width="2"/>
    <text x="84" y="96" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#70552f">${esc(def.title)}</text>
    <text x="84" y="128" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="2" fill="#9c835f">PROFESJONALNY RZUT 2D · ${def.area} m² · ${def.rooms} ${def.rooms === 1 ? 'pokój' : def.rooms < 5 ? 'pokoje' : 'pokoi'}</text>

    <g transform="translate(1048 74)">
      <circle cx="34" cy="34" r="34" fill="#f6efe2" stroke="#d9cfbe"/>
      <path d="M34 12 L40 32 L34 28 L28 32 Z" fill="#29251f"/>
      <text x="34" y="61" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#7b6a56">N</text>
    </g>

    <rect x="${outX}" y="${outY}" width="${outW}" height="${outH}" rx="18" fill="#e8eee5" stroke="#a8b39f" stroke-width="2"/>
    ${centeredText(`${def.outdoor.label} · ${def.outdoor.area} m²`, outX + outW / 2, outY + 37, 24, '500', '#536153')}

    ${roomSvg}

    <line x1="${planX}" y1="720" x2="${planX + planW}" y2="720" stroke="#a89579" stroke-width="2" stroke-dasharray="6 6"/>
    <line x1="${planX}" y1="714" x2="${planX}" y2="726" stroke="#a89579" stroke-width="2"/>
    <line x1="${planX + planW}" y1="714" x2="${planX + planW}" y2="726" stroke="#a89579" stroke-width="2"/>
    <text x="${planX + planW / 2}" y="712" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#8e7552">elewacja frontowa</text>

    <line x1="1110" y1="${planY}" x2="1110" y2="${planY + planH}" stroke="#a89579" stroke-width="2" stroke-dasharray="6 6"/>
    <line x1="1110" y1="${planY - 6}" x2="1110" y2="${planY + 6}" stroke="#a89579" stroke-width="2"/>
    <line x1="1110" y1="${planY + planH - 6}" x2="1110" y2="${planY + planH + 6}" stroke="#a89579" stroke-width="2"/>
    <text x="1128" y="${planY + planH / 2}" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#8e7552">układ funkcjonalny</text>

    ${footerLegend}
  </g>
</svg>`;
}

function project(x, y, z, originX, originY) {
  return {
    x: originX + (x - y) * 0.92,
    y: originY + (x + y) * 0.48 - z
  };
}

function polygon(points, attrs='') {
  return `<polygon points="${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" ${attrs}/>`;
}

function renderIsoFurniture(room, originX, originY, scaleU) {
  const items = [];
  const addTopRect = (x, y, w, h, z, fill) => {
    const p1 = project(x, y, z, originX, originY);
    const p2 = project(x + w, y, z, originX, originY);
    const p3 = project(x + w, y + h, z, originX, originY);
    const p4 = project(x, y + h, z, originX, originY);
    items.push(polygon([p1, p2, p3, p4], `fill="${fill}" opacity="0.9"`));
  };
  if (room.furnish === 'living' || room.furnish === 'studio') {
    addTopRect(room.x + 24, room.y + room.h - 70, Math.min(room.w - 48, 110), 42, 18, '#cec2b3');
    addTopRect(room.x + room.w - 120, room.y + 26, 86, 20, 18, '#c5d0c7');
  }
  if (room.furnish === 'dining') addTopRect(room.x + room.w / 2 - 48, room.y + room.h / 2 - 20, 96, 40, 18, '#d7cdbf');
  if (room.furnish === 'bedroom') addTopRect(room.x + 24, room.y + 24, Math.min(room.w - 48, 100), 62, 18, '#d8cdc1');
  if (room.furnish === 'office') addTopRect(room.x + 26, room.y + room.h - 58, Math.min(room.w - 52, 88), 34, 18, '#d4cabd');
  if (room.furnish === 'bath') addTopRect(room.x + room.w / 2 - 36, room.y + room.h - 52, 72, 28, 18, '#d5e0db');
  return items.join('\n');
}

function renderCutaways(def) {
  const w = def.size.w;
  const h = def.size.h;
  const vbW = 1200;
  const vbH = 820;
  const margin = 56;
  const availableW = 740;
  const availableH = 460;
  const scaleU = Math.min(availableW / w, availableH / h);
  const offsetX = 240;
  const offsetY = 190;
  const originX = 320;
  const originY = 220;
  const wallH = 62;
  const roomGroup = def.roomsDef.map((room) => {
    const p = palette[room.type];
    const x = room.x * scaleU;
    const y = room.y * scaleU;
    const rw = room.w * scaleU;
    const rh = room.h * scaleU;
    const top = [project(x, y, wallH, originX, originY), project(x + rw, y, wallH, originX, originY), project(x + rw, y + rh, wallH, originX, originY), project(x, y + rh, wallH, originX, originY)];
    const left = [project(x, y, 0, originX, originY), project(x, y + rh, 0, originX, originY), project(x, y + rh, wallH, originX, originY), project(x, y, wallH, originX, originY)];
    const right = [project(x + rw, y, 0, originX, originY), project(x + rw, y + rh, 0, originX, originY), project(x + rw, y + rh, wallH, originX, originY), project(x + rw, y, wallH, originX, originY)];
    const label = project(x + rw / 2, y + rh / 2, wallH + 2, originX, originY);
    return `
      <g>
        ${polygon(left, `fill="${p.left}" stroke="#5b544b" stroke-width="2.8"`)}
        ${polygon(right, `fill="${p.right}" stroke="#5b544b" stroke-width="2.8"`)}
        ${polygon(top, `fill="${p.top}" stroke="#56514a" stroke-width="3"`)}
        ${renderIsoFurniture({ ...room, x, y, w: rw, h: rh }, originX, originY, scaleU)}
        <text x="${label.x.toFixed(1)}" y="${(label.y + 4).toFixed(1)}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(13, Math.min(20, rw / 8))}" font-weight="700" fill="#332c23">${esc(room.name)}</text>
      </g>`;
  }).join('\n');

  const slab = [
    project(-30, h * scaleU + 84, 0, originX, originY),
    project(w * scaleU * 0.7, h * scaleU * 0.74, 0, originX, originY),
    project(w * scaleU + 120, h * scaleU + 52, 0, originX, originY),
    project(180, h * scaleU + 170, 0, originX, originY)
  ];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#1b1d1f"/><stop offset="1" stop-color="#332f2a"/></linearGradient>
    <linearGradient id="glow" x1="0" x2="1"><stop stop-color="#d3a862" stop-opacity="0"/><stop offset="0.5" stop-color="#d3a862" stop-opacity="0.18"/><stop offset="1" stop-color="#d3a862" stop-opacity="0"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="26" stdDeviation="18" flood-opacity="0.28"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g filter="url(#shadow)">
    ${polygon(slab, 'fill="#ece4d8" stroke="#faf6ef" stroke-width="18" stroke-linejoin="round"')}
    ${roomGroup}
    <path d="M ${slab[0].x.toFixed(1)} ${slab[0].y.toFixed(1)} L ${slab[1].x.toFixed(1)} ${slab[1].y.toFixed(1)} L ${slab[2].x.toFixed(1)} ${slab[2].y.toFixed(1)}" fill="none" stroke="#faf6ef" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g>
    <rect x="34" y="32" width="280" height="92" rx="24" fill="#282724" fill-opacity="0.78" stroke="#57524a"/>
    <text x="58" y="72" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#f4e9d7">${esc(def.title)}</text>
    <text x="58" y="103" font-family="Arial, Helvetica, sans-serif" font-size="19" fill="#d6b178">${def.area} m² · ${def.rooms} ${def.rooms === 1 ? 'pokój' : def.rooms < 5 ? 'pokoje' : 'pokoi'}</text>
    <rect x="1010" y="42" width="126" height="126" rx="63" fill="#ca9d56"/>
    <text x="1073" y="117" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#fff">3D</text>
    <rect x="430" y="34" width="340" height="40" rx="20" fill="#111" fill-opacity="0.54" stroke="#3a3732"/>
    <text x="600" y="60" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="1.1" fill="#ece1d1">PRZECIĄGNIJ, ABY OBRÓCIĆ</text>
  </g>
</svg>`;
}

for (const def of defs) {
  fs.writeFileSync(path.join(floorplansDir, `${def.code}.svg`), renderFloorplan(def));
  fs.writeFileSync(path.join(cutawaysDir, `${def.code}.svg`), renderCutaways(def));
}

console.log(`Generated ${defs.length} floorplans and cutaways.`);
