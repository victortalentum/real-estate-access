// frontend/api/_lib/reservationsStore.ts
import { promises as fs } from "node:fs";

export type Reservation = {
  id: string;
  code: string;
  [key: string]: any;
};

function reservationsFileUrl() {
  // Este archivo está en: api/_lib/reservationsStore.ts
  // El JSON está en: api/data/reservations.json
  return new URL("../data/reservations.json", import.meta.url);
}

export async function readReservations(): Promise<Reservation[]> {
  const fileUrl = reservationsFileUrl();
  const raw = await fs.readFile(fileUrl, "utf-8");
  const data = JSON.parse(raw);

  // Acepta que sea array directamente o que venga envuelto
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reservations)) return data.reservations;

  return [];
}

export function findByCode(list: Reservation[], code: string) {
  return list.find((r) => String(r.code).toUpperCase() === String(code).toUpperCase());
}

export function findById(list: Reservation[], id: string) {
  return list.find((r) => String(r.id) === String(id));
}
