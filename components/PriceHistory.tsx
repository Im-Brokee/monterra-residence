import type { PriceHistoryEntry } from "@/lib/types";
import { formatPln } from "@/lib/format";

export function PriceHistory({ history }: { history: PriceHistoryEntry[] }) {
  const values = history.map((entry) => entry.newPrice);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const points = history.map((entry, index) => {
    const x = history.length === 1 ? 50 : (index / (history.length - 1)) * 100;
    const y = 82 - ((entry.newPrice - min) / range) * 62;
    return `${x},${y}`;
  }).join(" ");
  const latest = history.at(-1);
  const previous = history.at(-2);

  return (
    <div className="priceHistoryReal">
      <div className="priceHistoryHead">
        <div><span>Aktualna cena</span><strong>{latest ? formatPln(latest.newPrice) : "—"}</strong></div>
        {previous && <div><span>Poprzednia cena</span><strong>{formatPln(previous.newPrice)}</strong></div>}
      </div>
      {history.length > 1 ? (
        <svg className="priceChart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Historia ceny">
          <line x1="0" y1="82" x2="100" y2="82" className="priceChartBase" />
          <polyline points={points} className="priceChartLine" />
          {history.map((entry, index) => {
            const [x, y] = points.split(" ")[index].split(",");
            return <circle key={entry.id} cx={x} cy={y} r="2.2" className="priceChartPoint" />;
          })}
        </svg>
      ) : <div className="priceHistoryEmpty">Historia zacznie się rozwijać przy kolejnych zmianach ceny.</div>}
      <div className="priceHistoryDates">
        {history.slice(-5).map((entry) => (
          <span key={entry.id}>{new Intl.DateTimeFormat("pl-PL", { month: "short", year: "2-digit" }).format(new Date(entry.changedAt))}</span>
        ))}
      </div>
    </div>
  );
}
