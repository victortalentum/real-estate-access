// frontend/src/components/Countdown.tsx
import { formatDuration } from "../utils/time";

type Props = {
  target: Date;
  now: Date;
  label?: string;
};

export function Countdown({ target, now, label }: Props) {
  const t = target?.getTime?.();
  const n = now?.getTime?.();

  // Guard: si target/now no son Date válidos -> no pintes NaN
  if (!Number.isFinite(t) || !Number.isFinite(n)) {
    return (
      <div>
        {label && <div className="muted small">{label}</div>}
        <div style={{ fontWeight: 700 }}>—</div>
      </div>
    );
  }

  const ms = Math.max(0, t - n);

  // Si ya pasó el tiempo, mostramos 0s en vez de NaN o negativo
  return (
    <div>
      {label && <div className="muted small">{label}</div>}
      <div style={{ fontWeight: 700 }}>{formatDuration(ms)}</div>
    </div>
  );
}
