import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFoundPage">
      <div>
        <span className="eyebrow">404 · MON TERRA</span>
        <h1>Nie znaleźliśmy tej strony.</h1>
        <p>Wybrane mieszkanie mogło zmienić status albo adres strony jest nieaktualny.</p>
        <div className="heroActions"><Link className="button buttonGold" href="/mieszkania">Zobacz mieszkania</Link><Link className="button buttonOutline" href="/">Wróć na stronę główną</Link></div>
      </div>
    </main>
  );
}
