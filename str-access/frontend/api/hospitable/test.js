export default async function handler(req, res) {
  try {
    const k = process.env.HOSPITABLE_API_KEY;
    res.status(200).json({
      ok: true,
      hasKey: !!k,
      hasRedis: !!process.env.REDIS_URL,
      hasWebhookSecret: !!process.env.HOSPITABLE_WEBHOOK_SECRET
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
