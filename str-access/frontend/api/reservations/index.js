import { readReservations, findByCode } from "../_lib/reservationsStore.js";

export default function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "GET") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const code = req.query?.code ? String(req.query.code) : "";

    if (code) {
      const found = findByCode(code);
      if (!found) return res.status(404).json({ error: "NOT_FOUND", code });
      return res.status(200).json(found);
    }

    return res.status(200).json(readReservations());
  } catch (e) {
    return res.status(500).json({ error: "INTERNAL", message: e?.message || String(e) });
  }
}
