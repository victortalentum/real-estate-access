import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, service: "str-access", ts: new Date().toISOString() });
}
