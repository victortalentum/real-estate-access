// frontend/api/reservations/by-id/[id].js

import { hospitableFetch } from "../../_lib/hospitable.js";
import { getReservationCached, setReservationCached } from "../../_lib/store.js";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function mapToFrontendReservation(h) {
  // Ajusta campos según lo que devuelva Hospitable
  // (esto es un “mapper” seguro con fallbacks)
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
    // pasos los construiremos por propiedad en el punto 3
    steps: [],
  };
}

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    if (!id) return json(res, 400, { ok: false, error: "Missing id" });

    // 1) cache
    const cached = await getReservationCached(String(id));
    if (cached) return json(res, 200, { ok: true, reservation: cached, source: "cache" });

    // 2) Hospitable real
    // Nota: el path exacto depende del endpoint real de Hospitable.
    // Este suele ser /reservations/{id}
    const h = await hospitableFetch(`/reservations/${encodeURIComponent(id)}`);

    const mapped = mapToFrontendReservation(h);

    if (!mapped.reservationId) {
      return json(res, 404, { ok: false, error: "Reservation not found" });
    }

    await setReservationCached(String(id), mapped);

    return json(res, 200, { ok: true, reservation: mapped, source: "hospitable" });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || String(e) });
  }
}
