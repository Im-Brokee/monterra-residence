import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BuildingSelector } from "@/components/BuildingSelector";
import { ApartmentCard } from "@/components/ApartmentCard";
import { getApartments } from "@/lib/data";

export default async function HomePage() {
  const apartments = await getApartments();
  const available = apartments.filter((a) => a.status === "available").length;
  const preview = apartments.filter((a) => a.status !== "sold").slice(0, 5);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="heroBackdrop">
            <div className="heroBuilding">
              <div className="heroTower towerOne" />
              <div className="heroTower towerTwo" />
              <div className="heroTower towerThree" />
            </div>
          </div>
          <div className="shell heroContent">
            <span className="heroKicker">NOWA INWESTYCJA · POZNAŃ</span>
            <h1>Mieszkaj inaczej.</h1>
            <h2>Monterra Residence</h2>
            <p>Poznań · 1–5 pokoi · interaktywny wybór mieszkań</p>
            <div className="heroActions">
              <Link className="button buttonGold" href="/mieszkania">Wybierz mieszkanie →</Link>
              <a className="button buttonGlass" href="#kontakt">Umów spotkanie</a>
            </div>
          </div>
        </section>

        <section className="shell statStrip">
          <div><strong>{apartments.length}</strong><span>mieszkań w ofercie</span></div>
          <div><strong>Q2 2028</strong><span>termin oddania</span></div>
          <div><strong>7 min</strong><span>od centrum</span></div>
          <div><strong>{available}</strong><span>mieszkań dostępnych</span></div>
        </section>

        <section className="shell section" id="inwestycja">
          <div className="sectionHeading splitHeading">
            <div><span className="eyebrow">MON TERRA</span><h2>Stworzone z myślą o codziennym komforcie</h2></div>
            <p>Premium bez przesady: spokojna architektura, dobre światło, praktyczne rzuty i pełny cyfrowy proces wyboru mieszkania.</p>
          </div>
          <div className="featureGrid" id="standard">
            {[['03 min','do tramwaju'],['02','zielone dziedzińce'],['100%','garaż podziemny'],['2,70 m','wysokość mieszkań'],['Smart','Home ready'],['24/7','strefa mieszkańca']].map(([value,label]) => (
              <div className="featureCard" key={label}><strong>{value}</strong><span>{label}</span></div>
            ))}
          </div>
        </section>

        <section className="shell section">
          <BuildingSelector />
        </section>

        <section className="shell section">
          <div className="sectionHeading splitHeading">
            <div><span className="eyebrow">DOSTĘPNE LOKALE</span><h2>10 typów planów. Setki możliwych lokali.</h2></div>
            <Link href="/mieszkania" className="textLink">Zobacz wszystkie mieszkania →</Link>
          </div>
          <div className="apartmentGrid homeGrid">
            {preview.map((apartment) => <ApartmentCard apartment={apartment} key={apartment.id} />)}
          </div>
        </section>

        <section className="experiencePromo sectionDark">
          <div className="shell promoGrid">
            <div>
              <span className="eyebrow light">POCZUJ PRZESTRZEŃ</span>
              <h2>Plan 2D → widok 3D → spacer po mieszkaniu</h2>
              <p>Klient nie musi wyobrażać sobie mieszkania z technicznego rzutu. Może obejrzeć układ w przekroju i wejść do środka jeszcze przed wizytą.</p>
              <Link href={preview[0] ? `/mieszkania/${preview[0].slug}` : "/mieszkania"} className="button buttonGold">Zobacz przykładowe mieszkanie</Link>
            </div>
            <div className="promoVisual">
              <div className="isoRoom roomLiving">SALON</div>
              <div className="isoRoom roomBed">SYPIALNIA</div>
              <div className="isoRoom roomBath">ŁAZIENKA</div>
              <div className="isoRoom roomKitchen">KUCHNIA</div>
            </div>
          </div>
        </section>

        <section className="shell section" id="lokalizacja">
          <div className="sectionHeading splitHeading">
            <div><span className="eyebrow">LOKALIZACJA</span><h2>Wszystko w zasięgu ręki</h2></div>
            <p>Park, tramwaj, szkoła i codzienne usługi w kilku minutach od inwestycji.</p>
          </div>
          <div className="locationGrid">
            <div className="locationCards">
              <div><strong>Park Cytadela</strong><span>8 min spacerem</span></div>
              <div><strong>Przystanek tramwajowy</strong><span>3 min spacerem</span></div>
              <div><strong>Szkoła podstawowa</strong><span>5 min spacerem</span></div>
              <div><strong>Sklepy i usługi</strong><span>4 min spacerem</span></div>
            </div>
            <div className="mapMock"><div className="mapRoad road1"/><div className="mapRoad road2"/><div className="mapRoad road3"/><div className="mapPin">Monterra Residence</div></div>
          </div>
        </section>

        <section className="shell section" id="postep">
          <div className="sectionHeading"><span className="eyebrow">POSTĘP PRAC</span><h2>Od gruntu do odbioru</h2></div>
          <div className="timeline">
            {[['✓','Zakup gruntu','Q1 2024'],['✓','Projekt','Q2 2024'],['✓','Pozwolenie','Q3 2024'],['●','Rozpoczęcie budowy','Q1 2025'],['○','Stan surowy','Q4 2026'],['○','Wykończenie','Q2 2027'],['○','Odbiory','Q2 2028']].map(([icon,name,date], i) => (
              <div className={i <= 3 ? "timelineStep done" : "timelineStep"} key={name}><span>{icon}</span><strong>{name}</strong><small>{date}</small></div>
            ))}
          </div>
        </section>

        <section className="contactBand" id="kontakt">
          <div className="shell contactGrid">
            <div><span className="eyebrow">KONTAKT</span><h2>Porozmawiajmy o Twoim mieszkaniu</h2><p>Wybierz lokal online, skonfiguruj dodatki i wyślij gotowe zapytanie do doradcy.</p></div>
            <div className="advisorCard"><div className="advisorAvatar">KN</div><div><strong>Katarzyna Nowak</strong><span>Doradca ds. sprzedaży</span><span>+48 600 123 456</span><span>k.nowak@monterra.pl</span></div></div>
            <Link className="button buttonGold" href="/mieszkania">Wybierz mieszkanie</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
