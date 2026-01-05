import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as fs from "node:fs";
import * as path from "node:path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const code = String(req.query.code ?? "");

  const filePath = path.join(process.cwd(), "reservations.json");

  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ ok: false, error: `reservations.json not found at ${filePath}` });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const found = Array.isArray(data) ? data.find((r: any) => String(r.code) === code) : null;

  if (!found) return res.status(404).json({ ok: false, error: "Not found" });

  return res.status(200).json({ ok: true, reservation: found });
}
