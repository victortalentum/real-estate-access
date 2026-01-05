export async function fetchReservationByCode(code: string) {
  const res = await fetch(`/api/reservations/by-code/${encodeURIComponent(code)}`);
  if (!res.ok) {
    try {
      return await res.json();
    } catch {
      return { ok: false, error: `HTTP ${res.status}` };
    }
  }
  return res.json();
}
