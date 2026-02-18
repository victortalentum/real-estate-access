// frontend/api/hospitable/webhook.js

import { setReservationCached } from "../_lib/store.js";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

// mismo mapper que arriba (duplicado por simplicidad)
function mapToFrontendReservation(h) {
  const id = String(h?.id ?? h?.reservation_id ?? h?.reservationId ?? "");
  const guestName =
    h?.guest?.name || h?.guest_name || h?.guestName || h?.primary_guest_name;

  const checkIn =
    h?.check_in || h?.checkIn || h?.arrival_date || h?.start_date;
  const checkOut =
    h?.check_out || h?.checkOut || h?.departure_date || h?.end_date;

  const propertyName =
    h?.property?.name || h?.listing?.name || h?.property_name;
  const address =
    h?.property?.address ||
    h?.listing?.address ||
    h?.address ||
    h?.property_address;

  return {
    reservationId: id,
    name: guestName,
    property: propertyName,
    address: address,
    checkInISO: checkIn,
    checkOutISO: checkOut,
    steps: [],
  };
}

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  try {
    const expected = process.env.HOSPITABLE_WEBHOOK_SECRET;
    const got = req.query.secret;

    if (!expected) return json(res, 500, { ok: false, error: "Missing HOSPITABLE_WEBHOOK_SECRET" });
    if (got !== expected) return json(res, 401, { ok: false, error: "Invalid secret" });

    // Hospitable enviará un payload (normalmente con event + data/reservation)
    const payload = req.body || {};
    const reservation = payload.reservation || payload.data || payload;

    const mapped = mapToFrontendReservation(reservation);
    if (!mapped.reservationId) return json(res, 400, { ok: false, error: "Missing reservation id in payload" });

    await setReservationCached(mapped.reservationId, mapped);

    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || String(e) });
  }
}
