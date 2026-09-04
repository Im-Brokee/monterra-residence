import type { Addon, Apartment } from "@/lib/types";

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
