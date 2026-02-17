import React, { useEffect, useMemo, useState } from "react";

type Reservation = {
  reservationId: string;
  name?: string;
  property?: string;
};

export default function AccessPage() {
  const reservationId = useMemo(() => {
    // "/RES-123" -> "RES-123"
    const p = window.location.pathname.replace("/", "").trim();
    return p || "";
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setError('Missing reservation code in URL (e.g., "/RES-123").');
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ NUEVO endpoint (sin /by-code/)
        const resp = await fetch(`/api/reservations?code=${encodeURIComponent(reservationId)}`);

        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          throw new Error(`API ${resp.status}: ${txt || resp.statusText}`);
        }

        const data = (await resp.json()) as Reservation;
        setReservation(data);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [reservationId]);

  // Pantalla base (home) sin código
  if (!reservationId) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1 style={{ marginBottom: 12 }}>Access</h1>
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
            maxWidth: 720,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            Open the link you received (it ends with your reservation id).
          </div>
          <div style={{ opacity: 0.8, marginTop: 8 }}>
            Example: apartments-nyc.com/RES-123
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1>Access</h1>
        <p style={{ opacity: 0.8 }}>Loading reservation…</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1>Access</h1>
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            border: "1px solid rgba(255,0,0,0.35)",
            background: "rgba(255,0,0,0.06)",
            maxWidth: 900,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Error</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
          <div style={{ marginTop: 12, opacity: 0.8 }}>
            Tip: prueba también abrir <code>/api/health</code> y{" "}
            <code>/api/reservations?code={reservationId}</code> para ver si responde JSON.
          </div>
        </div>
      </div>
    );
  }

  // OK
  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 12 }}>Access</h1>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.04)",
          maxWidth: 900,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>Your stay</div>
        <div style={{ opacity: 0.85, marginTop: 6 }}>Reservation {reservation?.reservationId}</div>

        <div style={{ marginTop: 12, opacity: 0.9 }}>
          <div>
            <strong>Name:</strong> {reservation?.name ?? "-"}
          </div>
          <div>
            <strong>Property:</strong> {reservation?.property ?? "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
