import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApartmentCatalog } from "@/components/ApartmentCatalog";
import { getApartments } from "@/lib/data";

export default async function ApartmentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const floor = typeof params.floor === "string" ? Number(params.floor) : undefined;
  const building = typeof params.building === "string" ? params.building : undefined;
  const apartments = await getApartments();

  return (
    <>
      <Header />
      <main>
        <section className="pageHero compactHero apartmentsPhotoHero">
          <Image src="/media/aerial-evening.webp" alt="Monterra Residence wieczorem" fill priority sizes="100vw" className="apartmentsHeroImage" />
          <div className="apartmentsHeroShade" />
          <div className="shell compactHeroInner">
            <div>
              <span className="eyebrow light">MON TERRA RESIDENCE</span>
              <h1>Dostępne mieszkania</h1>
              <p>Filtruj ofertę, przełącz widok i przejdź do planu 2D, 3D, spaceru oraz konfiguratora ceny.</p>
            </div>
            <div className="compactHeroStats">
              <div><strong>{apartments.length}</strong><span>lokali w bazie</span></div>
              <div><strong>{apartments.filter((item) => item.status === "available").length}</strong><span>wolnych mieszkań</span></div>
              <div><strong>3</strong><span>widoki prezentacji</span></div>
            </div>
          </div>
        </section>
        <div className="shell section catalogSection"><ApartmentCatalog apartments={apartments} initialFloor={Number.isFinite(floor) ? floor : undefined} initialBuilding={building} /></div>
      </main>
      <Footer />
    </>
  );
}
