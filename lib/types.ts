export type ApartmentStatus = "available" | "reserved" | "sold";
export type PriceType = "fixed" | "per_sqm";

export type TourRoom = {
  id: string;
  name: string;
  image: string;
};

export type Apartment = {
  id: string;
  slug: string;
  unitNumber: string;
  building: string;
  floor: number;
  rooms: number;
  area: number;
  balconyType: "balcony" | "terrace" | "garden" | "none";
  balconyArea: number;
  status: ApartmentStatus;
  price: number;
  pricePerSqm: number;
  styleName: string;
  floorplanUrl: string;
  cutawayUrl: string;
  tourRooms: TourRoom[];
  exposure: string;
  ceilingHeight: number;
  published: boolean;
};

export type Addon = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "parking" | "storage" | "finish" | "smart";
  selectionGroup: string;
  priceType: PriceType;
  priceValue: number;
  active: boolean;
};

export type LeadPayload = {
  apartmentId: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  selectedAddons: Array<{
    id: string;
    slug: string;
    name: string;
    price: number;
  }>;
  basePrice: number;
  addonsTotal: number;
  totalPrice: number;
};
