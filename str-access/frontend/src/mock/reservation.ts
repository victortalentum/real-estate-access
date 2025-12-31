// reservation.ts
export type AccessPhase = "before" | "active" | "after";

/**
 * Each step is an instruction block (photo + text + button).
 * Backend should now return `photoUrl` for building/apartment (and optional room).
 */
export type ReservationStep = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  photoUrl?: string | null;
};

/**
 * WiFi block shown at the end (SSID + password).
 */
export type WifiInfo = {
  ssid: string;
  password: string;
  notes?: string;
};

export type Reservation = {
  reservationId: string;
  address: string;
  checkInISO: string;
  checkOutISO: string;
  steps: ReservationStep[];
  wifi?: WifiInfo | null;
};

export function getAccessState(now: Date, checkIn: Date, checkOut: Date): AccessPhase {
  const t = now.getTime();
  if (t < checkIn.getTime()) return "before";
  if (t > checkOut.getTime()) return "after";
  return "active";
}

/**
 * Countdown helper (use this in the UI with a `now` that updates every second).
 */
export function msUntilCheckOut(now: Date, checkOut: Date): number {
  return Math.max(0, checkOut.getTime() - now.getTime());
}

/**
 * Optional helper: turn milliseconds into "1d 15h 08m 03s".
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad2 = (n: number) => String(n).padStart(2, "0");
  return `${days}d ${hours}h ${pad2(minutes)}m ${pad2(seconds)}s`;
}

/**
 * DEV ONLY mock. Mirrors the new backend shape:
 * - steps have photoUrl
 * - wifi is present
 */
export const mockReservation: Reservation = {
  reservationId: "res_test_1",
  address: "131 E 15th St, New York, NY 10003",
  checkInISO: "2025-12-25T12:00:00-05:00",
  checkOutISO: "2025-12-31T11:00:00-05:00",
  steps: [
    {
      id: "building",
      title: "Building entrance",
      description: "Press the button and the building door will open.",
      actionLabel: "Open building door",
      photoUrl: "/static/photos/portal.jpg",
    },
    {
      id: "apartment",
      title: "Apartment door",
      description: "Press the button and the apartment door will open.",
      actionLabel: "Open apartment door",
      photoUrl: "/static/photos/apartment.jpg",
    },
  ],
  wifi: {
    ssid: "MY_WIFI",
    password: "MY_PASSWORD",
    notes: "Network is 2.4G/5G; use the same password.",
  },
};
