// frontend/api/reservations/index.js
import { getReservationByCode } from "../_lib/reservationsStore.js";

export default async function handler(req, res) {
  try {
    const code = String(req.query?.code ?? "").trim();

    // Si viene ?code=RES-123 -> devuelve esa reserva
    if (code) {
      const reservation = await getReservationByCode(code);
      if (!reservation) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
      return res.status(200).json({ ok: true, reservation });
    }

    // Si no hay code, devolvemos ayuda (por ahora)
    return res.status(200).json({
      ok: true,
      hint: "Use ?code=RES-123 or /api/reservations/by-id/:id",
    });
  } catch (e) {
    console.error("reservations/index error:", e);
    res.status(500).json({ ok: false, error: "INTERNAL", message: e?.message || String(e) });
  }
}
