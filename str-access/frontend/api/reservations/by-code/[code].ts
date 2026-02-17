import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const codeParam = req.query.code;
    const code = Array.isArray(codeParam) ? codeParam[0] : String(codeParam ?? "");
    const clean = code.trim();

    if (!clean) {
      return res.status(400).json({ ok: false, error: "Missing code" });
    }

    // En Vercel, process.cwd() es el root del "Root Directory" (frontend/)
    const reservationsPath = path.join(process.cwd(), "reservations.json");
    const reservations = JSON.parse(fs.readFileSync(reservationsPath, "utf-8"));

    const match = Array.isArray(reservations)
      ? reservations.find((r: any) => String(r.code ?? "").trim() === clean)
      : null;

    if (!match) {
      return res.status(404).json({ ok: false, error: "Reservation not found" });
    }

    return res.status(200).json({ ok: true, reservation: match });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? String(e) });
  }
}
