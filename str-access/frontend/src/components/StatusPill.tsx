import { type AccessPhase } from "../mock/reservation";

export function StatusPill({ phase }: { phase: AccessPhase }) {
  const label =
    phase === "active" ? "Access active" : phase === "before" ? "Not active yet" : "Reservation ended";

  return (
    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: phase === "active" ? "#2ecc71" : phase === "before" ? "#f1c40f" : "#95a5a6",
          opacity: 0.9,
        }}
      />
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
    </div>
  );
}
