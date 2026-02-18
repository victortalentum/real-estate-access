// frontend/api/reservations/by-id/[id].js
import { getReservationById } from "../../_lib/reservationsStore.js";

export default async function handler(req, res) {
  try {
    const id = String(req.query?.id ?? "").trim();
    if (!id) return res.status(400).json({ ok: false, error: "MISSING_ID" });

    const reservation = await getReservationById(id);
    if (!reservation) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.status(200).json({ ok: true, reservation });
  } catch (e) {
    console.error("reservations/by-id error:", e);
    res.status(500).json({ ok: false, error: "INTERNAL", message: e?.message || String(e) });
  }
}
