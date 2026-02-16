// DEPLOY_MARK: 2026-02-16T20:40Z 0

import type { VercelRequest, VercelResponse } from "@vercel/node";

const reservations = [
  { reservationId: "RES-123", name: "Victor", property: "NYC Apt" },
  { reservationId: "RES-456", name: "John", property: "Brooklyn Loft" }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ ok: false, error: "Missing id" });
  }

  const match = reservations.find(r => r.reservationId === id);

  if (!match) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }

  return res.status(200).json({ ok: true, reservation: match });
}
