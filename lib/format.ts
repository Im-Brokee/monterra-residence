export function formatPln(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatArea(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 1
  }).format(value) + " m²";
}

export const statusLabel = {
  available: "Wolne",
  reserved: "Rezerwacja",
  sold: "Sprzedane"
} as const;

export const balconyLabel = {
  balcony: "Balkon",
  terrace: "Taras",
  garden: "Ogród",
  none: "—"
} as const;
