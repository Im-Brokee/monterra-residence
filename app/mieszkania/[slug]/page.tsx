import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApartmentExperience } from "@/components/ApartmentExperience";
import { ApartmentConfigurator } from "@/components/ApartmentConfigurator";
import { PriceHistory } from "@/components/PriceHistory";
import { getAddons, getApartment, getApartments, getInventoryItems, getPriceHistory } from "@/lib/data";
import { balconyLabel, formatArea, formatPln, statusLabel } from "@/lib/format";

export default async function ApartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  if (!apartment) notFound();

  const [addons, inventory, allApartments, history] = await Promise.all([
    getAddons(),
    getInventoryItems(),
    getApartments(),
    getPriceHistory(apartment.id, apartment.price)
  ]);

  const similar = allApartments
    .filter((a) => a.id !== apartment.id && a.status !== "sold")
    .sort((a, b) => Math.abs(a.area - apartment.area) - Math.abs(b.area - apartment.area))
    .slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <section className="apartmentHero">
          <div className="shell apartmentHeroGrid">
            <div className="apartmentHeroVisual"><img src={apartment.cutawayUrl} alt={`Mieszkanie ${apartment.unitNumber}`} /></div>
            <div className="apartmentHeroInfo">
              <Link href="/mieszkania" className="backLink">← Wszystkie mieszkania</Link>
              <div className="unitTitleLine"><h1>{apartment.unitNumber}</h1><span className={`statusPill ${apartment.status}`}>{statusLabel[apartment.status]}</span></div>
              <p className="styleName">{apartment.styleName}</p>
              <div className="metricGrid">
                <div><span>Powierzchnia</span><strong>{formatArea(apartment.area)}</strong></div>
                <div><span>Liczba pokoi</span><strong>{apartment.rooms}</strong></div>
                <div><span>Piętro</span><strong>{apartment.floor}</strong></div>
                <div><span>{balconyLabel[apartment.balconyType]}</span><strong>{formatArea(apartment.balconyArea)}</strong></div>
              </div>
              <div className="heroPrice"><span>Cena mieszkania</span><strong>{formatPln(apartment.price)}</strong><small>{formatPln(apartment.pricePerSqm)}/m²</small></div>
              <div className="heroCtas"><a href="#konfigurator" className="button buttonGold">Skonfiguruj cenę ↓</a><a href="#spacer" className="button buttonGhost">Zobacz 3D / spacer</a></div>
            </div>
          </div>
        </section>

        <section className="shell section detailMainGrid">
          <div>
            <div className="sectionHeading"><span className="eyebrow">MIESZKANIE {apartment.unitNumber}</span><h2>Zobacz układ zanim wejdziesz na budowę</h2><p>Rzut, interaktywny widok 3D i spacer między pomieszczeniami w jednym miejscu.</p></div>
            <div id="spacer"><ApartmentExperience apartment={apartment} /></div>

            <section className="detailSpecs">
              <div className="specCard cardSoft"><h3>Szczegóły mieszkania</h3><dl>
                <div><dt>Budynek</dt><dd>{apartment.building}</dd></div>
                <div><dt>Piętro</dt><dd>{apartment.floor}</dd></div>
                <div><dt>Liczba pokoi</dt><dd>{apartment.rooms}</dd></div>
                <div><dt>Powierzchnia</dt><dd>{formatArea(apartment.area)}</dd></div>
                <div><dt>{balconyLabel[apartment.balconyType]}</dt><dd>{formatArea(apartment.balconyArea)}</dd></div>
                <div><dt>Ekspozycja</dt><dd>{apartment.exposure}</dd></div>
                <div><dt>Wysokość</dt><dd>{apartment.ceilingHeight.toFixed(2)} m</dd></div>
                <div><dt>Standard</dt><dd>{apartment.styleName}</dd></div>
              </dl></div>
              <div className="specCard cardSoft"><h3>Historia ceny</h3><PriceHistory history={history} /><p className="muted priceLegalNote">Zmiany ceny zapisują się automatycznie po edycji w panelu administratora.</p></div>
            </section>
          </div>
          <div id="konfigurator"><ApartmentConfigurator apartment={apartment} addons={addons} inventory={inventory} /></div>
        </section>

        {similar.length > 0 && <section className="shell section"><div className="sectionHeading splitHeading"><div><span className="eyebrow">PODOBNE</span><h2>Może zainteresują Cię również</h2></div><Link href="/mieszkania" className="textLink">Wszystkie →</Link></div><div className="similarGrid">{similar.map((a) => <Link href={`/mieszkania/${a.slug}`} key={a.id} className="similarCard"><img src={a.floorplanUrl} alt=""/><div><strong>{a.unitNumber}</strong><span>{a.area} m² · {a.rooms} pokoje</span><b>{formatPln(a.price)}</b></div></Link>)}</div></section>}
      </main>
      <Footer />
    </>
  );
}
