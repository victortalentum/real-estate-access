// frontend/api/reservations/by-id/[id].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { findById } from "../../_lib/reservationsStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const id = String(req.query.id ?? "").trim();
    if (!id) return res.status(400).json({ error: "BAD_REQUEST", message: "Missing id param" });

    const found = findById(id);
    if (!found) return res.status(404).json({ error: "NOT_FOUND", id });

    return res.status(200).json(found);
  } catch (e: any) {
    return res.status(500).json({ error: "INTERNAL", message: e?.message || String(e) });
  }
}
