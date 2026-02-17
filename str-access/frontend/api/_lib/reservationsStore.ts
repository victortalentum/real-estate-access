// frontend/api/_lib/reservationsStore.ts

export type Reservation = {
  id: string;
  code: string;
  propertyId?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
};

const reservations: Reservation[] = [
  {
    id: "1",
    code: "RES-123",
    propertyId: "APT-01",
    guestName: "Victor",
    checkIn: "2026-02-15",
    checkOut: "2026-02-20"
  }
];

export function readReservations(): Reservation[] {
  return reservations;
}

export function findByCode(code: string): Reservation | null {
  return (
    reservations.find(
      r => r.code.toUpperCase() === code.toUpperCase()
    ) || null
  );
}

export function findById(id: string): Reservation | null {
  return (
    reservations.find(
      r => r.id === id
    ) || null
  );
}
