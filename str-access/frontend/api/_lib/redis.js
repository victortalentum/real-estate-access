import Redis from "ioredis";

let client;

export function getRedis() {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) throw new Error("Missing REDIS_URL env var");

  client = new Redis(url, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    // Vercel serverless: evita reconexiones eternas
    retryStrategy(times) {
      if (times >= 3) return null;
      return 200;
    },
  });

  return client;
}
