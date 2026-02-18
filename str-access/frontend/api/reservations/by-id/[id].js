import { getJson } from "../../../_lib/store.js";

export default async function handler(req, res) {
  try {
    const id = String(req.query?.id || "").trim();
    if (!id) return res.status(400).json({ ok: false, error: "Missing id" });

    const data = await getJson(`reservation:${id}`);
    if (!data) return res.status(404).json({ ok: false, error: "Not found" });

    // Formato que tu App espera (ajústalo si quieres)
    const reservation = {
      reservationId: data.reservationId,
      name: data.guestName,
      property: data.propertyName,
      address: data.address,
      checkInISO: data.checkInISO,
      checkOutISO: data.checkOutISO,
      // steps vendrán luego por property (te lo dejo montado más abajo si quieres)
      steps: [],
    };

    return res.status(200).json({ ok: true, reservation });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
