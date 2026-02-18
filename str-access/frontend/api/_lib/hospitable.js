const BASE = "https://api.hospitable.com/v1"; // si tu Hospitable usa otro base, lo cambiamos luego

export function requireHospitableKey() {
  const k = process.env.HOSPITABLE_API_KEY;
  if (!k) throw new Error("Missing HOSPITABLE_API_KEY");
  return k;
}

export async function hospitableFetch(path) {
  const key = requireHospitableKey();

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json"
    }
  });

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* noop */ }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || text || `HTTP ${res.status}`;
    throw new Error(`Hospitable API error: ${msg}`);
  }

  return data;
}

/**
 * Normaliza una reserva a lo que tu frontend necesita.
 * Ajusta campos según lo que devuelva Hospitable.
 */
export function normalizeReservation(h) {
  // “h” = objeto de Hospitable
  // Intentamos cubrir nombres típicos
  const id = String(h.id ?? h.reservation_id ?? h.reservationId ?? "");
  const guestName =
    h.guest?.full_name ?? h.guest?.name ?? h.guest_name ?? h.guestName ?? "";

  const checkIn = h.check_in ?? h.checkIn ?? h.arrival ?? h.start_date ?? null;
  const checkOut = h.check_out ?? h.checkOut ?? h.departure ?? h.end_date ?? null;

  const propertyName =
    h.property?.name ?? h.listing?.name ?? h.property_name ?? "Your stay";

  const address =
    h.property?.address?.full ??
    h.property?.address ??
    h.address ??
    "";

  const propertyId = String(h.property?.id ?? h.property_id ?? h.listing?.id ?? "");

  return {
    reservationId: id,
    name: guestName || undefined,
    property: propertyName || undefined,
    address: address || undefined,
    checkInISO: checkIn || undefined,
    checkOutISO: checkOut || undefined,
    propertyId: propertyId || undefined
  };
}
