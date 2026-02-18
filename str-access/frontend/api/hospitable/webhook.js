import { cacheSet } from "../_lib/store.js";
import { normalizeReservation } from "../_lib/hospitable.js";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  try {
    const expected = process.env.HOSPITABLE_WEBHOOK_SECRET;
    if (!expected) return res.status(500).json({ ok: false, error: "Missing HOSPITABLE_WEBHOOK_SECRET" });

    const got = req.query?.secret;
    if (got !== expected) return res.status(401).json({ ok: false, error: "Invalid webhook secret" });

    // Hospitable envía distintos eventos. Guardamos si hay “reservation” o “data”
    const payload = req.body || {};
    const candidate = payload.reservation || payload.data || payload;

    // Normaliza y guarda por ID numérico (el que usas en la URL)
    const normalized = normalizeReservation(candidate);
    if (!normalized.reservationId) {
      return res.status(200).json({ ok: true, stored: false, note: "No reservation id in payload" });
    }

    // Guardamos también el payload completo por si luego quieres más campos
    await cacheSet(`res:${normalized.reservationId}`, {
      normalized,
      raw: candidate
    });

    res.status(200).json({ ok: true, stored: true, reservationId: normalized.reservationId });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
