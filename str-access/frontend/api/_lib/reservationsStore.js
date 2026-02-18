// frontend/api/_lib/reservationsStore.js
import { createClient } from "redis";

let _clientPromise = null;

async function getRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!_clientPromise) {
    _clientPromise = (async () => {
      const client = createClient({ url });
      client.on("error", (err) => console.error("Redis error:", err));
      await client.connect();
      return client;
    })();
  }
  return _clientPromise;
}

function keyById(id) {
  return `res:id:${id}`;
}
function keyByCode(code) {
  return `res:code:${code}`;
}

// --- Extraction helpers (tolerante a distintos formatos de Hospitable) ---
export function extractReservationFromPayload(payload) {
  // Hospitable puede mandar algo como { type, data }, o directamente la reserva.
  const root = payload?.data ?? payload?.reservation ?? payload ?? {};

  const id =
    String(
      root.reservationId ??
        root.reservation_id ??
        root.bookingId ??
        root.booking_id ??
        root.id ??
        root.reservationNumber ??
        root.reservation_number ??
        ""
    ).trim() || null;

  const code =
    String(
      root.code ??
        root.confirmationCode ??
        root.confirmation_code ??
        root.reservationCode ??
        root.reservation_code ??
        ""
    ).trim() || null;

  const guestName =
    root.guestName ??
    root.guest_name ??
    root.guest?.name ??
    root.guest?.full_name ??
    root.guest_full_name ??
    null;

  const property =
    root.propertyName ??
    root.property_name ??
    root.listingName ??
    root.listing_name ??
    root.property?.name ??
    root.listing?.name ??
    null;

  const propertyId =
    String(
      root.propertyId ??
        root.property_id ??
        root.listingId ??
        root.listing_id ??
        root.property?.id ??
        root.listing?.id ??
        ""
    ).trim() || null;

  const address =
    root.address ??
    root.propertyAddress ??
    root.property_address ??
    root.property?.address ??
    root.listing?.address ??
    null;

  const checkInISO =
    root.checkIn ??
    root.check_in ??
    root.checkInDate ??
    root.check_in_date ??
    root.startDate ??
    root.start_date ??
    null;

  const checkOutISO =
    root.checkOut ??
    root.check_out ??
    root.checkOutDate ??
    root.check_out_date ??
    root.endDate ??
    root.end_date ??
    null;

  // Lo guardamos en un formato estable para tu UI
  return {
    reservationId: id,
    code,
    name: guestName,
    property,
    propertyId,
    address,
    checkInISO,
    checkOutISO,
    // aquí luego puedes meter steps por propiedad
    steps: root.steps ?? null,
    // por si quieres debug
    _raw: payload,
  };
}

// --- Store API ---
export async function upsertReservation(reservation) {
  if (!reservation?.reservationId) throw new Error("Missing reservationId");
  const client = await getRedis();
  if (!client) throw new Error("REDIS_URL not configured");

  const json = JSON.stringify(reservation);

  await client.set(keyById(reservation.reservationId), json);

  if (reservation.code) {
    await client.set(keyByCode(reservation.code), reservation.reservationId);
  }

  return reservation;
}

export async function getReservationById(id) {
  const client = await getRedis();
  if (!client) throw new Error("REDIS_URL not configured");

  const raw = await client.get(keyById(id));
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function getReservationByCode(code) {
  const client = await getRedis();
  if (!client) throw new Error("REDIS_URL not configured");

  const id = await client.get(keyByCode(code));
  if (!id) return null;
  return getReservationById(id);
}
