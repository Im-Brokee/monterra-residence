import { demoAddons, demoApartments, demoInventory, demoPriceHistory } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type {
  Addon,
  AdminLead,
  Apartment,
  ConstructionUpdate,
  InventoryItem,
  PriceHistoryEntry,
  TourRoom
} from "@/lib/types";

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

  if (error || !data) return demoApartments.find((a) => a.slug === slug) ?? null;
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

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const supabase = await createClient();
  if (!supabase) return demoInventory;

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, code, type, name, description, building, floor, area, price, status, active")
    .eq("active", true)
    .order("type")
    .order("code");

  if (error || !data) return demoInventory;
  return data.map((row: any) => ({
    id: row.id,
    code: row.code,
    type: row.type,
    name: row.name,
    description: row.description ?? "",
    building: row.building ?? null,
    floor: row.floor == null ? null : Number(row.floor),
    area: row.area == null ? null : Number(row.area),
    price: Number(row.price),
    status: row.status,
    active: Boolean(row.active)
  }));
}

export async function getPriceHistory(apartmentId: string, currentPrice: number): Promise<PriceHistoryEntry[]> {
  const supabase = await createClient();
  if (!supabase) return demoPriceHistory(currentPrice);

  const { data, error } = await supabase
    .from("price_history")
    .select("id, old_price, new_price, changed_at")
    .eq("apartment_id", apartmentId)
    .order("changed_at", { ascending: true });

  if (error || !data?.length) return demoPriceHistory(currentPrice);
  return data.map((row: any) => ({
    id: row.id,
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    newPrice: Number(row.new_price),
    changedAt: row.changed_at
  }));
}

export async function getConstructionUpdates(): Promise<ConstructionUpdate[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("construction_updates")
    .select("id, title, body, progress, image_url, published_at, published")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(6);

  if (error || !data) return [];
  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    progress: Number(row.progress),
    imageUrl: row.image_url ?? null,
    publishedAt: row.published_at,
    published: Boolean(row.published)
  }));
}

export async function getAdminData() {
  const supabase = await createClient();
  if (!supabase) {
    return {
      projectId: null,
      apartments: demoApartments,
      leads: [] as AdminLead[],
      inventory: demoInventory,
      addons: demoAddons,
      priceHistory: [] as Array<PriceHistoryEntry & { apartmentId: string }>,
      construction: [] as ConstructionUpdate[]
    };
  }

  const { data: project } = await supabase.from("projects").select("id").order("created_at").limit(1).maybeSingle();

  const [apartmentsResult, leadsResult, inventoryResult, addonsResult, historyResult, constructionResult] = await Promise.all([
    supabase
      .from("apartments")
      .select("id, slug, unit_number, building, floor, rooms, area, status, price, price_per_sqm, published")
      .order("unit_number"),
    supabase
      .from("leads")
      .select("id, created_at, name, phone, email, total_price, status, apartment_id, selected_addons, selected_inventory")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("inventory_items")
      .select("id, code, type, name, description, building, floor, area, price, status, active")
      .order("type")
      .order("code"),
    supabase
      .from("addons")
      .select("id, slug, name, description, category, selection_group, price_type, price_value, active")
      .order("sort_order"),
    supabase
      .from("price_history")
      .select("id, apartment_id, old_price, new_price, changed_at")
      .order("changed_at", { ascending: false })
      .limit(100),
    supabase
      .from("construction_updates")
      .select("id, title, body, progress, image_url, published_at, published")
      .order("published_at", { ascending: false })
      .limit(20)
  ]);

  return {
    projectId: project?.id ?? null,
    apartments: (apartmentsResult.data ?? []).map((row: any) => ({
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
    leads: (leadsResult.data ?? []).map((row: any): AdminLead => ({
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      phone: row.phone,
      email: row.email,
      totalPrice: Number(row.total_price ?? 0),
      status: row.status,
      apartmentId: row.apartment_id ?? null,
      selectedAddons: row.selected_addons ?? [],
      selectedInventory: row.selected_inventory ?? []
    })),
    inventory: (inventoryResult.data ?? []).map((row: any): InventoryItem => ({
      id: row.id,
      code: row.code,
      type: row.type,
      name: row.name,
      description: row.description ?? "",
      building: row.building ?? null,
      floor: row.floor == null ? null : Number(row.floor),
      area: row.area == null ? null : Number(row.area),
      price: Number(row.price),
      status: row.status,
      active: Boolean(row.active)
    })),
    addons: (addonsResult.data ?? []).map((row: any): Addon => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description ?? "",
      category: row.category,
      selectionGroup: row.selection_group,
      priceType: row.price_type,
      priceValue: Number(row.price_value),
      active: Boolean(row.active)
    })),
    priceHistory: (historyResult.data ?? []).map((row: any) => ({
      id: row.id,
      apartmentId: row.apartment_id,
      oldPrice: row.old_price == null ? null : Number(row.old_price),
      newPrice: Number(row.new_price),
      changedAt: row.changed_at
    })),
    construction: (constructionResult.data ?? []).map((row: any): ConstructionUpdate => ({
      id: row.id,
      title: row.title,
      body: row.body ?? "",
      progress: Number(row.progress),
      imageUrl: row.image_url ?? null,
      publishedAt: row.published_at,
      published: Boolean(row.published)
    }))
  };
}
