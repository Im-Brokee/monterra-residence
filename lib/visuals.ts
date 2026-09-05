import type { Apartment, TourRoom } from "@/lib/types";

type ApartmentVisuals = {
  card: string;
  hero: string;
  gallery: { living: string; bedroom: string; bathroom: string };
  tourRooms: TourRoom[];
};

const presetByStyle: Record<string, ApartmentVisuals> = {
  "Studio Urban": {
    card: "/media/variants/studio-urban.webp",
    hero: "/media/variants/studio-urban.webp",
    gallery: {
      living: "/media/variants/studio-urban.webp",
      bedroom: "/media/variants/soft-minimal.webp",
      bathroom: "/media/variants/bath-soft.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/studio-urban.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-soft.webp" }
    ]
  },
  "Soft Minimal": {
    card: "/media/variants/soft-minimal.webp",
    hero: "/media/variants/soft-minimal.webp",
    gallery: {
      living: "/media/variants/soft-minimal.webp",
      bedroom: "/media/variants/bed-soft.webp",
      bathroom: "/media/variants/bath-soft.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/soft-minimal.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-soft.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-soft.webp" }
    ]
  },
  Scandinavian: {
    card: "/media/variants/scandinavian.webp",
    hero: "/media/variants/scandinavian.webp",
    gallery: {
      living: "/media/variants/scandinavian.webp",
      bedroom: "/media/variants/bed-nordic.webp",
      bathroom: "/media/variants/bath-soft.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/scandinavian.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-nordic.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-soft.webp" }
    ]
  },
  "Warm Modern": {
    card: "/media/variants/warm-modern.webp",
    hero: "/media/variants/warm-modern.webp",
    gallery: {
      living: "/media/variants/warm-modern.webp",
      bedroom: "/media/variants/bed-master.webp",
      bathroom: "/media/variants/bath-premium.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/warm-modern.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-master.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-premium.webp" }
    ]
  },
  "Natural Beige": {
    card: "/media/variants/natural-beige.webp",
    hero: "/media/variants/natural-beige.webp",
    gallery: {
      living: "/media/variants/natural-beige.webp",
      bedroom: "/media/variants/bed-soft.webp",
      bathroom: "/media/variants/bath-natural.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/natural-beige.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-soft.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-natural.webp" }
    ]
  },
  "Premium Light": {
    card: "/media/variants/premium-light.webp",
    hero: "/media/variants/premium-light.webp",
    gallery: {
      living: "/media/variants/premium-light.webp",
      bedroom: "/media/variants/bed-master.webp",
      bathroom: "/media/variants/bath-premium.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/premium-light.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-master.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-premium.webp" }
    ]
  },
  "Family Cozy": {
    card: "/media/variants/family-cozy.webp",
    hero: "/media/variants/family-cozy.webp",
    gallery: {
      living: "/media/variants/family-cozy.webp",
      bedroom: "/media/variants/bed-master.webp",
      bathroom: "/media/variants/bath-family.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/family-cozy.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-master.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-family.webp" }
    ]
  },
  "Elegant Stone": {
    card: "/media/variants/elegant-stone.webp",
    hero: "/media/variants/elegant-stone.webp",
    gallery: {
      living: "/media/variants/elegant-stone.webp",
      bedroom: "/media/variants/bed-nordic.webp",
      bathroom: "/media/variants/bath-premium.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/elegant-stone.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-nordic.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-premium.webp" }
    ]
  },
  "Luxury Dark": {
    card: "/media/variants/luxury-dark.webp",
    hero: "/media/variants/luxury-dark.webp",
    gallery: {
      living: "/media/variants/luxury-dark.webp",
      bedroom: "/media/variants/bed-master.webp",
      bathroom: "/media/variants/bath-premium.webp"
    },
    tourRooms: [
      { id: "living", name: "Salon z kuchnią", image: "/media/variants/luxury-dark.webp" },
      { id: "bedroom", name: "Sypialnia", image: "/media/variants/bed-master.webp" },
      { id: "bathroom", name: "Łazienka", image: "/media/variants/bath-premium.webp" }
    ]
  },
  "Penthouse Signature": {
    card: "/media/variants/penthouse-signature.webp",
    hero: "/media/variants/penthouse-signature.webp",
    gallery: {
      living: "/media/variants/penthouse-signature.webp",
      bedroom: "/media/variants/bed-master.webp",
      bathroom: "/media/variants/bath-premium.webp"
    },
    tourRooms: [
      { id: "living", name: "Strefa dzienna", image: "/media/variants/penthouse-signature.webp" },
      { id: "bedroom", name: "Master bedroom", image: "/media/variants/bed-master.webp" },
      { id: "bathroom", name: "Łazienka premium", image: "/media/variants/bath-premium.webp" }
    ]
  }
};

function fallbackByApartment(apartment: Pick<Apartment, "styleName" | "rooms" | "floor">): ApartmentVisuals {
  if (presetByStyle[apartment.styleName]) return presetByStyle[apartment.styleName];
  if (apartment.rooms >= 5) return presetByStyle["Penthouse Signature"];
  if (apartment.rooms >= 4) return presetByStyle["Family Cozy"];
  if (apartment.rooms === 3) return presetByStyle["Warm Modern"];
  if (apartment.rooms === 2) return presetByStyle["Soft Minimal"];
  return presetByStyle["Studio Urban"];
}

export function getApartmentVisuals(apartment: Pick<Apartment, "styleName" | "rooms" | "floor">): ApartmentVisuals {
  return fallbackByApartment(apartment);
}
