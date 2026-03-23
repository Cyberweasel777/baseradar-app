const SIGNAL_STYLES: Record<string, string> = {
  SURGE: "bg-emerald-400/15 text-emerald-300",
  RISING: "bg-blue-400/15 text-blue-300",
  STABLE: "bg-zinc-700/60 text-zinc-400",
  FADING: "bg-red-400/15 text-red-300",
};

export function SignalBadge({ signal }: { signal: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SIGNAL_STYLES[signal] ?? SIGNAL_STYLES.STABLE}`}>
      {signal}
    </span>
  );
}
