import reservations from "../../../reservations.json";

export default function handler(req: any, res: any) {
  const { code } = req.query;

  const found = Array.isArray(reservations)
    ? reservations.find((r: any) => r.code === code)
    : null;

  if (!found) return res.status(404).json({ error: "Not found", code });

  return res.status(200).json(found);
}
