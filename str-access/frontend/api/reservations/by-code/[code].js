import { findByCode } from "../../_lib/reservationsStore.js";

export default function handler(req, res) {
  try {
    const code = String(req.query?.code || "").trim();
    if (!code) return res.status(400).json({ error: "BAD_REQUEST", message: "Missing code param" });

    const reservation = findByCode(code);
    if (!reservation) return res.status(404).json({ error: "NOT_FOUND", message: `No reservation for code ${code}` });

    return res.status(200).json(reservation);
  } catch (e) {
    return res.status(500).json({ error: "INTERNAL", message: e?.message || String(e) });
  }
}
