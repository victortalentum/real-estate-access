import { useEffect, useMemo, useState } from "react";

type Reservation = {
  id: string;
  code: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  property?: string;
  address?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    const snippet = text.slice(0, 220).replace(/\s+/g, " ").trim();
    throw new Error(`Invalid JSON (HTTP ${res.status}). ${snippet}`);
  }
}

export default function App() {
  const code = useMemo(() => {
    const p = window.location.pathname.replace(/^\/+/, "").trim(); // "RES-123"
    if (!p) return null;
    if (p.startsWith("api/")) return null;
    return p;
  }, []);

  const [loading, setLoading] = useState<boolean>(!!code);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!code) return;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${window.location.origin}/api/reservations?code=${encodeURIComponent(code)}`;
        const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
        const data = await safeJson(res);

        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

        // tu API devuelve la reserva directamente (no { ok: true, reservation: ... })
        setReservation(data);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  if (!code) {
    return (
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.h1}>Access</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Open the link you received (it ends with your reservation code).</div>
          <div style={styles.muted}>Example: apartments-nyc.com/RES-123</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <div style={styles.h1}>Access</div>
        <div style={styles.pill}>apartments-nyc.com</div>
      </div>

      <div style={{ ...styles.card, gap: 14 }}>
        <div style={styles.topRow}>
          <div>
            <div style={{ ...styles.h2, marginBottom: 6 }}>{reservation?.property || "Your stay"}</div>
            <div style={styles.subtitle}>
              <div>Reservation {code}</div>
              {reservation?.guestName ? <div>Guest: {reservation.guestName}</div> : null}
              {reservation?.address ? <div>{reservation.address}</div> : null}
            </div>
          </div>
          <span style={styles.statusPill}>{loading ? "Loading" : error ? "Issue" : "Active"}</span>
        </div>

        {loading ? (
          <div style={styles.notice}>Loading…</div>
        ) : error ? (
          <div style={{ ...styles.notice, borderColor: "rgba(255,120,120,0.35)" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
            <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
              Prueba también abrir <b>/api/health</b> y <b>/api/reservations?code={code}</b>.
            </div>
          </div>
        ) : !reservation ? (
          <div style={styles.notice}>Reservation not found</div>
        ) : (
          <>
            <div style={styles.grid2}>
              <div style={styles.kv}>
                <div style={styles.k}>Check-in</div>
                <div style={styles.v}>{formatDate(reservation.checkIn)}</div>
              </div>
              <div style={styles.kv}>
                <div style={styles.k}>Check-out</div>
                <div style={styles.v}>{formatDate(reservation.checkOut)}</div>
              </div>
            </div>

            <div style={{ marginTop: 6 }}>
              <div style={styles.sectionTitle}>Next</div>
              <div style={styles.notice}>
                Now that the API works, we’ll plug in door actions (Butterfly/DoorBird) and later connect to Hospitable.
              </div>
            </div>
          </>
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.muted}>This page is unique per reservation.</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background:
      "radial-gradient(1200px 800px at 20% 10%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(900px 700px at 80% 0%, rgba(255,255,255,0.06), transparent 60%), #0b0c10",
    color: "rgba(255,255,255,0.92)",
  },
  header: {
    width: "100%",
    maxWidth: 860,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 14,
  },
  h1: { fontSize: 44, fontWeight: 800, letterSpacing: -0.8 },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 13,
    opacity: 0.9,
  },
  card: {
    width: "100%",
    maxWidth: 860,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    padding: 18,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 8 },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  h2: { fontSize: 22, fontWeight: 800, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, opacity: 0.85, display: "grid", gap: 4 },
  statusPill: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    fontSize: 12,
    fontWeight: 700,
  },
  notice: {
    marginTop: 8,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.18)",
    padding: 14,
    fontSize: 14,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 },
  kv: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.14)",
    padding: 12,
  },
  k: { fontSize: 12, opacity: 0.75, marginBottom: 6 },
  v: { fontSize: 14, fontWeight: 700 },
  sectionTitle: { fontSize: 16, fontWeight: 800, marginTop: 12, marginBottom: 10 },
  muted: { opacity: 0.75, fontSize: 13, marginTop: 4 },
  footer: { width: "100%", maxWidth: 860, marginTop: 14, paddingBottom: 16 },
};
