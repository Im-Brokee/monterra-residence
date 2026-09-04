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
        <section className="pageHero compactHero"><div className="shell"><span className="eyebrow light">MON TERRA RESIDENCE</span><h1>Dostępne mieszkania</h1><p>Filtruj ofertę, przełącz widok i przejdź do planu 2D, 3D, spaceru oraz konfiguratora ceny.</p></div></section>
        <div className="shell section catalogSection"><ApartmentCatalog apartments={apartments} initialFloor={Number.isFinite(floor) ? floor : undefined} initialBuilding={building} /></div>
      </main>
      <Footer />
    </>
  );
}
