import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile } from "node:fs/promises";
import path from "node:path";

type Reservation = {
  reservationId: string;
  code?: string;       // opcional si quieres
  name?: string;
  property?: string;
  // añade campos si quieres
};

async function loadReservations(): Promise<Reservation[]> {
  // Root Directory en Vercel = "frontend"
  const filePath = path.join(process.cwd(), "reservations.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as Reservation[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code, id } = req.query;

    const reservations = await loadReservations();

    if (typeof code === "string") {
      const r = reservations.find(x => x.reservationId === code || x.code === code);
      if (!r) return res.status(404).json({ error: "NOT_FOUND", code });
      return res.status(200).json(r);
    }

    if (typeof id === "string") {
      const r = reservations.find(x => x.reservationId === id);
      if (!r) return res.status(404).json({ error: "NOT_FOUND", id });
      return res.status(200).json(r);
    }

    return res.status(400).json({ error: "MISSING_QUERY", hint: "Use ?code=RES-123 or ?id=RES-123" });
  } catch (e: any) {
    // Esto te deja el error visible en Vercel logs también
    return res.status(500).json({
      error: "INTERNAL",
      message: e?.message ?? String(e)
    });
  }
}
