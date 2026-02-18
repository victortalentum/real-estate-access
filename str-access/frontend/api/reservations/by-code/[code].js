// frontend/api/reservations/by-code/[code].js
import { getReservationByCode } from "../../_lib/reservationsStore.js";

export default async function handler(req, res) {
  try {
    const code = String(req.query?.code ?? "").trim();
    if (!code) return res.status(400).json({ ok: false, error: "MISSING_CODE" });

    const reservation = await getReservationByCode(code);
    if (!reservation) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.status(200).json({ ok: true, reservation });
  } catch (e) {
    console.error("reservations/by-code error:", e);
    res.status(500).json({ ok: false, error: "INTERNAL", message: e?.message || String(e) });
  }
}
