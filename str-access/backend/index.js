import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// ============================================================
// ✅ FIX WINDOWS: __dirname correcto (evita /C:/... raro)
// ============================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// Files (usa rutas estables)
// ============================================================
const DATA_FILE =
  process.env.RESERVATIONS_FILE || path.resolve(__dirname, "reservations.json");

const PROPERTIES_FILE =
  process.env.PROPERTIES_FILE || path.resolve(__dirname, "properties.json");

// ============================================================
// CORS (para Vite en 5173)
// ============================================================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ============================================================
// Raw body + JSON parser
// ============================================================
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  })
);

// ============================================================
// Storage (reservations.json)
// ============================================================
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ byCode: {}, byId: {} }, null, 2));
    return;
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
  if (!raw) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ byCode: {}, byId: {} }, null, 2));
  }
}

function readDB() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const db = JSON.parse(raw);
    if (!db.byCode) db.byCode = {};
    if (!db.byId) db.byId = {};
    return db;
  } catch (e) {
    console.error("[storage] readDB error:", e);
    return { byCode: {}, byId: {} };
  }
}

function writeDB(db) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function upsertReservation({ id, code, payload }) {
  const db = readDB();

  const record = {
    id,
    code,
    updatedAt: new Date().toISOString(),
    payload,
  };

  if (code) db.byCode[String(code)] = record;
  if (id) db.byId[String(id)] = record;

  writeDB(db);
  return record;
}

// ============================================================
// Properties (properties.json) ✅ SOLO 1 implementación
// Estructura esperada:
// {
//   "defaults": { "agentUrl": null, "photos": [], "mapAddress": "" },
//   "byCode": { "123": { "mapAddress": "...", "photos": [...] } },
//   "byPropertyId": { "prop_jersey_001": { ... } }
// }
// ============================================================
function ensurePropertiesFile() {
  const dir = path.dirname(PROPERTIES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(PROPERTIES_FILE)) {
    const initial = {
      defaults: { agentUrl: null, photos: [], mapAddress: "" },
      byCode: {},
      byPropertyId: {},
    };
    fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(initial, null, 2));
  }
}

function readProperties() {
  try {
    ensurePropertiesFile();
    const raw = fs.readFileSync(PROPERTIES_FILE, "utf-8").trim();
    const obj = raw ? JSON.parse(raw) : {};
    if (!obj.defaults) obj.defaults = { agentUrl: null, photos: [], mapAddress: "" };
    if (!obj.byCode) obj.byCode = {};
    if (!obj.byPropertyId) obj.byPropertyId = {};
    return obj;
  } catch (e) {
    console.error("[properties] readProperties error:", e);
    return { defaults: { agentUrl: null, photos: [], mapAddress: "" }, byCode: {}, byPropertyId: {} };
  }
}

function resolvePropertyConfig({ code, propertyId }) {
  const props = readProperties();
  const byCode = code ? props.byCode?.[String(code)] : null;
  const byPid = propertyId ? props.byPropertyId?.[String(propertyId)] : null;

  return {
    // defaults
    agentUrl: props.defaults?.agentUrl || null,
    photos: props.defaults?.photos || [],
    mapAddress: props.defaults?.mapAddress || "",

    // overwrite por propertyId
    ...(byPid || {}),

    // overwrite por code (máxima prioridad)
    ...(byCode || {}),
  };
}

// ============================================================
// Webhook signature (optional)
// ============================================================
const HOSPITABLE_WEBHOOK_SECRET = process.env.HOSPITABLE_WEBHOOK_SECRET || "";

