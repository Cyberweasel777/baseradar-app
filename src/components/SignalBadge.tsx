const SIGNAL_STYLES: Record<string, string> = {
  SURGE: "bg-green-500/20 text-green-400 border border-green-500/30",
  RISING: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  STABLE: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
  FADING: "bg-red-500/20 text-red-400 border border-red-500/30",
};

export function SignalBadge({ signal }: { signal: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SIGNAL_STYLES[signal] ?? SIGNAL_STYLES.STABLE}`}>
      {signal}
    </span>
  );
}
