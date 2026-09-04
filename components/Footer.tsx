import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footerGrid">
        <div>
          <div className="footerBrand">Monterra</div>
          <div className="footerBrandSub">RESIDENCE</div>
          <p>Miejsce, w którym chce się mieszkać.</p>
        </div>
        <div>
          <h4>Inwestycja</h4>
          <Link href="/#inwestycja">O inwestycji</Link>
          <Link href="/#standard">Standard</Link>
          <Link href="/#postep">Postęp budowy</Link>
        </div>
        <div>
          <h4>Mieszkania</h4>
          <Link href="/mieszkania">Dostępne mieszkania</Link>
          <Link href="/mieszkania">Rzuty i 3D</Link>
          <Link href="/mieszkania">Cennik</Link>
        </div>
        <div>
          <h4>Kontakt</h4>
          <span>ul. Szelągowska 26</span>
          <span>61-626 Poznań</span>
          <span>+48 600 123 456</span>
          <span>biuro@monterra.pl</span>
        </div>
      </div>
      <div className="shell footerBottom">
        <span>© 2026 Monterra Residence. Demo portfolio.</span>
        <Link href="/admin/login">Panel sprzedaży</Link>
      </div>
    </footer>
  );
}
