"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  ["O inwestycji", "/#inwestycja"],
  ["Mieszkania", "/mieszkania"],
  ["Lokalizacja", "/#lokalizacja"],
  ["Standard", "/#standard"],
  ["Postęp prac", "/#postep"],
  ["Kontakt", "/#kontakt"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="siteHeader">
      <div className="shell navWrap">
        <Link href="/" className="brand" aria-label="Monterra Residence" onClick={() => setOpen(false)}>
          <span className="brandMain">Monterra</span>
          <span className="brandSub">RESIDENCE</span>
        </Link>

        <nav className="navLinks" aria-label="Główna nawigacja">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="navActions">
          <a className="navPhone" href="tel:+48600123456" aria-label="Zadzwoń do biura sprzedaży">+48 600 123 456</a>
          <Link className="button buttonGold navCta" href="/mieszkania">Wybierz mieszkanie</Link>
          <button
            className={`menuToggle ${open ? "active" : ""}`}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div className={`mobileMenu ${open ? "open" : ""}`}>
        <div className="shell mobileMenuInner">
          <span className="eyebrow">MON TERRA · POZNAŃ</span>
          <nav aria-label="Nawigacja mobilna">
            {links.map(([label, href], index) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{label}<i>↗</i>
              </Link>
            ))}
          </nav>
          <div className="mobileMenuFooter">
            <a href="tel:+48600123456">+48 600 123 456</a>
            <a href="mailto:biuro@monterra.pl">biuro@monterra.pl</a>
            <Link className="button buttonGold" href="/mieszkania" onClick={() => setOpen(false)}>Sprawdź dostępne mieszkania</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
