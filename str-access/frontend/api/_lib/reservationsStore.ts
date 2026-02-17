// frontend/api/_lib/reservationsStore.ts
import { createRequire } from "module";

export type Reservation = {
  id: string;
  code: string;
  propertyId?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  [key: string]: any;
};

const require = createRequire(import.meta.url);

// ✅ Esto carga el JSON desde una ruta RELATIVA real del repo (se empaqueta en Vercel)
function loadReservations(): Reservation[] {
  const data = require("../data/reservations.json");
  return Array.isArray(data) ? (data as Reservation[]) : [];
}

export function readReservations(): Reservation[] {
  return loadReservations();
}

export function findByCode(code: string): Reservation | null {
  const list = loadReservations();
  const needle = String(code).toUpperCase();
  return list.find((r) => String(r.code).toUpperCase() === needle) || null;
}

export function findById(id: string): Reservation | null {
  const list = loadReservations();
  const needle = String(id);
  return list.find((r) => String(r.id) === needle) || null;
}
