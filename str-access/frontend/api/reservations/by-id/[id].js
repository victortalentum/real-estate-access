import { cacheGet, cacheSet } from "../../_lib/store.js";
import { hospitableFetch, normalizeReservation } from "../../_lib/hospitable.js";

export default async function handler(req, res) {
  try {
    const id = req.query?.id ? String(req.query.id) : "";
    if (!id) return res.status(400).json({ ok: false, error: "Missing id" });

    // 1) Redis primero
    const cached = await cacheGet(`res:${id}`);
    if (cached?.normalized) {
      return res.status(200).json({ ok: true, source: "cache", reservation: cached.normalized });
    }

    // 2) Si no hay cache, pide a Hospitable
    // Endpoint exacto puede variar; este es el patrón típico:
    const raw = await hospitableFetch(`/reservations/${encodeURIComponent(id)}`);

    // A veces viene { data: {...} }
    const obj = raw?.data ?? raw;
    const normalized = normalizeReservation(obj);

    if (!normalized.reservationId) {
      return res.status(404).json({ ok: false, error: "Reservation not found (no id returned)" });
    }

    // 3) Cachea
    await cacheSet(`res:${id}`, { normalized, raw: obj });

    res.status(200).json({ ok: true, source: "hospitable", reservation: normalized });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
