import type { Addon, Apartment, InventoryItem, PriceHistoryEntry } from "@/lib/types";

const layouts = [
  ["studio-27", 27, 1, "Studio Urban"],
  ["compact-34", 34, 2, "Soft Minimal"],
  ["city-42", 42, 2, "Scandinavian"],
  ["family-51", 51, 3, "Warm Modern"],
  ["family-58", 58, 3, "Natural Beige"],
  ["premium-67", 67, 3, "Premium Light"],
  ["family-76", 76, 4, "Family Cozy"],
  ["premium-88", 88, 4, "Elegant Stone"],
  ["apartment-102", 102, 4, "Luxury Dark"],
  ["penthouse-121", 121, 5, "Penthouse Signature"]
] as const;

const basePrices = [449000, 519000, 589000, 699000, 785000, 949000, 1069000, 1259000, 1499000, 1890000];

export const demoApartments: Apartment[] = layouts.map((layout, index) => {
  const [code, area, rooms, styleName] = layout;
  const floor = Math.min(index, 5);
  const balconyType = index === 0 ? "garden" : index >= 7 ? "terrace" : "balcony";
  const balconyArea = [12.5, 6.8, 7.2, 8.1, 9.3, 15.6, 16.9, 20.1, 25.8, 38.7][index];
  const price = basePrices[index];
  const unitNumber = `A.${floor}.${String(index + 1).padStart(2, "0")}`;
  return {
    id: `demo-${index + 1}`,
    slug: unitNumber.toLowerCase().replaceAll(".", "-"),
    unitNumber,
    building: "A",
    floor,
    rooms,
    area,
    balconyType,
    balconyArea,
    status: index === 4 || index === 8 ? "reserved" : "available",
    price,
    pricePerSqm: Math.round(price / area),
    styleName,
    floorplanUrl: `/demo/floorplans/${code}.svg`,
    cutawayUrl: `/demo/cutaways/${code}.svg`,
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/demo/rooms/living.svg" },
      { id: "bedroom", name: "Sypialnia", image: "/demo/rooms/bedroom.svg" },
      { id: "bathroom", name: "Łazienka", image: "/demo/rooms/bathroom.svg" }
    ],
    exposure: index % 2 === 0 ? "Południowy zachód" : "Południowy wschód",
    ceilingHeight: index >= 8 ? 2.9 : 2.7,
    published: true
  };
});

export const demoAddons: Addon[] = [
  {
    id: "addon-garage",
    slug: "miejsce-garazowe",
    name: "Miejsce postojowe w garażu",
    description: "Numerowane miejsce w garażu podziemnym.",
    category: "parking",
    selectionGroup: "parking",
    priceType: "fixed",
    priceValue: 45000,
    active: true
  },
  {
    id: "addon-outdoor",
    slug: "miejsce-naziemne",
    name: "Miejsce postojowe naziemne",
    description: "Miejsce na parkingu zewnętrznym.",
    category: "parking",
    selectionGroup: "parking",
    priceType: "fixed",
    priceValue: 25000,
    active: true
  },
  {
    id: "addon-storage",
    slug: "komorka-lokatorska",
    name: "Komórka lokatorska 4,2 m²",
    description: "Prywatna komórka lokatorska blisko garażu.",
    category: "storage",
    selectionGroup: "storage",
    priceType: "fixed",
    priceValue: 18000,
    active: true
  },
  {
    id: "addon-smart",
    slug: "smart-home-plus",
    name: "Pakiet Smart Home+",
    description: "Sterowanie ogrzewaniem, światłem i roletami.",
    category: "smart",
    selectionGroup: "smart",
    priceType: "fixed",
    priceValue: 9900,
    active: true
  },
  {
    id: "addon-comfort",
    slug: "wykonczenie-comfort",
    name: "Wykończenie Comfort",
    description: "Kompleksowe wykończenie mieszkania pod klucz.",
    category: "finish",
    selectionGroup: "finish",
    priceType: "per_sqm",
    priceValue: 1100,
    active: true
  },
  {
    id: "addon-premium",
    slug: "wykonczenie-premium",
    name: "Wykończenie Premium",
    description: "Materiały premium, zabudowy i rozszerzony pakiet wnętrz.",
    category: "finish",
    selectionGroup: "finish",
    priceType: "per_sqm",
    priceValue: 1600,
    active: true
  }
];


export const demoInventory: InventoryItem[] = [
  { id: "inv-g101", code: "G-101", type: "parking", name: "Miejsce postojowe G-101", description: "Garaż podziemny · blisko klatki A", building: "A", floor: -1, area: null, price: 45000, status: "available", active: true },
  { id: "inv-g102", code: "G-102", type: "parking", name: "Miejsce postojowe G-102", description: "Garaż podziemny · szerokie miejsce", building: "A", floor: -1, area: null, price: 49000, status: "available", active: true },
  { id: "inv-g103", code: "G-103", type: "parking", name: "Miejsce postojowe G-103", description: "Garaż podziemny · przy windzie", building: "A", floor: -1, area: null, price: 52000, status: "reserved", active: true },
  { id: "inv-P01", code: "P-01", type: "parking", name: "Miejsce naziemne P-01", description: "Parking zewnętrzny", building: null, floor: 0, area: null, price: 25000, status: "available", active: true },
  { id: "inv-k01", code: "K-01", type: "storage", name: "Komórka K-01", description: "Komórka lokatorska 3,2 m²", building: "A", floor: -1, area: 3.2, price: 14500, status: "available", active: true },
  { id: "inv-k02", code: "K-02", type: "storage", name: "Komórka K-02", description: "Komórka lokatorska 4,2 m²", building: "A", floor: -1, area: 4.2, price: 18000, status: "available", active: true },
  { id: "inv-k03", code: "K-03", type: "storage", name: "Komórka K-03", description: "Komórka lokatorska 5,1 m²", building: "A", floor: -1, area: 5.1, price: 22000, status: "sold", active: true }
];

export function demoPriceHistory(apartmentPrice: number): PriceHistoryEntry[] {
  const now = new Date();
  return [4, 3, 2, 1, 0].map((monthsAgo, index) => {
    const d = new Date(now);
    d.setMonth(now.getMonth() - monthsAgo);
    const factor = [0.94, 0.96, 0.97, 0.985, 1][index];
    return {
      id: `demo-history-${index}`,
      oldPrice: index === 0 ? null : Math.round(apartmentPrice * [0.92, 0.94, 0.96, 0.97, 0.985][index]),
      newPrice: Math.round(apartmentPrice * factor),
      changedAt: d.toISOString()
    };
  });
}
