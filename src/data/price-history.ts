/**
 * 20년간(2006~2026) 분기별 시세 추이 생성
 * 실제 서비스에서는 국토교통부 실거래가 API 연동
 * 여기서는 각 단지의 현재 시세를 기준으로 현실적인 추이를 역산
 */

export interface PriceHistoryPoint {
  year: number;
  quarter: number;
  label: string;        // "2006 Q1"
  avgPrice: number;     // 만원 단위 (84㎡ 기준)
  minPrice: number;
  maxPrice: number;
  volume: number;       // 거래량
}

// 서울 아파트 시장의 대략적 흐름 반영 (연도별 누적 배율)
// 2006=1.0 기준, 2026 현재가에 맞춰 스케일링
const MARKET_INDEX: Record<number, number> = {
  2006: 0.32, 2007: 0.38, 2008: 0.40, 2009: 0.35,
  2010: 0.37, 2011: 0.40, 2012: 0.38, 2013: 0.36,
  2014: 0.38, 2015: 0.42, 2016: 0.48, 2017: 0.55,
  2018: 0.68, 2019: 0.75, 2020: 0.80, 2021: 0.95,
  2022: 0.88, 2023: 0.85, 2024: 0.90, 2025: 0.95,
  2026: 1.00,
};

// 분기별 미세 변동 (계절성)
const QUARTER_FACTOR = [0.98, 1.01, 1.02, 0.99];

// 간단한 시드 기반 의사난수 (단지별 고유 패턴)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generatePriceHistory(
  complexId: string,
  currentPriceMax: number, // 억 단위
  builtYear: number
): PriceHistoryPoint[] {
  const rng = seededRandom(hashString(complexId));
  const currentManwon = currentPriceMax * 10000; // 만원 단위
  const points: PriceHistoryPoint[] = [];
  const startYear = Math.max(2006, builtYear);

  for (let year = startYear; year <= 2026; year++) {
    for (let q = 1; q <= 4; q++) {
      // 2026년은 Q1까지만
      if (year === 2026 && q > 1) break;

      const marketBase = MARKET_INDEX[year] ?? 1.0;
      const qFactor = QUARTER_FACTOR[q - 1];
      // 단지별 고유 노이즈 (-3% ~ +3%)
      const noise = 1 + (rng() - 0.5) * 0.06;
      const avg = Math.round(currentManwon * marketBase * qFactor * noise);

      // 거래량: 대략 분기당 5~40건, 시장 활황일수록 많음
      const baseVol = 8 + Math.round(rng() * 20);
      const volFactor = year >= 2020 && year <= 2021 ? 1.8 :
                        year === 2022 ? 0.5 :
                        year >= 2018 ? 1.3 : 1.0;
      const volume = Math.max(2, Math.round(baseVol * volFactor));

      // min/max (avg 대비 ±5~10%)
      const spread = 0.05 + rng() * 0.05;
      const minP = Math.round(avg * (1 - spread));
      const maxP = Math.round(avg * (1 + spread));

      points.push({
        year,
        quarter: q,
        label: `${year} Q${q}`,
        avgPrice: avg,
        minPrice: minP,
        maxPrice: maxP,
        volume,
      });
    }
  }

  return points;
}

/** 연도별 요약 (차트 간소화용) */
export interface YearSummary {
  year: number;
  label: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  totalVolume: number;
}

export function toYearlySummary(points: PriceHistoryPoint[]): YearSummary[] {
  const map = new Map<number, PriceHistoryPoint[]>();
  points.forEach((p) => {
    const arr = map.get(p.year) || [];
    arr.push(p);
    map.set(p.year, arr);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, pts]) => ({
      year,
      label: `${year}`,
      avgPrice: Math.round(pts.reduce((s, p) => s + p.avgPrice, 0) / pts.length),
      minPrice: Math.min(...pts.map((p) => p.minPrice)),
      maxPrice: Math.max(...pts.map((p) => p.maxPrice)),
      totalVolume: pts.reduce((s, p) => s + p.volume, 0),
    }));
}
