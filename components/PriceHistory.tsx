import type { PriceHistoryEntry } from "@/lib/types";
import { formatPln } from "@/lib/format";

export function PriceHistory({ history }: { history: PriceHistoryEntry[] }) {
  if (!history.length) {
    return <div className="priceHistoryEmpty">Historia ceny pojawi się po pierwszej aktualizacji.</div>;
  }

  const values = history.map((entry) => entry.newPrice);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const latest = history.at(-1)!;
  const previous = history.at(-2) ?? null;
  const diff = previous ? latest.newPrice - previous.newPrice : 0;
  const diffPercent = previous ? Math.round((diff / previous.newPrice) * 1000) / 10 : 0;
  const recent = history.slice(-5);
  const ticks = [min, min + range / 2, max].map((v) => Math.round(v / 1000) * 1000);

  const pointList = recent.map((entry, index) => {
    const x = recent.length === 1 ? 50 : 10 + (index / (recent.length - 1)) * 80;
    const y = 78 - ((entry.newPrice - min) / range) * 54;
    return { x, y, entry };
  });

  const points = pointList.map((item) => `${item.x},${item.y}`).join(" ");

  return (
    <div className="priceHistoryPro">
      <div className="priceHistoryTopline">
        <div>
          <span>Aktualna cena</span>
          <strong>{formatPln(latest.newPrice)}</strong>
        </div>
        <div>
          <span>Ostatnia zmiana</span>
          <strong className={diff >= 0 ? "up" : "down"}>
            {previous ? `${diff >= 0 ? "+" : ""}${formatPln(diff)}` : "Brak"}
          </strong>
          {previous ? <small>{diffPercent >= 0 ? "+" : ""}{diffPercent}% vs poprzednio</small> : null}
        </div>
      </div>

      <div className="priceChartFrame">
        <div className="priceAxisY">
          {ticks.slice().reverse().map((tick) => (
            <span key={tick}>{formatPln(tick)}</span>
          ))}
        </div>
        <svg className="priceChartPro" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Historia ceny">
          <line x1="10" y1="24" x2="90" y2="24" className="priceGridLine" />
          <line x1="10" y1="51" x2="90" y2="51" className="priceGridLine" />
          <line x1="10" y1="78" x2="90" y2="78" className="priceGridLine" />
          <polyline points={points} className="priceChartLinePro" />
          {pointList.map((item) => (
            <g key={item.entry.id}>
              <circle cx={item.x} cy={item.y} r="2.3" className="priceChartPointPro" />
              <text x={item.x} y={item.y - 5} textAnchor="middle" className="priceChartValueLabel">
                {Math.round(item.entry.newPrice / 1000)}k
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="priceAxisX">
        {recent.map((entry) => (
          <span key={entry.id}>{new Intl.DateTimeFormat("pl-PL", { month: "short", year: "2-digit" }).format(new Date(entry.changedAt))}</span>
        ))}
      </div>

      <div className="priceHistoryTable">
        {recent.slice().reverse().map((entry, index) => (
          <div key={entry.id}>
            <span>{index === 0 ? "Aktualizacja" : "Poprzednia"}</span>
            <span>{new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(entry.changedAt))}</span>
            <strong>{formatPln(entry.newPrice)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
