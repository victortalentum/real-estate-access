import { useEffect, useMemo, useState } from "react";
import { Countdown } from "../components/Countdown";
import { StatusPill } from "../components/StatusPill";
import { StepCard } from "../components/StepCard";
import { getAccessState, type AccessPhase } from "../mock/reservation";

type StepResult = "idle" | "success" | "error";

type WifiInfo = {
  ssid: string;
  password: string;
  notes?: string;
};

type ReservationStep = {
  id: string; // "building" | "apartment" | "room" | ...
  title: string;
  description: string;
  actionLabel: string;
  photoUrl?: string | null;
};

type Reservation = {
  reservationId: string;
  address: string;
  checkInISO: string;
  checkOutISO: string;

  steps: ReservationStep[];

  // enrichment backend
  propertyId?: string;
  displayName?: string;
  mapAddress?: string;
  photos?: string[]; // fallback images
  wifi?: WifiInfo | null;
};

function isValidDate(d: Date) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function formatDate(d: Date) {
  try {
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d);
  }
}

function getCodeFromUrl(): string {
  const url = new URL(window.location.href);
  return url.searchParams.get("code") || url.searchParams.get("c") || "";
}

const API_BASE = "http://localhost:3000";

async function fetchReservationByCode(code: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/api/reservations/by-code/${encodeURIComponent(code)}`);
  const json = await res.json();

  if (!res.ok || !json?.ok) throw new Error(json?.error || "Reservation not found");
  return json.reservation as Reservation;
}

function MapEmbed({ address }: { address: string }) {
  const q = encodeURIComponent(address || "");
  const src = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <iframe
      title="map"
      src={src}
      width="100%"
      height="320"
      style={{ border: 0, borderRadius: 16 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function SectionHeader({
  index,
  title,
  subtitle,
  right,
}: {
  index: number;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 14,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {index}
        </div>

        <div>
          <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
          {subtitle ? (
            <div className="muted small" style={{ marginTop: 6, maxWidth: 720 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {right ? <div style={{ textAlign: "right" }}>{right}</div> : null}
    </div>
  );
}

function InstructionPhoto({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: 260,
        objectFit: "cover",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: 12,
      }}
    />
  );
}

/**
 * PRO: resuelve foto por prioridad:
 * 1) step.photoUrl
 * 2) photos[] matching keywords
 * 3) photos[0]
 */
function resolveStepPhoto(stepId: string, stepPhotoUrl?: string | null, photos?: string[]) {
  if (stepPhotoUrl) return stepPhotoUrl;

  const list = photos ?? [];
  const s = stepId.toLowerCase();

  const matchByKeywords = (keywords: string[]) =>
    list.find((p) => keywords.some((k) => p.toLowerCase().includes(k)));

  if (s === "building") return matchByKeywords(["building", "portal", "entrance", "front"]) || list[0];
  if (s === "apartment") return matchByKeywords(["apartment", "unit", "door", "flat"]) || list[1] || list[0];
  if (s === "room") return matchByKeywords(["room"]) || list[2] || list[0];

  return list[0];
}

function WifiBlock({ wifi }: { wifi?: WifiInfo | null }) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">Wi-Fi</div>
      </div>
      <div className="cardBody">
        {!wifi?.ssid ? (
          <div className="muted">Wi-Fi not configured yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <div className="muted small">Network (SSID)</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{wifi.ssid}</div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div className="muted small">Password</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{wifi.password}</div>
            </div>

            {wifi.notes ? (
              <div className="muted small">{wifi.notes}</div>
            ) : (
              <div className="muted small">Tip: if you have issues, stand closer to the router for first connection.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ReservationPage() {
  const [now, setNow] = useState<Date>(() => new Date());

  // API state
  const [code] = useState<string>(() => getCodeFromUrl());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const [loadingByStep, setLoadingByStep] = useState<Record<string, boolean>>({});
  const [resultByStep, setResultByStep] = useState<Record<string, StepResult>>({});

  // LIVE countdown
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!code) {
      setError("Missing code in URL. Use ?code=123");
      setReservation(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    fetchReservationByCode(code)
      .then((r) => {
        if (cancelled) return;
        setReservation(r);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || "Failed to load reservation");
        setReservation(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  const checkIn = useMemo(() => new Date(reservation?.checkInISO || ""), [reservation?.checkInISO]);
  const checkOut = useMemo(() => new Date(reservation?.checkOutISO || ""), [reservation?.checkOutISO]);

  const phase = useMemo<AccessPhase>(() => {
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) return "before";
    return getAccessState(now, checkIn, checkOut);
  }, [now, checkIn, checkOut]);

  const buttonsEnabled = phase === "active";

  const countdownTarget = useMemo<Date | null>(() => {
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) return null;
    if (phase === "before") return checkIn;
    if (phase === "active") return checkOut;
    return null;
  }, [phase, checkIn, checkOut]);

  const countdownLabel = useMemo(() => {
    if (phase === "before") return "Access starts in";
    if (phase === "active") return "Access ends in";
    return "Reservation ended";
  }, [phase]);

  const headerLine = loading ? "Loading..." : error ? `Error: ${error}` : `Code: ${code}`;
  const mapAddress = reservation?.mapAddress || reservation?.address || "";

  const orderedSteps = useMemo(() => {
    const steps = reservation?.steps ?? [];
    const byId = new Map(steps.map((s) => [s.id, s]));
    const ordered: ReservationStep[] = [];
    if (byId.get("building")) ordered.push(byId.get("building")!);
    if (byId.get("apartment")) ordered.push(byId.get("apartment")!);
    if (byId.get("room")) ordered.push(byId.get("room")!);

    for (const s of steps) {
      if (s.id !== "building" && s.id !== "apartment" && s.id !== "room") ordered.push(s);
    }
    return ordered;
  }, [reservation?.steps]);

  async function unlockStep(stepId: string) {
    if (!buttonsEnabled) return;

    setLoadingByStep((prev) => ({ ...prev, [stepId]: true }));
    setResultByStep((prev) => ({ ...prev, [stepId]: "idle" }));

    try {
      const res = await fetch(`${API_BASE}/api/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, stepId, action: stepId }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Unlock failed");
      setResultByStep((prev) => ({ ...prev, [stepId]: "success" }));
    } catch (e) {
      setResultByStep((prev) => ({ ...prev, [stepId]: "error" }));
      console.warn(e);
    } finally {
      setLoadingByStep((prev) => ({ ...prev, [stepId]: false }));
      setTimeout(() => setResultByStep((prev) => ({ ...prev, [stepId]: "idle" })), 3500);
    }
  }

  // friendly copy per step
  const stepSubtitle = (stepId: string) => {
    const s = stepId.toLowerCase();
    if (s === "building") return "First, open the building entrance door. Press the button and it will unlock.";
    if (s === "apartment") return "Next, go to the apartment door. Press the button to unlock.";
    if (s === "room") return "If applicable, unlock your private room door.";
    return "Follow the instructions below and press the button to unlock.";
  };

  return (
    <div className="page">
      <div className="container">
        {/* HEADER */}
        <div className="pageHeader">
          <div>
            <h1 className="pageTitle">Reservation</h1>
            <div className="muted small">{headerLine}</div>
            {reservation?.displayName ? (
              <div className="muted small" style={{ marginTop: 6 }}>
                {reservation.displayName}
              </div>
            ) : null}
          </div>

          <div style={{ textAlign: "right" }}>
            <StatusPill phase={phase} />
            <div className="muted small" style={{ marginTop: 6 }}>
              Dev helper
            </div>
            <button className="btn btnSecondary" onClick={() => setNow(new Date())}>
              Refresh
            </button>
          </div>
        </div>

        {!reservation ? (
          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">Stay details</div>
            </div>
            <div className="cardBody">
              <div className="muted">
                {loading
                  ? "Loading reservation..."
                  : error
                  ? error
                  : "Open with: http://localhost:5173/reservation?code=123"}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 1) STAY DETAILS */}
            <div className="card">
              <div className="cardHeader">
                <div>
                  <div className="cardTitle">Stay details</div>
                  <div className="muted small" style={{ marginTop: 6 }}>
                    Reservation ID: {reservation.reservationId}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  {phase === "after" ? (
                    <>
                      <div className="muted small">{countdownLabel}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>Ended</div>
                    </>
                  ) : countdownTarget ? (
                    <Countdown target={countdownTarget} now={now} label={countdownLabel} />
                  ) : (
                    <>
                      <div className="muted small">Access</div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>—</div>
                    </>
                  )}

                  <div className="muted small" style={{ marginTop: 6 }}>
                    {phase === "before"
                      ? "The unlock buttons will appear automatically at check-in time."
                      : phase === "active"
                      ? "Buttons are active during your reservation window."
                      : "Reservation window has ended."}
                  </div>
                </div>
              </div>

              <div className="cardBody">
                <div className="grid2">
                  <div>
                    <div className="muted small">Address</div>
                    <div style={{ marginTop: 6 }}>{reservation.address || "-"}</div>

                    <div style={{ marginTop: 16 }}>
                      <div className="muted small">Check-out</div>
                      <div style={{ marginTop: 6 }}>{isValidDate(checkOut) ? formatDate(checkOut) : "-"}</div>
                    </div>
                  </div>

                  <div>
                    <div className="muted small">Check-in</div>
                    <div style={{ marginTop: 6 }}>{isValidDate(checkIn) ? formatDate(checkIn) : "-"}</div>

                    <div style={{ marginTop: 16 }}>
                      <div className="muted small">Access</div>
                      <div style={{ marginTop: 6 }} className="muted">
                        {phase === "before" ? "Not active yet" : phase === "active" ? "Active" : "Ended"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2) STEP BY STEP (PRO) */}
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">Step-by-step access</div>
                <div className="muted small" style={{ textAlign: "right" }}>
                  {buttonsEnabled ? "Available now" : "Available during your reservation window"}
                </div>
              </div>

              <div className="cardBody">
                {orderedSteps.length === 0 ? (
                  <div className="muted">No access steps configured yet.</div>
                ) : (
                  <div style={{ display: "grid", gap: 18 }}>
                    {orderedSteps.map((step, idx) => {
                      const isLoading = !!loadingByStep[step.id];
                      const result = resultByStep[step.id] ?? "idle";
                      const actionLabel = isLoading ? "Unlocking…" : step.actionLabel || "Unlock";
                      const disabled = !buttonsEnabled || isLoading;

                      const photo = resolveStepPhoto(step.id, step.photoUrl, reservation.photos);

                      return (
                        <div
                          key={step.id}
                          style={{
                            padding: 14,
                            borderRadius: 18,
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <SectionHeader
                            index={idx + 1}
                            title={step.title}
                            subtitle={stepSubtitle(step.id)}
                            right={
                              !buttonsEnabled ? (
                                <div className="muted small">Available at check-in</div>
                              ) : (
                                <div className="muted small">Tap to unlock</div>
                              )
                            }
                          />

                          <InstructionPhoto src={photo} alt={`${step.id}-photo`} />

                          {/* Texto del backend + botón */}
                          <StepCard
                            title="Instructions"
                            description={step.description}
                            actionLabel={actionLabel}
                            disabled={disabled}
                            onAction={() => unlockStep(step.id)}
                          />

                          {result !== "idle" && (
                            <div className="muted small" style={{ marginTop: 10, marginLeft: 4 }}>
                              {result === "success" ? "✅ Unlocked" : "❌ Failed — try again"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 3) MAP */}
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">Location</div>
              </div>
              <div className="cardBody">
                <MapEmbed address={mapAddress} />
                <div className="muted small" style={{ marginTop: 8 }}>
                  {mapAddress}
                </div>
              </div>
            </div>

            {/* 4) WIFI FINAL */}
            <WifiBlock wifi={reservation.wifi} />
          </>
        )}
      </div>
    </div>
  );
}
