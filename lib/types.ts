export type ApartmentStatus = "available" | "reserved" | "sold";
export type PriceType = "fixed" | "per_sqm";
export type InventoryStatus = "available" | "reserved" | "sold";
export type LeadStatus = "new" | "contacted" | "meeting" | "won" | "lost";

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

export type InventoryItem = {
  id: string;
  code: string;
  type: "parking" | "storage";
  name: string;
  description: string;
  building: string | null;
  floor: number | null;
  area: number | null;
  price: number;
  status: InventoryStatus;
  active: boolean;
};

export type PriceHistoryEntry = {
  id: number | string;
  oldPrice: number | null;
  newPrice: number;
  changedAt: string;
};

export type ConstructionUpdate = {
  id: string;
  title: string;
  body: string;
  progress: number;
  imageUrl: string | null;
  publishedAt: string;
  published: boolean;
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
  selectedInventory: Array<{
    id: string;
    code: string;
    type: "parking" | "storage";
    name: string;
    price: number;
  }>;
  basePrice: number;
  addonsTotal: number;
  inventoryTotal: number;
  totalPrice: number;
};

export type AdminLead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  totalPrice: number;
  status: LeadStatus;
  apartmentId: string | null;
  selectedAddons: LeadPayload["selectedAddons"];
  selectedInventory: LeadPayload["selectedInventory"];
};
