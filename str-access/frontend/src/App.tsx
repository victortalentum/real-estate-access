import { useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  description?: string;
  actionLabel?: string;
};

type Reservation = {
  reservationId: string;
  name?: string;
  property?: string;
  address?: string;
  checkInISO?: string;
  checkOutISO?: string;
  steps?: Step[];
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
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
      setLoading(true);
      setError(null);

      try {
        const url = `/api/reservations/by-id/${encodeURIComponent(reservationId)}`;
        const res = await fetch(url, { headers: { "Accept": "application/json" } });

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text();
          throw new Error(
            `API returned non-JSON (HTTP ${res.status}). This usually means /api is being caught by the SPA fallback.\n\nFirst bytes:\n${txt.slice(0, 200)}`
          );
        }

        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`);

        setReservation(data.reservation);
      } catch (e: any) {
        setError(e?.message || String(e));
        setReservation(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [reservationId]);

  // ---------- UI ----------
  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />

      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <div style={styles.kicker}>apartments-nyc.com</div>
            <h1 style={styles.h1}>Access</h1>
          </div>
          {reservationId && <span style={styles.badge}>Reservation {reservationId}</span>}
        </header>

        {!reservationId && (
          <div style={styles.card}>
            <h2 style={styles.h2}>Open your access link</h2>
            <p style={styles.p}>
              Use the link you received — it ends with your reservation id.
            </p>
            <div style={styles.monoBox}>
              Example: <b>apartments-nyc.com/RES-123</b>
            </div>
          </div>
        )}

        {reservationId && loading && (
          <div style={styles.card}>
            <h2 style={styles.h2}>Loading…</h2>
            <p style={styles.p}>Fetching your stay details.</p>
          </div>
        )}

        {reservationId && !loading && error && (
          <div style={{ ...styles.card, borderColor: "rgba(255, 90, 90, 0.35)" }}>
            <h2 style={{ ...styles.h2, color: "#ffb4b4" }}>Something went wrong</h2>
            <pre style={styles.pre}>{error}</pre>

            <div style={styles.row}>
              <a style={styles.btn} href={`/api/health`} target="_blank" rel="noreferrer">Check API health</a>
              <button style={styles.btnSecondary} onClick={() => window.location.reload()}>Refresh</button>
            </div>
          </div>
        )}

        {reservationId && !loading && !error && reservation && (
          <>
            <div style={styles.card}>
              <div style={styles.topRow}>
                <div>
                  <h2 style={styles.h2} style={{ marginBottom: 6 }}>
                    {reservation.property || "Your stay"}
                  </h2>
                  <div style={styles.subtle}>
                    {reservation.name ? `Guest: ${reservation.name}` : null}
                    {reservation.name && reservation.address ? " • " : null}
                    {reservation.address || ""}
                  </div>
                </div>
                <span style={styles.statusPill}>Active</span>
              </div>

              <div style={styles.grid2}>
                <div style={styles.kv}>
                  <div style={styles.k}>Check-in</div>
                  <div style={styles.v}>{formatDate(reservation.checkInISO)}</div>
                </div>
                <div style={styles.kv}>
                  <div style={styles.k}>Check-out</div>
                  <div style={styles.v}>{formatDate(reservation.checkOutISO)}</div>
                </div>
              </div>

              <div style={styles.row}>
                <button style={styles.btnPrimary} onClick={() => alert("Next: connect to Hospitable / door unlock")}>
                  Open door (soon)
                </button>
                <button style={styles.btnSecondary} onClick={() => window.location.reload()}>
                  Refresh
                </button>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.h3}>Steps</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {(reservation.steps?.length ? reservation.steps : [
                  { id: "1", title: "Arrive at the building", description: "Go to the main entrance and get ready to buzz in." },
                  { id: "2", title: "Get access", description: "Use the access link to open the door (we’ll hook this to Hospitable next)." },
                  { id: "3", title: "Find the unit", description: "Follow the building signage and head to your apartment." }
                ]).map((s, idx) => (
                  <div key={s.id} style={styles.step}>
                    <div style={styles.stepIndex}>{idx + 1}</div>
                    <div>
                      <div style={styles.stepTitle}>{s.title}</div>
                      {s.description && <div style={styles.stepDesc}>{s.description}</div>}
                      {s.actionLabel && <button style={{ ...styles.btnSecondary, marginTop: 10 }}>{s.actionLabel}</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer style={styles.footer}>
              <div style={styles.footerText}>If you need help, reply to the message where you received this link.</div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b0c10",
    color: "#eaeef6",
    position: "relative",
    overflow: "hidden",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
  },
  bgGlow: {
    position: "absolute",
    inset: "-20%",
    background:
      "radial-gradient(60% 40% at 50% 20%, rgba(120, 150, 255, 0.22) 0%, rgba(0,0,0,0) 60%), radial-gradient(40% 30% at 20% 60%, rgba(255, 120, 200, 0.12) 0%, rgba(0,0,0,0) 65%)",
    filter: "blur(10px)",
    pointerEvents: "none"
  },
  shell: { width: "min(920px, 92vw)", margin: "0 auto", padding: "40px 0 60px", position: "relative" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 18 },
  kicker: { fontSize: 12, opacity: 0.7, letterSpacing: 0.6 },
  h1: { fontSize: 52, lineHeight: 1.05, margin: "6px 0 0", fontWeight: 800 },
  badge: {
    fontSize: 12,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    whiteSpace: "nowrap"
  },
  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    marginTop: 14
  },
  h2: { fontSize: 18, margin: 0, fontWeight: 750 },
  h3: { fontSize: 16, margin: 0, fontWeight: 750 },
  p: { margin: "10px 0 0", opacity: 0.85 },
  monoBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    border: "1px dashed rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.25)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 13
  },
  pre: {
    marginTop: 12,
    whiteSpace: "pre-wrap",
    padding: 12,
    borderRadius: 12,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
    lineHeight: 1.4
  },
  row: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#eaeef6",
    textDecoration: "none",
    fontWeight: 650
  },
  btnPrimary: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(120,150,255,0.25)",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer"
  },
  btnSecondary: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#eaeef6",
    fontWeight: 750,
    cursor: "pointer"
  },
  topRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  subtle: { opacity: 0.8, marginTop: 4 },
  statusPill: {
    fontSize: 12,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(0, 255, 180, 0.10)",
    border: "1px solid rgba(0, 255, 180, 0.25)",
    color: "rgba(190, 255, 235, 1)",
    whiteSpace: "nowrap"
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 },
  kv: { padding: 12, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.20)" },
  k: { fontSize: 12, opacity: 0.75 },
  v: { marginTop: 6, fontWeight: 750 },
  step: {
    display: "grid",
    gridTemplateColumns: "36px 1fr",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)"
  },
  stepIndex: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)"
  },
  stepTitle: { fontWeight: 850 },
  stepDesc: { opacity: 0.82, marginTop: 4, lineHeight: 1.35 },
  footer: { marginTop: 16, opacity: 0.7, fontSize: 12 },
  footerText: { padding: "0 4px" }
};
