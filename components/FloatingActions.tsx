import Link from "next/link";

export function FloatingActions() {
  return (
    <div className="floatingActions" aria-label="Szybkie akcje">
      <a href="tel:+48600123456" className="floatingAction" aria-label="Zadzwoń"><span>☎</span><b>Zadzwoń</b></a>
      <a href="/#kontakt" className="floatingAction"><span>✉</span><b>Zapytaj</b></a>
      <Link href="/mieszkania" className="floatingAction primary"><span>⌂</span><b>Mieszkania</b></Link>
    </div>
  );
}
