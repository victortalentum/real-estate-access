export type ApiReservationResponse = {
  ok: boolean;
  code?: string;
  id?: string;
  updatedAt?: string;
  payload?: any;
  reservation?: any;
  error?: string;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchReservationByCode(code: string): Promise<ApiReservationResponse> {
  const res = await fetch(`${BASE_URL}/api/reservations/by-code/${encodeURIComponent(code)}`);

  if (!res.ok) {
    try {
      return await res.json();
    } catch {
      return { ok: false, error: `HTTP ${res.status}` };
    }
  }

  return res.json();
}
