// frontend/api/hospitable/webhook.js
import { extractReservationFromPayload, upsertReservation } from "../_lib/reservationsStore.js";

export const config = {
  api: {
    bodyParser: true, // Hospitable manda JSON, esto está bien
  },
};

export default async function handler(req, res) {
  try {
    // 1) Validación del secret por querystring
    const provided = String(req.query?.secret ?? "");
    const expected = String(process.env.HOSPITABLE_WEBHOOK_SECRET ?? "");

    if (!expected) {
      return res.status(500).json({ ok: false, error: "MISSING_ENV", message: "HOSPITABLE_WEBHOOK_SECRET not set" });
    }
    if (!provided || provided !== expected) {
      return res.status(401).json({ ok: false, error: "UNAUTHORISED" });
    }

    // 2) Solo aceptamos POST (Hospitable)
    if (req.method !== "POST") {
      return res.status(200).json({ ok: true, hint: "POST expected" });
    }

    const payload = req.body ?? {};
    const reservation = extractReservationFromPayload(payload);

    if (!reservation?.reservationId) {
      // Te devolvemos payload recortado para debug
      return res.status(400).json({
        ok: false,
        error: "CANNOT_EXTRACT_RESERVATION_ID",
        message: "No reservationId found in webhook payload",
      });
    }

    // 3) Aquí añadimos “steps” por propiedad (de momento básico).
    //    Luego lo refinamos por propertyId (tú tienes varias propiedades)
    reservation.steps = buildStepsForProperty(reservation.propertyId, reservation.property);

    await upsertReservation(reservation);

    return res.status(200).json({ ok: true, stored: { reservationId: reservation.reservationId, code: reservation.code } });
  } catch (e) {
    console.error("hospitable/webhook error:", e);
    return res.status(500).json({ ok: false, error: "INTERNAL", message: e?.message || String(e) });
  }
}

function buildStepsForProperty(propertyId, propertyName) {
  // TODO: aquí meteremos lógica real por propertyId.
  // Por ahora devolvemos un set genérico y luego lo ajustas por propiedad.
  return [
    {
      id: "building",
      title: "Building entry",
      description: "Use the building access button (Butterfly/DoorBird).",
      actionLabel: "Open main door",
    },
    {
      id: "apartment",
      title: "Apartment entry",
      description: "Use your smart lock / keypad code.",
      actionLabel: "Get code",
    },
    {
      id: "wifi",
      title: "Wi-Fi",
      description: "Wi-Fi details will appear here.",
      actionLabel: "Copy",
    },
  ];
}
