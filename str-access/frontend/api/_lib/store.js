// frontend/api/_lib/store.js
import Redis from "ioredis";

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

let redis;
function getRedis() {
  if (!redis) {
    const url = mustEnv("REDIS_URL"); // normalmente redis://...
    redis = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  }
  return redis;
}

export async function getReservationCached(reservationId) {
  const r = getRedis();
  await r.connect().catch(() => {});
  const raw = await r.get(`reservation:${reservationId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setReservationCached(reservationId, obj, ttlSeconds = 60 * 60 * 24 * 7) {
  const r = getRedis();
  await r.connect().catch(() => {});
  await r.set(`reservation:${reservationId}`, JSON.stringify(obj), "EX", ttlSeconds);
}
