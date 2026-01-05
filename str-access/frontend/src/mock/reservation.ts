// reservation.ts
export type AccessPhase = "before" | "active" | "after";

/**
 * Each step is an instruction block (photo + text + button).
 * Backend should return `photoUrl` for each step when available.
 */
export type ReservationStep = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  photoUrl?: string | null;
};

/**
 * Wi-Fi block shown at the end (SSID + password).
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

  // optional enrichment
  displayName?: string;
  mapAddress?: string;
  photos?: string[];
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
 * DEV ONLY mock.
 * Uses dynamic dates so the reservation is "active" when you open the page.
 */
function toIsoWithOffset(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const offH = pad(Math.floor(abs / 60));
  const offM = pad(abs % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offH}:${offM}`;
}

const now = new Date();
const checkIn = new Date(now.getTime() - 60 * 60 * 1000); // 1h ago
const checkOut = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // in 2 days

export const mockReservation: Reservation = {
  reservationId: "res_test_1",
  displayName: "Demo property",
  address: "131 E 15th St, New York, NY 10003",
  mapAddress: "131 E 15th St, New York, NY 10003",
  checkInISO: toIsoWithOffset(checkIn),
  checkOutISO: toIsoWithOffset(checkOut),
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
