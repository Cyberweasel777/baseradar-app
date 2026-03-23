export interface MoverToken {
  symbol: string;
  name: string;
  chain: string;
  velocityScore: number;
  signal: "SURGE" | "RISING" | "STABLE" | "FADING";
  volume24h: number;
  volumeChange1h: number;
  url: string;
}

export interface DailyMoversResponse {
  date: string;
  updatedAt: string;
  gainers: MoverToken[];
  decliners: MoverToken[];
  totalTracked: number;
}

export interface EcosystemSummary {
  rank: number;
  slug: string;
  name: string;
  avgScore: number;
  surgeCount: number;
  risingCount: number;
  totalTokens: number;
  delta7d: number | null;
  topToken: { symbol: string; velocityScore: number; signal: string };
}

export interface EcosystemRankingsResponse {
  updatedAt: string;
  ecosystems: EcosystemSummary[];
}

export interface EcosystemDetailResponse {
  updatedAt: string;
  ecosystem: EcosystemSummary & { topTokens: MoverToken[] };
}

export interface AssetResponse {
  updatedAt: string;
  asset: MoverToken & { chainRank: number; chainTotal: number; marketCap: number; holders: number };
}
