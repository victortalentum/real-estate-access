import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const code = String(req.query.code ?? "").trim(); // /by-code/123 => "123"
    if (!code) return res.status(400).json({ ok: false, error: "Missing code" });

    const reservationsPath = path.join(process.cwd(), "reservations.json"); // frontend/reservations.json
    const reservations = JSON.parse(fs.readFileSync(reservationsPath, "utf-8"));

    const match = Array.isArray(reservations)
      ? reservations.find((r: any) => String(r?.code ?? "").trim() === code)
      : null;

    if (!match) return res.status(404).json({ ok: false, error: "Reservation not found" });

    return res.status(200).json({ ok: true, reservation: match });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? String(e) });
  }
}
