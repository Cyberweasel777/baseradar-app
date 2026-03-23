import type { DailyMoversResponse, EcosystemRankingsResponse, EcosystemDetailResponse, AssetResponse } from "./types";

const BASE = process.env.NEXT_PUBLIC_KING_BACKEND_URL || "https://king-backend.fly.dev";

export async function getDailyMovers(): Promise<DailyMoversResponse> {
  const res = await fetch(`${BASE}/api/baseradar/daily-movers`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch daily movers");
  return res.json();
}

export async function getEcosystemRankings(): Promise<EcosystemRankingsResponse> {
  const res = await fetch(`${BASE}/api/baseradar/ecosystem/rankings`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch ecosystem rankings");
  return res.json();
}

export async function getEcosystemSummary(chain: string): Promise<EcosystemDetailResponse> {
  const res = await fetch(`${BASE}/api/baseradar/ecosystem/${chain}/summary`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch ecosystem: ${chain}`);
  return res.json();
}

export async function getAsset(symbol: string): Promise<AssetResponse> {
  const res = await fetch(`${BASE}/api/baseradar/asset/${symbol.toLowerCase()}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch asset: ${symbol}`);
  return res.json();
}
