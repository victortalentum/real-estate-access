import { getRedis } from "../../_lib/redis";
import { json, methodNotAllowed } from "../../_lib/json";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res);

  const id = req.query?.id ? String(req.query.id) : "";
  if (!id) return json(res, 400, { ok: false, error: "Missing id" });

  const redis = getRedis();

  // Buscamos por varias claves (porque 544... es “public number”)
  const keysToTry = [
    `res:public:${id}`,
    `res:${id}`,
    `res:internal:${id}`, // por si alguien usa internal
  ];

  let raw = null;
  let hitKey = null;

  for (const k of keysToTry) {
    raw = await redis.get(k);
    if (raw) { hitKey = k; break; }
  }

  if (!raw) {
    return json(res, 404, {
      ok: false,
      error: "Reservation not found in cache yet",
      hint: "Trigger Hospitable webhook Test so we store it in Redis",
      tried: keysToTry,
    });
  }

  let reservation;
  try {
    reservation = JSON.parse(raw);
  } catch {
    return json(res, 500, { ok: false, error: "Corrupted reservation in cache" });
  }

  return json(res, 200, { ok: true, hitKey, reservation });
}
