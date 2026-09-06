import Image from "next/image";
import Link from "next/link";
import type { Apartment } from "@/lib/types";
import { balconyLabel, formatArea, formatPln, statusLabel } from "@/lib/format";

function visualForApartment(apartment: Apartment) {
  if (apartment.tourRooms[0]?.image) return apartment.tourRooms[0].image;
  if (apartment.rooms >= 4) return "/media/bedroom.webp";
  if (apartment.rooms === 3) return "/media/living.webp";
  if (apartment.floor >= 4) return "/media/aerial-evening.webp";
  return "/media/living.webp";
}

export function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <article className="apartmentCard premiumApartmentCard">
      <div className="apartmentCardTop overlayTop">
        <span className={`statusPill ${apartment.status}`}>{statusLabel[apartment.status]}</span>
        <span className="unitCode">{apartment.unitNumber}</span>
      </div>

      <Link
        href={`/mieszkania/${apartment.slug}`}
        className="apartmentVisualLink"
        aria-label={`Zobacz ${apartment.unitNumber}`}
      >
        <div className="apartmentPhoto">
          <Image
            src={visualForApartment(apartment)}
            alt={`Wnętrze mieszkania ${apartment.unitNumber}`}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="apartmentPhotoImage"
          />
          <div className="apartmentPhotoShade" />
          <span className="styleBadge">{apartment.styleName}</span>
          <div className="tourFloatingBadge">
            <span>Spacer</span>
            <strong>{apartment.tourRooms.length} pom.</strong>
          </div>
        </div>
      </Link>

      <div className="apartmentCardBody">
        <div className="apartmentMetrics">
          <strong>{formatArea(apartment.area)}</strong>
          <span>{apartment.rooms} {apartment.rooms === 1 ? "pokój" : "pokoje"}</span>
          <span>Piętro {apartment.floor}</span>
          <span>
            {balconyLabel[apartment.balconyType]} {apartment.balconyArea ? formatArea(apartment.balconyArea) : ""}
          </span>
        </div>
        <div className="apartmentPrice">
          <strong>{formatPln(apartment.price)}</strong>
          <span>{formatPln(apartment.pricePerSqm)}/m²</span>
        </div>
        <Link className="button buttonOutline full" href={`/mieszkania/${apartment.slug}`}>
          Otwórz spacer i cenę
        </Link>
      </div>
    </article>
  );
}
