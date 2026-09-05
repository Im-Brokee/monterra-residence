import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BuildingSelector } from "@/components/BuildingSelector";
import { ApartmentCard } from "@/components/ApartmentCard";
import { Reveal } from "@/components/Reveal";
import { getApartments, getConstructionUpdates } from "@/lib/data";

export default async function HomePage() {
  const [apartments, constructionUpdates] = await Promise.all([getApartments(), getConstructionUpdates()]);
  const available = apartments.filter((a) => a.status === "available").length;
  const preview = apartments.filter((a) => a.status !== "sold").slice(0, 5);

  return (
    <>
      <Header />
      <main>
        <section className="hero heroRealEstate">
          <div className="heroImageWrap">
            <Image
              src="/media/hero-building.webp"
              alt="Monterra Residence w Poznaniu"
              fill
              priority
              sizes="100vw"
              className="heroRealImage"
            />
            <div className="heroRealShade" />
            <div className="heroLightSweep" />
          </div>

          <div className="shell heroContent heroContentReal">
            <span className="heroKicker">NOWA DEFINICJA KOMFORTU · POZNAŃ</span>
            <h1>Miejsce,<br />w którym<br />chcesz być.</h1>
            <h2>Monterra Residence</h2>
            <p>Szlachetna architektura, dopracowane wnętrza i pełny cyfrowy proces wyboru mieszkania — od pierwszego kliknięcia do wysłania gotowego zapytania.</p>
            <div className="heroMetaPills">
              <span>1–5 pokoi</span>
              <span>2D + 3D + spacer</span>
              <span>garaż i komórki</span>
            </div>
            <div className="heroActions">
              <Link className="button buttonGold" href="/mieszkania">Zobacz mieszkania →</Link>
              <a className="button buttonGlass" href="#inwestycja">Poznaj inwestycję</a>
            </div>
          </div>

          <div className="heroSideWords" aria-hidden="true">
            <span>PRESTIŻ</span><span>NATURA</span><span>LOKALIZACJA</span><span>PRZYSZŁOŚĆ</span>
          </div>
        </section>

        <section className="shell statStrip premiumStatStrip">
          <div><strong>{apartments.length}</strong><span>mieszkań w ofercie</span></div>
          <div><strong>Q2 2028</strong><span>termin oddania</span></div>
          <div><strong>7 min</strong><span>od centrum</span></div>
          <div><strong>{available}</strong><span>mieszkań dostępnych</span></div>
        </section>

        <Reveal>
          <section className="shell section" id="inwestycja">
            <div className="sectionHeading splitHeading">
              <div><span className="eyebrow">MON TERRA</span><h2>Architektura, która ma znaczenie także po latach</h2></div>
              <p>Spokojna bryła, wyraźna rytmika elewacji, dużo światła i przemyślane układy mieszkań — wszystko pokazane w sposób czytelny i sprzedażowy.</p>
            </div>
            <div className="featureGrid" id="standard">
              {[
                ['3 min','do tramwaju'],
                ['2','zielone dziedzińce'],
                ['100%','garaż podziemny'],
                ['2,70 m','wysokość mieszkań'],
                ['Smart','home ready'],
                ['24/7','strefa mieszkańca']
              ].map(([value,label], index) => (
                <Reveal key={label} delay={index * 55}>
                  <div className="featureCard premiumFeatureCard">
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="shell section imageStorySection">
            <div className="sectionHeading splitHeading">
              <div><span className="eyebrow">WIZUALIZACJE</span><h2>Zobacz inwestycję zanim powstanie</h2></div>
              <p>Pełnoekranowe wizualizacje budynku, wejścia i wnętrz. Każdy kluczowy fragment inwestycji ma własną, czytelną prezentację.</p>
            </div>
            <div className="storyGrid">
              <figure className="storyCard storyWide">
                <Image src="/media/aerial-evening.webp" alt="Monterra Residence z lotu ptaka wieczorem" fill sizes="(max-width:760px) 100vw, 66vw" className="storyImage" />
                <figcaption><span>01</span><div><strong>Cała inwestycja</strong><small>Widok wieczorny</small></div></figcaption>
              </figure>
              <figure className="storyCard">
                <Image src="/media/entrance.webp" alt="Wejście do Monterra Residence" fill sizes="(max-width:760px) 100vw, 33vw" className="storyImage" />
                <figcaption><span>02</span><div><strong>Strefa wejścia</strong><small>Detal premium</small></div></figcaption>
              </figure>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="shell section">
            <BuildingSelector apartments={apartments} />
          </section>
        </Reveal>

        <Reveal>
          <section className="shell section">
            <div className="sectionHeading splitHeading">
              <div><span className="eyebrow">DOSTĘPNE LOKALE</span><h2>Znajdź swoje idealne miejsce</h2></div>
              <Link href="/mieszkania" className="textLink">Zobacz wszystkie mieszkania →</Link>
            </div>
            <div className="apartmentGrid homeGrid">
              {preview.map((apartment, index) => <Reveal key={apartment.id} delay={index * 60}><ApartmentCard apartment={apartment} /></Reveal>)}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="experiencePromo sectionDark premiumExperiencePromo">
            <div className="shell promoGrid">
              <div>
                <span className="eyebrow light">POCZUJ PRZESTRZEŃ</span>
                <h2>Nie tylko plan. Wejdź do środka.</h2>
                <p>Klient przechodzi od karty mieszkania do planu 2D, modelu 3D i spaceru po wnętrzu bez wychodzenia z jednej strony.</p>
                <Link href={preview[0] ? `/mieszkania/${preview[0].slug}` : "/mieszkania"} className="button buttonGold">Uruchom spacer</Link>
              </div>
              <div className="interiorMosaic">
                <div className="interiorMain"><Image src="/media/living.webp" alt="Salon Monterra Residence" fill sizes="50vw" className="storyImage" /></div>
                <div className="interiorSmall"><Image src="/media/bedroom.webp" alt="Sypialnia Monterra Residence" fill sizes="25vw" className="storyImage" /></div>
                <div className="interiorSmall"><Image src="/media/bathroom.webp" alt="Łazienka Monterra Residence" fill sizes="25vw" className="storyImage" /></div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="shell section" id="lokalizacja">
            <div className="sectionHeading splitHeading">
              <div><span className="eyebrow">LOKALIZACJA</span><h2>Wszystko w zasięgu ręki</h2></div>
              <p>Park, komunikacja miejska, szkoła i codzienne usługi w zasięgu kilku minut od inwestycji.</p>
            </div>
            <div className="locationGrid premiumLocationGrid">
              <div className="locationCards">
                <div><strong>Park Cytadela</strong><span>8 min spacerem</span></div>
                <div><strong>Przystanek tramwajowy</strong><span>3 min spacerem</span></div>
                <div><strong>Szkoła podstawowa</strong><span>5 min spacerem</span></div>
                <div><strong>Sklepy i usługi</strong><span>4 min spacerem</span></div>
              </div>
              <div className="locationPhoto">
                <Image src="/media/aerial-evening.webp" alt="Lokalizacja Monterra Residence w Poznaniu" fill sizes="60vw" className="storyImage" />
                <div className="locationPhotoShade" />
                <div className="locationPinCard"><span>POZNAŃ</span><strong>Monterra Residence</strong><small>7 min od centrum</small></div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="shell section" id="postep">
            <div className="sectionHeading splitHeading"><div><span className="eyebrow">POSTĘP PRAC</span><h2>Od gruntu do odbioru</h2></div>{constructionUpdates[0] && <div className="progressNow"><strong>{constructionUpdates[0].progress}%</strong><span>{constructionUpdates[0].title}</span></div>}</div>
            <div className="timeline">
              {[['✓','Zakup gruntu','Q1 2024'],['✓','Projekt','Q2 2024'],['✓','Pozwolenie','Q3 2024'],['●','Rozpoczęcie budowy','Q1 2025'],['○','Stan surowy','Q4 2026'],['○','Wykończenie','Q2 2027'],['○','Odbiory','Q2 2028']].map(([icon,name,date], i) => (
                <div className={i <= 3 ? "timelineStep done" : "timelineStep"} key={name}><span>{icon}</span><strong>{name}</strong><small>{date}</small></div>
              ))}
            </div>
            {constructionUpdates.length > 0 && <div className="constructionFeed">{constructionUpdates.slice(0,3).map((update) => <article key={update.id}><div className="constructionFeedProgress">{update.progress}%</div><div><strong>{update.title}</strong><p>{update.body}</p><small>{new Date(update.publishedAt).toLocaleDateString('pl-PL')}</small></div></article>)}</div>}
          </section>
        </Reveal>

        <section className="contactBand" id="kontakt">
          <div className="shell contactGrid">
            <div><span className="eyebrow">KONTAKT</span><h2>Porozmawiajmy o Twoim mieszkaniu</h2><p>Wybierz lokal online, skonfiguruj dodatki i wyślij doradcy gotowe zapytanie z pełną kalkulacją.</p></div>
            <div className="advisorCard"><div className="advisorAvatar">KN</div><div><strong>Katarzyna Nowak</strong><span>Doradca ds. sprzedaży</span><span>+48 600 123 456</span><span>k.nowak@monterra.pl</span></div></div>
            <Link className="button buttonGold" href="/mieszkania">Wybierz mieszkanie</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
