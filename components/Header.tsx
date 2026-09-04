import Link from "next/link";

export function Header() {
  return (
    <header className="siteHeader">
      <div className="shell navWrap">
        <Link href="/" className="brand" aria-label="Monterra Residence">
          <span className="brandMain">Monterra</span>
          <span className="brandSub">RESIDENCE</span>
        </Link>
        <nav className="navLinks" aria-label="Główna nawigacja">
          <Link href="/#inwestycja">O inwestycji</Link>
          <Link href="/mieszkania">Mieszkania</Link>
          <Link href="/#lokalizacja">Lokalizacja</Link>
          <Link href="/#standard">Standard</Link>
          <Link href="/#postep">Postęp prac</Link>
          <Link href="/#kontakt">Kontakt</Link>
        </nav>
        <Link className="button buttonGold navCta" href="/mieszkania">
          Wybierz mieszkanie
        </Link>
      </div>
    </header>
  );
}
