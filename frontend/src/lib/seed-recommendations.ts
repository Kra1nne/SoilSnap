import api from "../utils/api";
import { putData, getData } from "./offline-db";

const SOILS = [ "Clay","Loam","Loamy Sand","Sand","Sandy Clay Loam","Sandy Loam","Silt","Silty Clay","Silty Loam" ];
const IMAGE_CACHE = "soil-snap-images-v1";

export async function seedRecommendationsIfMissing() {
  if (!navigator.onLine) return;
  try {
    const existing = await getData(`crop-rec-${SOILS[0]}`);
    if (existing && existing.recommendations) return;

    for (const soil of SOILS) {
      try {
        const res = await api.post("/api/crop/recommendation", { soil });
        const recs = res?.data?.recommendations || [];

        // cache each crop image in Cache Storage if present
        const cache = await caches.open(IMAGE_CACHE);
        for (const c of recs) {
          if (!c?.image) continue;
          const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "";
          const imageUrl = c.image.startsWith("http") || c.image.startsWith("data:")
            ? c.image
            : (c.image.startsWith("/") ? `${apiBase}${c.image}` : `${apiBase}/uploads/crops/${c.image}`.replace(/([^:]\/)\/+/g, "$1"));
          try {
            const r = await fetch(imageUrl, { mode: "cors" });
            if (r.ok) await cache.put(imageUrl, r.clone());
          } catch (e) {
            console.warn("Image cache failed:", imageUrl, e);
          }
        }

        // still store recommendations metadata in IDB for offline use
        await putData({ id: `crop-rec-${soil}`, soil, recommendations: recs });
        console.log("Seeded (client):", soil);
      } catch (err) {
        console.warn("Seed (client) failed for", soil, err);
      }
    }
  } catch (e) {
    console.warn("Seed (client) failed", e);
  }
}