import type { MetadataRoute } from "next";
import { getApartments } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://monterra-residence.pl";
  const apartments = await getApartments();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/mieszkania`, changeFrequency: "daily", priority: 0.9 },
    ...apartments.map((apartment) => ({ url: `${base}/mieszkania/${apartment.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
