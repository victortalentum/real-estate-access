export type AccessState = "before" | "active" | "after";

export type Reservation = {
  id: string;
  addressLine: string;
  cityLine: string;
  checkInISO: string;   // ISO string
  checkOutISO: string;  // ISO string
  steps: Array<{
    id: "building" | "apartment" | "room";
    title: string;
    description: string;
    imageUrl?: string;
    buttonLabel: string;
  }>;
  map: {
    lat: number;
    lng: number;
    zoom?: number;
  };
};

export function getAccessState(now: Date, checkIn: Date, checkOut: Date): AccessState {
  if (now < checkIn) return "before";
  if (now > checkOut) return "after";
  return "active";
}

// Mock para diseñar UI. Luego vendrá del backend/Hospitable.
export const mockReservation: Reservation = {
  id: "5625149326",
  addressLine: "316 W 51st St Apt 1R",
  cityLine: "New York, NY 10019",
  // OJO: pon tu zona horaria real más adelante. Esto es solo UI.
  checkInISO: "2025-12-25T12:00:00-05:00",
  checkOutISO: "2025-12-31T11:00:00-05:00",
  steps: [
    {
      id: "building",
      title: "Building entrance",
      description: "Locate the entrance. Use the button to unlock the building door.",
      imageUrl: "",
      buttonLabel: "Unlock building",
    },
    {
      id: "apartment",
      title: "Apartment door",
      description: "Go to the apartment door. Use the button to unlock.",
      imageUrl: "",
      buttonLabel: "Unlock apartment",
    },
    {
      id: "room",
      title: "Room door (if applicable)",
      description: "If this is a private room, use the button to unlock your room door.",
      imageUrl: "",
      buttonLabel: "Unlock room",
    },
  ],
  map: {
    lat: 40.7625,
    lng: -73.9847,
    zoom: 14,
  },
};
