const CHAIN_STYLES: Record<string, string> = {
  solana: "bg-purple-500/20 text-purple-400",
  base: "bg-blue-500/20 text-blue-400",
  ethereum: "bg-indigo-500/20 text-indigo-400",
};

export function ChainBadge({ chain }: { chain: string }) {
  const style = CHAIN_STYLES[chain.toLowerCase()] ?? "bg-zinc-500/20 text-zinc-400";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {chain}
    </span>
  );
}
