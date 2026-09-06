"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function money(value: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value);
}

export function MortgageCalculator() {
  const [price, setPrice] = useState(780000);
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(6.8);

  const result = useMemo(() => {
    const own = price * (downPayment / 100);
    const principal = Math.max(price - own, 0);
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const payment = monthlyRate > 0
      ? principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;
    return { own, principal, payment };
  }, [price, downPayment, years, rate]);

  return (
    <section className="financePanel">
      <div className="financeCopy">
        <span className="eyebrow">FINANSOWANIE</span>
        <h2>Sprawdź orientacyjną ratę bez wychodzenia ze strony.</h2>
        <p>Prosty kalkulator pomaga oszacować budżet jeszcze przed rozmową z doradcą. Wynik ma charakter orientacyjny i nie jest ofertą banku.</p>
        <Link href="/mieszkania" className="textLink">Wybierz mieszkanie do swojego budżetu →</Link>
      </div>

      <div className="financeCalculator cardSoft">
        <div className="financeFields">
          <label>Cena mieszkania
            <div className="rangeValue">{money(price)}</div>
            <input type="range" min="350000" max="1800000" step="10000" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </label>
          <label>Wkład własny
            <div className="rangeValue">{downPayment}% · {money(result.own)}</div>
            <input type="range" min="10" max="50" step="5" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
          </label>
          <div className="financeSelects">
            <label>Okres<select value={years} onChange={(e) => setYears(Number(e.target.value))}><option value={20}>20 lat</option><option value={25}>25 lat</option><option value={30}>30 lat</option><option value={35}>35 lat</option></select></label>
            <label>Oprocentowanie<input type="number" min="0" max="20" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
          </div>
        </div>
        <div className="financeResult">
          <span>Orientacyjna rata</span>
          <strong>{money(result.payment)}<small>/mies.</small></strong>
          <div><span>Kwota kredytu</span><b>{money(result.principal)}</b></div>
          <div><span>Wkład własny</span><b>{money(result.own)}</b></div>
          <a href="#kontakt" className="button buttonGold full">Porozmawiaj z doradcą</a>
        </div>
      </div>
    </section>
  );
}
