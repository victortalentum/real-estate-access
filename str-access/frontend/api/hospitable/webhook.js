import { setJson } from "../_lib/store.js";

function pickReservation(payload) {
  // Hospitable puede enviar el objeto con distintas formas.
  // Intentamos cubrir las más típicas:
  const r =
    payload?.reservation ||
    payload?.data?.reservation ||
    payload?.data ||
    payload;

  if (!r) return null;

  // ID de Hospitable (el que tú quieres en la URL)
  const reservationId =
    String(
      r.id ??
        r.reservation_id ??
        r.reservationId ??
        r.external_id ??
        r.confirmation_code ??
        ""
    ).trim();

  if (!reservationId) return null;

  const propertyId = String(
    r.property_id ?? r.propertyId ?? r.listing_id ?? r.listingId ?? ""
  ).trim();

  const guestName =
    r.guest?.name ||
    r.guest_name ||
    r.guestName ||
    [r.guest?.first_name, r.guest?.last_name].filter(Boolean).join(" ") ||
    "";

  const checkInISO =
    r.check_in ||
    r.checkIn ||
    r.start_date ||
    r.checkin ||
    r.arrival_date ||
    null;

  const checkOutISO =
    r.check_out ||
    r.checkOut ||
    r.end_date ||
    r.checkout ||
    r.departure_date ||
    null;

  const address =
    r.property?.address ||
    r.address ||
    r.listing?.address ||
    r.property_address ||
    "";

  const propertyName =
    r.property?.name || r.listing?.name || r.property_name || r.title || "";

  return {
    reservationId,           // <- clave
    propertyId,
    guestName,
    propertyName,
    address,
    checkInISO,
    checkOutISO,
    raw: r,                  // guardo también raw por si luego necesitas algo
    updatedAt: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const expected = process.env.HOSPITABLE_WEBHOOK_SECRET || "";
    const provided = String(req.query?.secret || "");

    if (!expected) {
      return res.status(500).json({ ok: false, error: "Missing HOSPITABLE_WEBHOOK_SECRET" });
    }
    if (provided !== expected) {
      return res.status(401).json({ ok: false, error: "Invalid webhook secret" });
    }

    const payload = req.body || {};
    const normalized = pickReservation(payload);

    if (!normalized) {
      return res.status(400).json({ ok: false, error: "Could not parse reservation from webhook payload" });
    }

    // Guardamos por ID de Hospitable
    await setJson(`reservation:${normalized.reservationId}`, normalized);

    // también guardamos índice por property si luego quieres “últimas reservas”
    if (normalized.propertyId) {
      await setJson(`reservation_property:${normalized.propertyId}:${normalized.reservationId}`, normalized);
    }

    return res.status(200).json({ ok: true, reservationId: normalized.reservationId });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
