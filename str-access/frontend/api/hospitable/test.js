// frontend/api/hospitable/test.js

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  try {
    const apiKey = process.env.HOSPITABLE_API_KEY;
    if (!apiKey) return json(res, 500, { ok: false, error: "Missing HOSPITABLE_API_KEY" });

    // OJO: no sé tu endpoint exacto de Hospitable (depende del plan/API),
    // así que probamos con un "list reservations" común.
    const base = process.env.HOSPITABLE_API_BASE || "https://api.hospitable.com/v1";
    const url = `${base}/reservations`;

    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    });

    const text = await r.text();
    let data = null;
    try { data = JSON.parse(text); } catch {}

    return json(res, 200, {
      ok: r.ok,
      status: r.status,
      contentType: r.headers.get("content-type"),
      sample: data ?? text.slice(0, 400),
      hint: "Si status=401, API key mal. Si status=404, el base/endpoint no existe en tu API.",
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || String(e) });
  }
}
