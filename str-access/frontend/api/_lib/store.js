// frontend/api/_lib/store.js

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const REDIS_URL = mustEnv("REDIS_URL");

// Redis REST compatible (Upstash-style). Si tu URL ya es Upstash, funcionará.
// Si tu REDIS_URL es otro formato, dímelo y lo adapto.
function getBase(url) {
  // Upstash REST suele ser https://...upstash.io
  return url.replace(/\/+$/, "");
}

async function redisGet(key) {
  const base = getBase(REDIS_URL);
  const res = await fetch(`${base}/get/${encodeURIComponent(key)}`);
  const data = await res.json();
  return data?.result ?? null;
}

async function redisSet(key, value, ttlSeconds = 60 * 60 * 24 * 7) {
  const base = getBase(REDIS_URL);
  // set/<key>/<value>
  const res = await fetch(
    `${base}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${ttlSeconds}`
  );
  const data = await res.json();
  return data;
}

export async function getReservationCached(reservationId) {
  const key = `reservation:${reservationId}`;
  const raw = await redisGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setReservationCached(reservationId, obj, ttlSeconds) {
  const key = `reservation:${reservationId}`;
  await redisSet(key, JSON.stringify(obj), ttlSeconds);
}
