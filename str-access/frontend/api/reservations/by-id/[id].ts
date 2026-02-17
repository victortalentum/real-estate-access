import reservations from "../../../reservations.json";

export default function handler(req: any, res: any) {
  const { id } = req.query;

  const found = Array.isArray(reservations)
    ? reservations.find((r: any) => r.id === id)
    : null;

  if (!found) return res.status(404).json({ error: "Not found", id });

  return res.status(200).json(found);
}
