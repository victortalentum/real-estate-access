import type { VercelRequest, VercelResponse } from "@vercel/node";
import { findById } from "../../_lib/reservationsStore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const id = String(req.query.id ?? "").trim();
    if (!id) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "Missing id param" });
    }

    const reservation = await findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "NOT_FOUND", message: `No reservation for id ${id}` });
    }

    return res.status(200).json(reservation);
  } catch (err: any) {
    return res.status(500).json({ error: "INTERNAL", message: err?.message ?? String(err) });
  }
}
