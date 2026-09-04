import { demoAddons, demoApartments } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { Addon, Apartment, TourRoom } from "@/lib/types";

function normalizeApartment(row: any): Apartment {
  const layout = Array.isArray(row.layout_types) ? row.layout_types[0] : row.layout_types;
  return {
    id: row.id,
    slug: row.slug,
    unitNumber: row.unit_number,
    building: row.building,
    floor: Number(row.floor),
    rooms: Number(row.rooms),
    area: Number(row.area),
    balconyType: row.balcony_type,
    balconyArea: Number(row.balcony_area ?? 0),
    status: row.status,
    price: Number(row.price),
    pricePerSqm: Number(row.price_per_sqm ?? Math.round(Number(row.price) / Number(row.area))),
    styleName: layout?.style_name ?? "Monterra",
    floorplanUrl: layout?.floorplan_url ?? "/demo/floorplans/premium-67.svg",
    cutawayUrl: layout?.cutaway_url ?? "/demo/cutaways/premium-67.svg",
    tourRooms: (layout?.tour_rooms ?? []) as TourRoom[],
    exposure: row.exposure ?? "Południowy zachód",
    ceilingHeight: Number(row.ceiling_height ?? 2.7),
    published: Boolean(row.published)
  };
}

export async function getApartments(): Promise<Apartment[]> {
  const supabase = await createClient();
  if (!supabase) return demoApartments;

  const { data, error } = await supabase
    .from("apartments")
    .select(`
      id, slug, unit_number, building, floor, rooms, area,
      balcony_type, balcony_area, status, price, price_per_sqm,
      exposure, ceiling_height, published,
      layout_types (style_name, floorplan_url, cutaway_url, tour_rooms)
    `)
    .eq("published", true)
    .order("price", { ascending: true });

  if (error || !data?.length) return demoApartments;
  return data.map(normalizeApartment);
}

export async function getApartment(slug: string): Promise<Apartment | null> {
  const supabase = await createClient();
  if (!supabase) return demoApartments.find((a) => a.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("apartments")
    .select(`
      id, slug, unit_number, building, floor, rooms, area,
      balcony_type, balcony_area, status, price, price_per_sqm,
      exposure, ceiling_height, published,
      layout_types (style_name, floorplan_url, cutaway_url, tour_rooms)
    `)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return demoApartments.find((a) => a.slug === slug) ?? null;
  }
  return normalizeApartment(data);
}

export async function getAddons(): Promise<Addon[]> {
  const supabase = await createClient();
  if (!supabase) return demoAddons;

  const { data, error } = await supabase
    .from("addons")
    .select("id, slug, name, description, category, selection_group, price_type, price_value, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return demoAddons;
  return data.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    category: row.category,
    selectionGroup: row.selection_group,
    priceType: row.price_type,
    priceValue: Number(row.price_value),
    active: Boolean(row.active)
  }));
}

export async function getAdminData() {
  const supabase = await createClient();
  if (!supabase) return { apartments: demoApartments, leads: [] };

  const [{ data: apartments }, { data: leads }] = await Promise.all([
    supabase
      .from("apartments")
      .select("id, slug, unit_number, building, floor, rooms, area, status, price, price_per_sqm, published")
      .order("unit_number"),
    supabase
      .from("leads")
      .select("id, created_at, name, phone, email, total_price, status, apartment_id")
      .order("created_at", { ascending: false })
      .limit(10)
  ]);

  return {
    apartments: (apartments ?? []).map((row: any) => ({
      id: row.id,
      slug: row.slug,
      unitNumber: row.unit_number,
      building: row.building,
      floor: Number(row.floor),
      rooms: Number(row.rooms),
      area: Number(row.area),
      status: row.status,
      price: Number(row.price),
      pricePerSqm: Number(row.price_per_sqm),
      published: Boolean(row.published)
    })),
    leads: leads ?? []
  };
}