function verifySignature(req) {
  if (!HOSPITABLE_WEBHOOK_SECRET) return true;

  const sig =
    req.header("x-webhook-signature") ||
    req.header("x-signature") ||
    req.header("x-hospitable-signature") ||
    "";

  if (!sig) return false;

  const body = req.rawBody || "";
  const expected = crypto
    .createHmac("sha256", HOSPITABLE_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ============================================================
// Helpers
// ============================================================
function parseISO(iso) {
  const d = new Date(iso || "");
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  return d;
}

function getAccessPhase(now, checkInISO, checkOutISO) {
  const ci = parseISO(checkInISO);
  const co = parseISO(checkOutISO);
  if (!ci || !co) return "before";
  const t = now.getTime();
  if (t < ci.getTime()) return "before";
  if (t > co.getTime()) return "after";
  return "active";
}

function normalizeReservationFromPayload(payload, fallbackId, fallbackCode) {
  const data = payload?.data || payload?.body?.data || payload;

  const id = data?.reservationId || data?.id || fallbackId || null;
  const code = data?.code || data?.platform_id || fallbackCode || null;

  return {
    reservationId: String(id || ""),
    code: String(code || ""),
    address: String(data?.address || ""),
    checkInISO: String(data?.checkInISO || ""),
    checkOutISO: String(data?.checkOutISO || ""),
    steps: Array.isArray(data?.steps) ? data.steps : [],
    propertyId: String(data?.propertyId || ""),
    photos: Array.isArray(data?.photos) ? data.photos : [],
    mapAddress: String(data?.mapAddress || data?.address || ""),
  };
}

// ============================================================
// Debug state
// ============================================================
let lastWebhook = null;
let lastUnlock = null;

// ============================================================
// Health
// ============================================================
app.get("/health", (_req, res) => {
  res.json({ ok: true, status: "running" });
});

// ============================================================
// Debug
// ============================================================
app.get("/debug/last-hospitable-webhook", (_req, res) => {
  if (!lastWebhook) return res.json({ msg: "No webhook yet" });
  res.json(lastWebhook);
});

app.get("/debug/reservations", (_req, res) => {
  res.json(readDB());
});

app.get("/debug/last-unlock", (_req, res) => {
  if (!lastUnlock) return res.json({ msg: "No unlock yet" });
  res.json(lastUnlock);
});

// ============================================================
// Webhook endpoint
// ============================================================
app.post("/webhooks/hospitable", (req, res) => {
  lastWebhook = { at: new Date().toISOString(), body: req.body };

  if (!verifySignature(req)) {
    return res.status(401).json({ ok: false, error: "Invalid signature" });
  }

  const data = req.body?.data || req.body?.body?.data || req.body;
  const id = data?.id || req.body?.id || null;
  const code = data?.code || data?.platform_id || null;

  const record = upsertReservation({
    id: id ? String(id) : null,
    code: code ? String(code) : null,
    payload: req.body,
  });

  console.log(
    `[webhook] received at=${lastWebhook.at} code=${record.code || "-"} id=${record.id || "-"}`
  );

  res.json({ ok: true });
});

// ============================================================
// API: obtener reserva por code
// ✅ FIX: address visible = mapAddress (si existe)
// ✅ FIX: photos desde properties.json si reservation no trae
// ============================================================
app.get("/api/reservations/by-code/:code", (req, res) => {
  const code = String(req.params.code || "");
  const db = readDB();
  const rec = db.byCode?.[code];

  if (!rec) return res.status(404).json({ ok: false, error: "Not found", code });

  let reservation = normalizeReservationFromPayload(rec.payload, rec.id, rec.code);

  const cfg = resolvePropertyConfig({ code, propertyId: reservation.propertyId || null });

  // si properties.json trae propertyId y la reserva no, úsalo
  if (!reservation.propertyId && cfg.propertyId) reservation.propertyId = String(cfg.propertyId);

  // photos
  if (!reservation.photos || reservation.photos.length === 0) {
    reservation.photos = Array.isArray(cfg.photos) ? cfg.photos : [];
  }

  // map address
  if (cfg.mapAddress) reservation.mapAddress = String(cfg.mapAddress);

  // 🔥 lo que ve el usuario en "Address" (UI) → usa mapAddress si existe
  if (reservation.mapAddress) {
    reservation.address = reservation.mapAddress;
  }

  return res.json({
    ok: true,
    code,
    id: rec.id,
    updatedAt: rec.updatedAt,
    reservation,
  });
});

// ============================================================
// API: unlock
// ============================================================
app.post("/api/unlock", async (req, res) => {
  const code = String(req.body?.code || "");
  const stepId = String(req.body?.stepId || "");
  const action = String(req.body?.action || stepId || "");

  if (!code || !stepId) {
    return res.status(400).json({ ok: false, error: "Missing code or stepId" });
  }

  const db = readDB();
  const rec = db.byCode?.[code];
  if (!rec) return res.status(404).json({ ok: false, error: "Reservation not found", code });

  const reservation = normalizeReservationFromPayload(rec.payload, rec.id, rec.code);

  const now = new Date();
  const phase = getAccessPhase(now, reservation.checkInISO, reservation.checkOutISO);
  if (phase !== "active") {
    lastUnlock = { at: now.toISOString(), code, stepId, action, result: "blocked-not-active", phase };
    return res.status(403).json({ ok: false, error: "Access not active", phase, code, stepId });
  }

  const cfg = resolvePropertyConfig({ code, propertyId: reservation.propertyId || null });
  const agentUrl = cfg.agentUrl || null;

  let result = "stub-ok";
  let agentResponse = null;

  try {
    if (agentUrl) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const r = await fetch(`${agentUrl.replace(/\/$/, "")}/unlock/${encodeURIComponent(action)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, stepId, action }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      agentResponse = await r.json().catch(() => ({}));
      if (!r.ok || agentResponse?.ok === false) result = "agent-error";
      else result = agentResponse?.result || "agent-ok";
    }
  } catch (e) {
    result = "agent-unreachable";
    agentResponse = { error: String(e?.message || e) };
  }

  lastUnlock = {
    at: now.toISOString(),
    code,
    stepId,
    action,
    result,
    phase,
    agentUrl,
    agentResponse,
  };

  console.log(
    `[unlock] at=${lastUnlock.at} code=${code} stepId=${stepId} action=${action} result=${result} agent=${agentUrl || "-"}`
  );

  return res.json({ ok: true, code, stepId, action, result });
});

// ============================================================
// DEV ONLY: seed test reservation
// ✅ añadido GET para que puedas abrirlo en navegador
// ============================================================
function seedReservation(req, res) {
  try {
    const payload =
      req.body?.payload ||
      {
        data: {
          id: "res_test_1",
          code: "123",
          reservationId: "res_test_1",
          address: "Test Address - NYC",
          checkInISO: "2025-12-25T12:00:00-05:00",
          checkOutISO: "2025-12-31T11:00:00-05:00",
          steps: [
            {
              id: "building",
              title: "Building entrance",
              description: "Use the button to unlock the building door.",
              actionLabel: "Open building door",
            },
            {
              id: "apartment",
              title: "Apartment door",
              description: "Use the button to unlock the apartment door.",
              actionLabel: "Open apartment door",
            },
          ],
        },
      };

    const data = payload?.data || payload;
    const id = String(data?.id || data?.reservationId || "res_test_1");
    const code = String(data?.code || "123");

    const record = upsertReservation({ id, code, payload });
    res.json({ ok: true, saved: record, dataFile: DATA_FILE });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e), dataFile: DATA_FILE });
  }
}

app.post("/debug/seed", seedReservation);
app.get("/debug/seed", seedReservation);

// ============================================================
app.listen(PORT, () => {
  console.log(`STR Access API listening on port ${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Properties file: ${PROPERTIES_FILE}`);
});
