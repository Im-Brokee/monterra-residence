import Image from "next/image";
import Link from "next/link";
import type { Apartment } from "@/lib/types";
import { balconyLabel, formatArea, formatPln, statusLabel } from "@/lib/format";
import { getApartmentVisuals } from "@/lib/visuals";

export function ApartmentCard({ apartment }: { apartment: Apartment }) {
  const visuals = getApartmentVisuals(apartment);

  return (
    <article className="apartmentCard premiumApartmentCard">
      <div className="apartmentCardTop overlayTop">
        <span className={`statusPill ${apartment.status}`}>{statusLabel[apartment.status]}</span>
        <span className="unitCode">{apartment.unitNumber}</span>
      </div>

      <Link href={`/mieszkania/${apartment.slug}`} className="apartmentVisualLink" aria-label={`Zobacz ${apartment.unitNumber}`}>
        <div className="apartmentPhoto">
          <Image
            src={visuals.card}
            alt={`Wizualizacja mieszkania ${apartment.unitNumber}`}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="apartmentPhotoImage"
          />
          <div className="apartmentPhotoShade" />
          <span className="styleBadge">{apartment.styleName}</span>
          <div className="apartmentPhotoMeta">
            <span className="planBadge">plan 2D + widok 3D</span>
          </div>
          <div className="miniPlanFloating">
            <img src={apartment.floorplanUrl} alt={`Rzut ${apartment.unitNumber}`} loading="lazy" decoding="async" />
          </div>
        </div>
      </Link>

      <div className="apartmentCardBody">
        <div className="apartmentMetrics premiumMetrics">
          <strong>{formatArea(apartment.area)}</strong>
          <span>{apartment.rooms} {apartment.rooms === 1 ? "pokój" : apartment.rooms < 5 ? "pokoje" : "pokoi"}</span>
          <span>Piętro {apartment.floor}</span>
          <span>{balconyLabel[apartment.balconyType]} {apartment.balconyArea ? formatArea(apartment.balconyArea) : ""}</span>
        </div>
        <div className="apartmentPrice">
          <strong>{formatPln(apartment.price)}</strong>
          <span>{formatPln(apartment.pricePerSqm)}/m²</span>
        </div>
        <Link className="button buttonOutline full" href={`/mieszkania/${apartment.slug}`}>
          Zobacz mieszkanie
        </Link>
      </div>
    </article>
  );
}
