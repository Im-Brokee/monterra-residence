import type { PriceHistoryEntry } from "@/lib/types";
import { formatPln } from "@/lib/format";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function formatMonth(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    month: "short",
    year: "2-digit"
  }).format(new Date(date));
}

export function PriceHistory({ history }: { history: PriceHistoryEntry[] }) {
  if (!history.length) {
    return <div className="priceHistoryEmpty">Historia ceny pojawi się po pierwszej aktualizacji.</div>;
  }

  const recent = history.slice(-6);
  const latest = recent.at(-1)!;
  const previous = recent.at(-2) ?? null;
  const values = recent.map((entry) => entry.newPrice);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const absoluteDiff = previous ? latest.newPrice - previous.newPrice : 0;
  const percentDiff = previous ? (absoluteDiff / previous.newPrice) * 100 : 0;
  const avg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  const points = recent.map((entry, index) => {
    const x = recent.length === 1 ? 50 : 10 + (index / (recent.length - 1)) * 80;
    const y = 78 - ((entry.newPrice - min) / range) * 56;
    return { x, y, entry };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="priceHistoryPro">
      <div className="priceSnapshotGrid">
        <div className="snapshotCard">
          <span>Aktualna cena</span>
          <strong>{formatPln(latest.newPrice)}</strong>
          <small>stan na {formatDate(latest.changedAt)}</small>
        </div>
        <div className="snapshotCard">
          <span>Zmiana vs poprzednio</span>
          <strong className={absoluteDiff >= 0 ? "up" : "down"}>
            {previous ? `${absoluteDiff >= 0 ? "+" : ""}${formatPln(absoluteDiff)}` : "Brak zmian"}
          </strong>
          <small>{previous ? `${percentDiff >= 0 ? "+" : ""}${percentDiff.toFixed(1)}%` : "pierwszy zapis"}</small>
        </div>
        <div className="snapshotCard">
          <span>Średnia z historii</span>
          <strong>{formatPln(avg)}</strong>
          <small>{recent.length} ostatnich zapisów</small>
        </div>
      </div>

      <div className="priceHistoryChartShell">
        <div className="priceAxisY">
          {[max, min + range / 2, min].map((tick, index) => (
            <span key={index}>{formatPln(Math.round(tick / 1000) * 1000)}</span>
          ))}
        </div>

        <div className="priceChartArea">
          <svg className="priceChartPro" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Historia ceny mieszkania">
            <defs>
              <linearGradient id="priceAreaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#c69758" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#c69758" stopOpacity="0.03" />
              </linearGradient>
            </defs>
            <line x1="10" y1="22" x2="90" y2="22" className="priceGridLine" />
            <line x1="10" y1="50" x2="90" y2="50" className="priceGridLine" />
            <line x1="10" y1="78" x2="90" y2="78" className="priceGridLine" />
            <path d={`M ${points[0]?.x ?? 10} 78 L ${polyline.replace(/ /g, ' L ')} L ${points.at(-1)?.x ?? 90} 78 Z`} className="priceChartAreaFill" />
            <polyline points={polyline} className="priceChartLinePro" />
            {points.map((point) => (
              <g key={point.entry.id}>
                <circle cx={point.x} cy={point.y} r="2.3" className="priceChartPointPro" />
                <text x={point.x} y={point.y - 6} textAnchor="middle" className="priceChartValueLabel">
                  {Math.round(point.entry.newPrice / 1000)}k
                </text>
              </g>
            ))}
          </svg>

          <div className="priceAxisX">
            {recent.map((entry) => (
              <span key={entry.id}>{formatMonth(entry.changedAt)}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="priceHistoryTable detailed">
        {recent
          .slice()
          .reverse()
          .map((entry, index) => {
            const next = recent[recent.length - 1 - index + 1] ?? null;
            const diff = next ? entry.newPrice - next.newPrice : 0;
            return (
              <div key={entry.id}>
                <span>{index === 0 ? "Aktualny zapis" : `Archiwum ${recent.length - index}`}</span>
                <span>{formatDate(entry.changedAt)}</span>
                <strong>{formatPln(entry.newPrice)}</strong>
                <b className={diff >= 0 ? "up" : "down"}>{next ? `${diff >= 0 ? "+" : ""}${formatPln(diff)}` : "—"}</b>
              </div>
            );
          })}
      </div>
    </div>
  );
}
