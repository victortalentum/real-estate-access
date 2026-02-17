import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Reservation = {
  id?: string;
  code?: string;
  [key: string]: any;
};

async function loadReservations(): Promise<Reservation[]> {
  // Ruta absoluta al reservations.json dentro del bundle de la función
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataPath = path.join(__dirname, "..", "reservations.json"); // ../reservations.json (porque estás en /api/reservations/index.ts)

  const raw = await readFile(dataPath, "utf8");
  const data = JSON.parse(raw);

  // Acepta tanto array como { reservations: [...] }
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.reservations)) return data.reservations;

  return [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const reservations = await loadReservations();

    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    const id = typeof req.query.id === "string" ? req.query.id : undefined;

    if (code) {
      const found = reservations.find((r) => r.code === code || r.id === code);
      if (!found) return res.status(404).json({ error: "NOT_FOUND", message: "Reservation not found" });
      return res.status(200).json(found);
    }

    if (id) {
      const found = reservations.find((r) => r.id === id);
      if (!found) return res.status(404).json({ error: "NOT_FOUND", message: "Reservation not found" });
      return res.status(200).json(found);
    }

    // Si no pasas query, devuelve todo (útil para debug)
    return res.status(200).json({ count: reservations.length, reservations });
  } catch (err: any) {
    return res.status(500).json({
      error: "INTERNAL",
      message: err?.message || String(err),
    });
  }
}
