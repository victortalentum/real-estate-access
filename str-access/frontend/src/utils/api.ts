export const API_BASE = ""; // mismo dominio en Vercel

export async function getByCode(code: string) {
  const r = await fetch(`/api/reservations/by-code/${encodeURIComponent(code)}`);
  if (!r.ok) throw await r.json().catch(() => ({ error: r.statusText }));
  return r.json();
}

export async function getById(id: string) {
  const r = await fetch(`/api/reservations/by-id/${encodeURIComponent(id)}`);
  if (!r.ok) throw await r.json().catch(() => ({ error: r.statusText }));
  return r.json();
}
