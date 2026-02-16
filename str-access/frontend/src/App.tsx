import { useEffect, useMemo, useState } from "react";

type Step = { id: string; title: string; description?: string; actionLabel?: string };

type Reservation = {
  reservationId: string;
  address?: string;
  property?: string;
  checkInISO?: string;
  checkOutISO?: string;
  steps?: Step[];
};

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const reservationId = useMemo(() => {
    const p = window.location.pathname.replace(/^\/+/, "").trim(); // "RES-123"
    return p || null;
  }, []);

  const [loading, setLoading] = useState<boolean>(!!reservationId);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!reservationId) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/reservations/by-id/${encodeURIComponent(reservationId)}`, {
          headers: { Accept: "application/json" }
        });

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          throw new Error(`API returned non-JSON (HTTP ${res.status}). ${text.slice(0, 120)}`);
        }

        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`);

        setReservation(data.reservation);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [reservationId]);

  const onOpenDoor = () => {
    alert("✅ Demo: aquí conectaremos Hospitable / cerradura después.");
  };

  // --- UI states ---
  if (!reservationId) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.h1}>Access</div>
          <div style={styles.card}>
            <div style={styles.line}>
              Open the link you received (it ends with your reservation id).
            </div>
            <div style={styles.small}>Example: apartments-nyc.com/RES-123</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.h1}>Access</div>
            <div style={styles.sub}>Reservation {reservationId}</div>
          </div>
          <div style={styles.badge}>apartments-nyc.com</div>
        </div>

        <div style={styles.card}>
          {loading && <div style={styles.line}>Loading…</div>}

          {!loading && error && (
            <>
              <div style={{ ...styles.line, color: "#ffb4b4" }}>
                <b>Error:</b> {error}
              </div>
              <div style={styles.small}>
                If you’re testing locally, make sure you are not hitting the Vite server for /api.
              </div>
            </>
          )}

          {!loading && !error && !reservation && (
            <div style={styles.line}>Reservation not found.</div>
          )}

          {!loading && !error && reservation && (
            <>
              <div style={styles.kv}>
                <div style={styles.k}>
                  <div style={styles.label}>Guest / Booking</div>
                  <div style={styles.value}>{reservation.reservationId}</div>
                </div>
                <div style={styles.k}>
                  <div style={styles.label}>Property</div>
                  <div style={styles.value}>{reservation.property || reservation.address || "—"}</div>
                </div>
              </div>

              {(reservation.checkInISO || reservation.checkOutISO) && (
                <div style={styles.kv}>
                  <div style={styles.k}>
                    <div style={styles.label}>Check-in</div>
                    <div style={styles.value}>{formatDate(reservation.checkInISO) || "—"}</div>
                  </div>
                  <div style={styles.k}>
                    <div style={styles.label}>Check-out</div>
                    <div style={styles.value}>{formatDate(reservation.checkOutISO) || "—"}</div>
                  </div>
                </div>
              )}

              <button style={styles.cta} onClick={onOpenDoor}>
                Open door
              </button>

              <div style={{ ...styles.sectionTitle, marginTop: 18 }}>Steps</div>
              <div style={styles.steps}>
                {(reservation.steps || []).length === 0 ? (
                  <div style={styles.small}>No steps configured yet.</div>
                ) : (
                  (reservation.steps || []).map((s) => (
                    <div key={s.id} style={styles.stepCard}>
                      <div style={styles.stepTitle}>{s.title}</div>
                      {s.description && <div style={styles.stepDesc}>{s.description}</div>}
                      {s.actionLabel && <div style={styles.stepHint}>{s.actionLabel}</div>}
                    </div>
                  ))
                )}
              </div>

              <div style={styles.small}>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 10% 0%, rgba(255,255,255,0.08), transparent), #0b0b0f",
    color: "white",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    padding: 16,
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: 520, marginTop: 10 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  h1: { fontSize: 44, fontWeight: 800, letterSpacing: -1 },
  sub: { opacity: 0.8, marginTop: 6, fontSize: 14 },
  badge: {
    opacity: 0.9,
    fontSize: 12,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
  },
  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    padding: 16,
  },
  line: { fontSize: 14, padding: "8px 0" },
  small: { marginTop: 10, fontSize: 12, opacity: 0.75, lineHeight: 1.35 },
  kv: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 10,
  },
  k: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(0,0,0,0.10)",
  },
  label: { opacity: 0.7, fontSize: 12, marginBottom: 6 },
  value: { fontWeight: 800, fontSize: 14 },
  cta: {
    width: "100%",
    marginTop: 10,
    padding: "14px 14px",
    borderRadius: 14,
    border: "none",
    background: "white",
    color: "#0b0b0f",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  sectionTitle: { fontSize: 14, fontWeight: 800, marginTop: 12, marginBottom: 10 },
  steps: { display: "grid", gap: 10 },
  stepCard: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(0,0,0,0.10)",
  },
  stepTitle: { fontWeight: 800, fontSize: 14 },
  stepDesc: { opacity: 0.85, marginTop: 6, fontSize: 13, lineHeight: 1.35 },
  stepHint: { opacity: 0.7, marginTop: 8, fontSize: 12 },
};
