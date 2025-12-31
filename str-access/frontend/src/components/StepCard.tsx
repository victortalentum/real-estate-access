import { useState } from "react";

export type StepCardProps = {
  title: string;
  description: string;

  /**
   * Texto del botón (lo que tú estás pasando desde ReservationPage)
   */
  actionLabel?: string;

  /**
   * Deshabilitar el botón
   */
  disabled?: boolean;

  /**
   * Acción al pulsar
   */
  onAction?: () => void | Promise<void>;
};

export function StepCard({
  title,
  description,
  actionLabel = "Unlock",
  disabled = false,
  onAction,
}: StepCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!onAction || disabled || loading) return;
    try {
      setLoading(true);
      await onAction();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stepCard">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>{title}</div>
          <div className="muted small">{description}</div>
        </div>

        <button
          className="btn"
          onClick={handleClick}
          disabled={disabled || loading}
          aria-disabled={disabled || loading}
        >
          {loading ? "Working..." : actionLabel}
        </button>
      </div>
    </div>
  );
}
