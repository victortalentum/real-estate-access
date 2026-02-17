import { findById } from "../../_lib/reservationsStore.js";

export default function handler(req, res) {
  try {
    const id = String(req.query?.id || "").trim();
    if (!id) return res.status(400).json({ error: "BAD_REQUEST", message: "Missing id param" });

    const reservation = findById(id);
    if (!reservation) return res.status(404).json({ error: "NOT_FOUND", message: `No reservation for id ${id}` });

    return res.status(200).json(reservation);
  } catch (e) {
    return res.status(500).json({ error: "INTERNAL", message: e?.message || String(e) });
  }
}
