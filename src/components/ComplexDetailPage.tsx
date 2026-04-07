"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { APARTMENT_DATA, type District } from "@/data/apartments";
import { getTransactions, type Transaction } from "@/data/transactions";
import { DISTRICT_INFO } from "@/data/district-info";

const PriceChart = dynamic(() => import("./PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 h-[380px] flex items-center justify-center text-gray-400 text-sm">
      차트 로딩 중...
    </div>
  ),
});

function fmt(price: number): string {
  const eok = Math.floor(price / 10000);
  const man = price % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
  if (eok > 0) return `${eok}억`;
  return `${price.toLocaleString()}만`;
}

function fmtShort(price: number): string {
  if (price >= 10) {
    const e = Math.floor(price);
    const c = Math.round((price - e) * 10);
    return c > 0 ? `${e}억 ${c},000만` : `${e}억`;
  }
  return `${Math.round(price * 1000).toLocaleString()}만`;
}

function TypeBadge({ type }: { type: Transaction["type"] }) {
  const c = { 매매: "bg-red-50 text-red-700", 전세: "bg-blue-50 text-blue-700", 월세: "bg-green-50 text-green-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c[type]}`}>{type}</span>;
}

export default function ComplexDetailPage({ complexId }: { complexId: string }) {
  const complex = APARTMENT_DATA.find((a) => a.id === complexId);
  const [txFilter, setTxFilter] = useState<"전체" | "매매" | "전세">("전체");
  const [txPage, setTxPage] = useState(0);
  const TX_PER_PAGE = 10;

  if (!complex) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">단지를 찾을 수 없습니다</p>
        <Link href="/explore" className="text-primary font-medium hover:underline">시세 지도로 돌아가기</Link>
      </div>
    );
  }

  const district = complex.district as District;
  const districtInfo = DISTRICT_INFO[district];
  const transactions = getTransactions(complex.id);
  const filtered = txFilter === "전체" ? transactions : transactions.filter((t) => t.type === txFilter);
  const sales = transactions.filter((t) => t.type === "매매");
  const avgPrice = sales.length > 0 ? Math.round(sales.reduce((s, t) => s + t.price, 0) / sales.length) : 0;
  const maxPrice = sales.length > 0 ? Math.max(...sales.map((t) => t.price)) : 0;
  const minPrice = sales.length > 0 ? Math.min(...sales.map((t) => t.price)) : 0;

  const sameDistrict = APARTMENT_DATA.filter((a) => a.district === district && a.id !== complex.id)
    .sort((a, b) => b.priceMax - a.priceMax)
    .slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 뒤로가기 */}
      <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4">
        &larr; 시세 지도로 돌아가기
      </Link>

      {/* 단지 헤더 */}
      <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-2xl p-6 mb-4 relative">
        <div className="absolute top-4 right-4">
          <FavoriteButton complexId={complex.id} />
        </div>
        <div className="text-xs text-white/60 mb-1">{district}</div>
        <h1 className="text-xl font-bold mb-1">{complex.name}</h1>
        <p className="text-sm text-white/70 mb-4">{complex.address}</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-[10px] text-white/60">시세 (84㎡)</div>
            <div className="text-sm font-bold">{fmtShort(complex.priceMin)}~{fmtShort(complex.priceMax)}</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-[10px] text-white/60">전월 대비</div>
            <div className="text-sm font-bold">+{complex.priceChange.toFixed(1)}%</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-[10px] text-white/60">세대 / 준공</div>
            <div className="text-sm font-bold">{complex.totalUnits.toLocaleString()} · {complex.builtYear}</div>
          </div>
        </div>
      </div>

      {/* 실거래가 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base">최근 실거래가</h2>
          <span className="text-[10px] text-gray-400">출처: 국토교통부 실거래가 공개시스템</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-gray-500">평균 매매가</div>
            <div className="text-sm font-bold text-primary">{fmt(avgPrice)}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-gray-500">최고가</div>
            <div className="text-sm font-bold text-red-600">{fmt(maxPrice)}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-gray-500">최저가</div>
            <div className="text-sm font-bold text-blue-600">{fmt(minPrice)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            {(["전체", "매매", "전세"] as const).map((f) => (
              <button key={f} onClick={() => { setTxFilter(f); setTxPage(0); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${txFilter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {f}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">{filtered.length}건</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-gray-400 border-b border-gray-100">
              <th className="text-left py-2 font-medium">계약일</th>
              <th className="text-left py-2 font-medium">유형</th>
              <th className="text-left py-2 font-medium">면적</th>
              <th className="text-center py-2 font-medium">층</th>
              <th className="text-right py-2 font-medium">거래가</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(txPage * TX_PER_PAGE, (txPage + 1) * TX_PER_PAGE).map((t, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 text-gray-600">{t.date}</td>
                <td className="py-2.5"><TypeBadge type={t.type} /></td>
                <td className="py-2.5 text-gray-600">{t.area}㎡</td>
                <td className="py-2.5 text-center text-gray-600">{t.floor}층</td>
                <td className="py-2.5 text-right font-semibold">{fmt(t.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-6">해당 유형의 거래 내역이 없습니다</p>}

        {/* 페이지네이션 */}
        {filtered.length > TX_PER_PAGE && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setTxPage((p) => Math.max(0, p - 1))}
              disabled={txPage === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <span className="text-xs text-gray-500">
              {txPage + 1} / {Math.ceil(filtered.length / TX_PER_PAGE)}
            </span>
            <button
              onClick={() => setTxPage((p) => Math.min(Math.ceil(filtered.length / TX_PER_PAGE) - 1, p + 1))}
              disabled={txPage >= Math.ceil(filtered.length / TX_PER_PAGE) - 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 20년 시세 추이 차트 */}
      <PriceChart
        complexId={complex.id}
        currentPriceMax={complex.priceMax}
        builtYear={complex.builtYear}
      />

      {/* 규제 현황 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h2 className="font-bold text-base mb-3">{district} 규제 현황</h2>
        <div className="space-y-2">
          {districtInfo.regulations.map((r, i) => (
            <div key={i} className={`p-4 rounded-xl ${r.impactType === "positive" ? "bg-green-50" : r.impactType === "negative" ? "bg-red-50" : "bg-amber-50"}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.status === "시행중" ? "border-red-200 text-red-700" : r.status === "해제" ? "border-green-200 text-green-700" : "border-amber-200 text-amber-700"}`}>{r.status}</span>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{r.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">{r.description}</p>
              <div className="bg-white/60 rounded-lg p-2.5">
                <div className="text-[10px] font-medium text-gray-500 mb-0.5">시세 영향</div>
                <p className="text-xs text-gray-700 leading-relaxed">{r.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 재개발/재건축 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h2 className="font-bold text-base mb-3">{district} 재개발 · 재건축</h2>
        <div className="space-y-2">
          {districtInfo.redevelopments.map((d, i) => (
            <div key={i} className={`p-4 rounded-xl ${d.priceImpact === "호재" ? "bg-red-50/50" : d.priceImpact === "악재" ? "bg-blue-50/50" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d.priceImpact === "호재" ? "bg-red-50 text-red-600" : d.priceImpact === "악재" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{d.priceImpact}</span>
                <span className="text-xs text-gray-400">{d.stage}</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{d.name}</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">{d.description}</p>
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
                <span>완료 예상: {d.expectedCompletion}</span>
              </div>
              <div className="bg-white/60 rounded-lg p-2.5">
                <div className="text-[10px] font-medium text-gray-500 mb-0.5">시세 영향</div>
                <p className="text-xs text-gray-700 leading-relaxed">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주변 단지 비교 */}
      {sameDistrict.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="font-bold text-base mb-3">{district} 주변 단지 시세</h2>
          <div className="space-y-2">
            {sameDistrict.map((c) => (
              <Link key={c.id} href={`/complex?id=${c.id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-[10px] text-gray-400">{c.totalUnits.toLocaleString()}세대 · {c.builtYear}년</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{fmtShort(c.priceMin)}~{fmtShort(c.priceMax)}</div>
                  <div className={`text-[10px] ${c.priceChange > 0 ? "text-red-500" : "text-blue-500"}`}>
                    {c.priceChange > 0 ? "+" : ""}{c.priceChange.toFixed(1)}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
