import type { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const file = path.join(process.cwd(), "reservations.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  const { id } = req.query;
  const found = Array.isArray(data) ? data.find((r: any) => r.id === id) : null;

  if (!found) return res.status(404).json({ error: "Not found" });
  return res.status(200).json(found);
}
