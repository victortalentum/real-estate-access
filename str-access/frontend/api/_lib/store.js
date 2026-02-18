import Redis from "ioredis";

let redis;
function getRedis() {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("Missing REDIS_URL");
  redis = new Redis(url, { maxRetriesPerRequest: 2 });
  return redis;
}

export async function cacheSet(key, value, ttlSeconds = 60 * 60 * 24 * 7) {
  const r = getRedis();
  await r.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function cacheGet(key) {
  const r = getRedis();
  const raw = await r.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
