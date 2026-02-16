import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ error: "Missing code" });
    }

    // reservations.json está en /frontend/reservations.json
    const filePath = path.join(process.cwd(), "reservations.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    const reservation = Array.isArray(data)
      ? data.find((r: any) => String(r.code) === String(code))
      : null;

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found", code });
    }

    return res.status(200).json(reservation);
  } catch (e: any) {
    return res.status(500).json({ error: "Server error", details: e?.message });
  }
}
