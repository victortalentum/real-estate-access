import React, { useEffect, useMemo, useState } from "react";

type Reservation = {
  reservationId: string;
  name: string;
  property: string;
};

export default function AccessPage() {
  const reservationId = useMemo(() => {
    // /RES-123  -> "RES-123"
    const p = window.location.pathname.replace("/", "").trim();
    return p || "";
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setError("Missing reservation code in URL (e.g., /RES-123).");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const r = await fetch(`/api/reservations/by-id/${encodeURIComponent(reservationId)}`, {
          headers: { "Accept": "application/json" }
        });

        const contentType = r.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await r.text();
          throw new Error(`API returned non-JSON (${r.status}). Body: ${text.slice(0, 120)}`);
        }

        const data = await r.json();

        if (!r.ok || !data?.ok) {
          throw new Error(data?.error || `Request failed (${r.status})`);
        }

        setReservation(data.reservation);
      } catch (e: any) {
        setError(e?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [reservationId]);

  const onOpenDoor = () => {
    alert("✅ Demo: aquí irá la integración real (Hospitable/Butterfly/DoorBird).");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.h1}>Access</div>
            <div style={styles.sub}>Your entry details, ready on your phone.</div>
          </div>
          <div style={styles.badge}>apartments-nyc.com</div>
        </div>

        <div style={styles.card}>
          {loading && (
            <div style={styles.line}>Loading reservation <b>{reservationId}</b>…</div>
          )}

          {!loading && error && (
            <>
              <div style={{ ...styles.line, color: "#ffb4b4" }}>
                <b>Error:</b> {error}
              </div>
              <div style={styles.small}>
                Tip: open a valid link like <b>/RES-123</b> or <b>/RES-456</b>.
              </div>
            </>
          )}

          {!loading && !error && reservation && (
            <>
              <div style={styles.row}>
                <div style={styles.label}>Reservation</div>
                <div style={styles.value}>{reservation.reservationId}</div>
              </div>
              <div style={styles.row}>
                <div style={styles.label}>Guest</div>
                <div style={styles.value}>{reservation.name}</div>
              </div>
              <div style={styles.row}>
                <div style={styles.label}>Property</div>
                <div style={styles.value}>{reservation.property}</div>
              </div>

              <button style={styles.cta} onClick={onOpenDoor}>
                Open door
              </button>

              <div style={styles.small}>
                Next: connect this button to Hospitable actions + your lock provider.
              </div>
            </>
          )}
        </div>

        <div style={styles.footer}>
          If you need help, reply to your confirmation message with “help”.
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(1200px 600px at 10% 0%, rgba(255,255,255,0.08), transparent), #0b0b0f",
    color: "white",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    padding: 18,
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: 520 },
  header: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginTop: 12, marginBottom: 16 },
  h1: { fontSize: 44, fontWeight: 800, letterSpacing: -1 },
  sub: { opacity: 0.8, marginTop: 6, fontSize: 14 },
  badge: { opacity: 0.9, fontSize: 12, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, background: "rgba(255,255,255,0.05)" },
  card: { borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", padding: 16 },
  row: { display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  label: { opacity: 0.75, fontSize: 13 },
  value: { fontWeight: 700, fontSize: 14 },
  line: { fontSize: 14, padding: "8px 0" },
  cta: {
    width: "100%",
    marginTop: 16,
    padding: "14px 14px",
    borderRadius: 14,
    border: "none",
    background: "white",
    color: "#0b0b0f",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },
  small: { marginTop: 10, fontSize: 12, opacity: 0.75, lineHeight: 1.35 },
  footer: { marginTop: 14, fontSize: 12, opacity: 0.6, textAlign: "center" },
};
