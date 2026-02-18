import { redis } from "../_lib/store.js";

export default async function handler(req, res) {
  try {
    const hasSecret = !!process.env.HOSPITABLE_WEBHOOK_SECRET;
    const r = redis();
    await r.ping();

    return res.status(200).json({
      ok: true,
      hasWebhookSecret: hasSecret,
      redis: "ok",
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
