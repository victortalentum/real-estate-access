import type { VercelRequest, VercelResponse } from "@vercel/node";
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const code = String(req.query.code || "").trim();
    if (!code) {
      return res.status(400).json({ ok: false, error: "Missing code" });
    }

    const filePath = path.join(process.cwd(), "backend", "reservations.json");
    const raw = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(raw);

    const list = Array.isArray(data) ? data : data.reservations ?? [];

    const reservation = list.find(
      (r: any) =>
        String(r.code) === code ||
        String(r.reservationCode) === code ||
        String(r.id) === code
    );

    if (!reservation) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    return res.status(200).json({ ok: true, reservation });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message ?? "Server error" });
  }
}
