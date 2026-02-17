import type { VercelRequest, VercelResponse } from "@vercel/node";

const reservations = [
  { reservationId: "RES-123", name: "Victor", property: "NYC Apt" },
  { reservationId: "RES-456", name: "John", property: "Brooklyn Loft" },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const raw = (req.query?.id ?? "") as string | string[];
    const id = Array.isArray(raw) ? raw[0] : raw;

    if (!id) {
      return res.status(400).json({ ok: false, error: "Missing id", query: req.query });
    }

    const match = reservations.find((r) => r.reservationId === id);

    if (!match) {
      return res.status(404).json({ ok: false, error: "Not found", id });
    }

    return res.status(200).json({ ok: true, reservation: match });
  } catch (e: any) {
    // Esto es LO importante: que el crash quede registrado en Vercel Logs
    console.error("by-id handler crashed:", e);
    return res.status(500).json({
      ok: false,
      error: e?.message ?? String(e),
      stack: e?.stack ?? null,
    });
  }
}
