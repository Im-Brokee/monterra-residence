import Link from "next/link";
import type { Apartment } from "@/lib/types";
import { balconyLabel, formatArea, formatPln, statusLabel } from "@/lib/format";

export function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <article className="apartmentCard">
      <div className="apartmentCardTop">
        <span className={`statusPill ${apartment.status}`}>{statusLabel[apartment.status]}</span>
        <span className="unitCode">{apartment.unitNumber}</span>
      </div>
      <div className="planPreview">
        <span className="styleBadge">{apartment.styleName}</span>
        <img src={apartment.floorplanUrl} alt={`Rzut mieszkania ${apartment.unitNumber}`} loading="lazy" decoding="async" />
      </div>
      <div className="apartmentMetrics">
        <strong>{formatArea(apartment.area)}</strong>
        <span>{apartment.rooms} {apartment.rooms === 1 ? "pokój" : "pokoje"}</span>
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
    </article>
  );
}
