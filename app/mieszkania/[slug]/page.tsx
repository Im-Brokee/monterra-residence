import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApartmentExperience } from "@/components/ApartmentExperience";
import { ApartmentConfigurator } from "@/components/ApartmentConfigurator";
import { PriceHistory } from "@/components/PriceHistory";
import { Reveal } from "@/components/Reveal";
import { getAddons, getApartment, getApartments, getInventoryItems, getPriceHistory } from "@/lib/data";
import { balconyLabel, formatArea, formatPln, statusLabel } from "@/lib/format";
import { getApartmentVisuals } from "@/lib/visuals";

export default async function ApartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  if (!apartment) notFound();

  const visuals = getApartmentVisuals(apartment);

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
        <section className="apartmentHero premiumApartmentHero">
          <div className="apartmentHeroBackdrop">
            <Image src={visuals.hero} alt={`Wnętrze mieszkania ${apartment.unitNumber}`} fill priority sizes="100vw" className="apartmentHeroImage" />
            <div className="apartmentHeroShade" />
          </div>
          <div className="shell apartmentHeroGrid">
            <div className="apartmentHeroVisual premiumHeroVisual">
              <div className="heroPlanGlass">
                <img src={apartment.floorplanUrl} alt={`Rzut ${apartment.unitNumber}`} />
                <span>Rzut 2D</span>
              </div>
            </div>
            <div className="apartmentHeroInfo premiumHeroInfo">
              <Link href="/mieszkania" className="backLink lightBackLink">← Wszystkie mieszkania</Link>
              <div className="unitTitleLine"><h1>{apartment.unitNumber}</h1><span className={`statusPill ${apartment.status}`}>{statusLabel[apartment.status]}</span></div>
              <p className="styleName">{apartment.styleName}</p>
              <div className="metricGrid premiumMetricGrid">
                <div><span>Powierzchnia</span><strong>{formatArea(apartment.area)}</strong></div>
                <div><span>Liczba pokoi</span><strong>{apartment.rooms}</strong></div>
                <div><span>Piętro</span><strong>{apartment.floor}</strong></div>
                <div><span>{balconyLabel[apartment.balconyType]}</span><strong>{formatArea(apartment.balconyArea)}</strong></div>
              </div>
              <div className="heroPrice premiumHeroPrice"><span>Cena mieszkania</span><strong>{formatPln(apartment.price)}</strong><small>{formatPln(apartment.pricePerSqm)}/m²</small></div>
              <div className="heroCtas"><a href="#konfigurator" className="button buttonGold">Skonfiguruj cenę ↓</a><a href="#spacer" className="button buttonGlass">Zobacz 3D / spacer</a></div>
            </div>
          </div>
        </section>

        <Reveal>
          <section className="shell section detailMainGrid">
            <div>
              <div className="sectionHeading"><span className="eyebrow">MIESZKANIE {apartment.unitNumber}</span><h2>Zobacz układ zanim wejdziesz na budowę</h2><p>Rzut, interaktywny widok 3D i spacer między pomieszczeniami w jednym miejscu.</p></div>
              <div id="spacer"><ApartmentExperience apartment={apartment} /></div>

              <div className="apartmentInteriorGallery">
                <figure><Image src={visuals.gallery.living} alt="Salon z kuchnią" fill sizes="50vw" className="storyImage" /><figcaption>Salon z kuchnią</figcaption></figure>
                <figure><Image src={visuals.gallery.bedroom} alt="Sypialnia" fill sizes="25vw" className="storyImage" /><figcaption>Sypialnia</figcaption></figure>
                <figure><Image src={visuals.gallery.bathroom} alt="Łazienka" fill sizes="25vw" className="storyImage" /><figcaption>Łazienka</figcaption></figure>
              </div>

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
        </Reveal>

        {similar.length > 0 && <section className="shell section"><div className="sectionHeading splitHeading"><div><span className="eyebrow">PODOBNE</span><h2>Może zainteresują Cię również</h2></div><Link href="/mieszkania" className="textLink">Wszystkie →</Link></div><div className="similarGrid">{similar.map((a) => { const relatedVisuals = getApartmentVisuals(a); return <Link href={`/mieszkania/${a.slug}`} key={a.id} className="similarCard"><div className="similarImageWrap"><Image src={relatedVisuals.card} alt="" fill sizes="25vw" className="storyImage" /></div><div><strong>{a.unitNumber}</strong><span>{a.area} m² · {a.rooms} pokoje</span><b>{formatPln(a.price)}</b></div></Link>; })}</div></section>}
      </main>
      <Footer />
    </>
  );
}
