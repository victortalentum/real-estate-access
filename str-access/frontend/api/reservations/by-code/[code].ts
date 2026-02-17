// frontend/api/reservations/by-code/[code].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { findByCode } from "../../_lib/reservationsStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const code = String(req.query.code ?? "").trim();
    if (!code) return res.status(400).json({ error: "BAD_REQUEST", message: "Missing code param" });

    const found = findByCode(code);
    if (!found) return res.status(404).json({ error: "NOT_FOUND", code });

    return res.status(200).json(found);
  } catch (e: any) {
    return res.status(500).json({ error: "INTERNAL", message: e?.message || String(e) });
  }
}
