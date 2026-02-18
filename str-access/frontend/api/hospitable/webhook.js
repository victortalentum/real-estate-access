import { getRedis } from "../_lib/redis";
import { json, methodNotAllowed } from "../_lib/json";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res);

  const expected = process.env.HOSPITABLE_WEBHOOK_SECRET;
  const got = req.query?.secret;
  if (!expected || got !== expected) {
    return json(res, 401, { ok: false, error: "Unauthorized (bad secret)" });
  }

  const payload = req.body || {};

  // Intenta extraer varias formas típicas
  const reservationObj =
    payload?.reservation ||
    payload?.data?.reservation ||
    payload?.data ||
    payload;

  // IDs posibles
  const internalId =
    reservationObj?.id ||
    payload?.reservation_id ||
    payload?.data?.id ||
    null;

  // El número que tú quieres usar en la URL (ej: 5444950598)
  const publicNumber =
    reservationObj?.reservation_number ||
    reservationObj?.number ||
    reservationObj?.code ||
    reservationObj?.channel_reservation_id ||
    reservationObj?.external_id ||
    reservationObj?.public_id ||
    null;

  if (!internalId && !publicNumber) {
    return json(res, 400, {
      ok: false,
      error: "Webhook payload missing identifiers",
      hint: "Check Vercel logs to see actual payload shape",
    });
  }

  // Normaliza datos básicos (ajustaremos campos cuando veamos payload real)
  const reservation = {
    internalId: internalId ? String(internalId) : undefined,
    reservationId: publicNumber ? String(publicNumber) : (internalId ? String(internalId) : undefined),
    guestName:
      reservationObj?.guest_name ||
      reservationObj?.guest?.name ||
      reservationObj?.guest?.full_name ||
      undefined,
    propertyName:
      reservationObj?.property?.name ||
      reservationObj?.listing?.name ||
      undefined,
    propertyId:
      reservationObj?.property?.id ||
      reservationObj?.listing?.id ||
      undefined,
    address:
      reservationObj?.property?.address ||
      reservationObj?.listing?.address ||
      undefined,
    checkInISO:
      reservationObj?.check_in ||
      reservationObj?.checkin ||
      reservationObj?.start_date ||
      undefined,
    checkOutISO:
      reservationObj?.check_out ||
      reservationObj?.checkout ||
      reservationObj?.end_date ||
      undefined,
    raw: reservationObj, // útil al inicio; luego lo quitamos si quieres
  };

  reservation.steps = buildStepsForProperty(reservation.propertyId);

  const redis = getRedis();
  const ttlSeconds = 60 * 60 * 24 * 120;

  // Guardamos la reserva "principal" por internalId si existe
  if (reservation.internalId) {
    await redis.set(`res:internal:${reservation.internalId}`, JSON.stringify(reservation), "EX", ttlSeconds);
  }

  // Guardamos por el número público que usará el huésped (544...)
  if (publicNumber) {
    await redis.set(`res:public:${String(publicNumber)}`, JSON.stringify(reservation), "EX", ttlSeconds);
  }

  // Guardamos también una key genérica por si tu frontend busca res:{id}
  if (publicNumber) {
    await redis.set(`res:${String(publicNumber)}`, JSON.stringify(reservation), "EX", ttlSeconds);
  } else if (reservation.internalId) {
    await redis.set(`res:${reservation.internalId}`, JSON.stringify(reservation), "EX", ttlSeconds);
  }

  return json(res, 200, {
    ok: true,
    stored: {
      internal: reservation.internalId ? `res:internal:${reservation.internalId}` : null,
      public: publicNumber ? `res:public:${String(publicNumber)}` : null,
    },
  });
}

function buildStepsForProperty(propertyId) {
  const configs = {
    default: [
      { id: "step1", title: "Building entry", description: "Use the button below to open the main door.", actionLabel: "Open main door" },
      { id: "step2", title: "Unit entry", description: "Use the unit access method shown below.", actionLabel: "Open unit door" },
    ],
  };
  return configs[propertyId] || configs.default;
}
