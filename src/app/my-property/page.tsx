"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import { getTransactions } from "@/data/transactions";
import { APARTMENT_DATA } from "@/data/apartments";
import { DISTRICT_INFO } from "@/data/district-info";
import type { District } from "@/data/apartments";
import GainCalculator from "@/components/GainCalculator";

const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 h-[380px] flex items-center justify-center text-gray-400 text-sm">
      차트 로딩 중...
    </div>
  ),
});

function formatPrice(manwon: number): string {
  const eok = Math.floor(manwon / 10000);
  const man = manwon % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
  if (eok > 0) return `${eok}억`;
  return `${manwon.toLocaleString()}만`;
}

function formatShortPrice(price: number): string {
  if (price >= 10) {
    const eok = Math.floor(price);
    const cheon = Math.round((price - eok) * 10);
    return cheon > 0 ? `${eok}억 ${cheon},000만` : `${eok}억`;
  }
  return `${Math.round(price * 1000).toLocaleString()}만`;
}

export default function MyPropertyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { property } = useProperty();

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        로딩 중...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
        </div>
        <p className="text-gray-500 mb-4">등록된 아파트가 없습니다</p>
        <Link
          href="/register"
          className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
        >
          내 아파트 등록하고 시세 확인하기
        </Link>
      </div>
    );
  }

  const transactions = getTransactions(property.complexId);
  const salesTx = transactions.filter((t) => t.type === "매매");
  const jeonse = transactions.filter((t) => t.type === "전세");

  const complex = APARTMENT_DATA.find((a) => a.id === property.complexId);
  const district = property.district as District;
  const districtInfo = DISTRICT_INFO[district];

  // 같은 구 다른 단지와 비교
  const sameDistrictComplexes = APARTMENT_DATA.filter(
    (a) => a.district === district && a.id !== property.complexId
  ).sort((a, b) => b.priceMax - a.priceMax);

  const avgPrice =
    salesTx.length > 0
      ? Math.round(salesTx.reduce((s, t) => s + t.price, 0) / salesTx.length)
      : 0;
  const maxPrice =
    salesTx.length > 0 ? Math.max(...salesTx.map((t) => t.price)) : 0;
  const latestJeonse =
    jeonse.length > 0 ? jeonse[0].price : 0;

  // 간이 시세 추이 (최근 거래 기반)
  const recentSales = salesTx.slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 내 아파트 정보 헤더 */}
      <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-2xl p-6 mb-4">
        <div className="text-sm text-white/70 mb-1">{user.name}님의 아파트</div>
        <h2 className="text-xl font-bold mb-1">{property.complexName}</h2>
        <p className="text-sm text-white/80 mb-4">
          {property.dong} {property.ho}호 · {property.address}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-[10px] text-white/60">예상 시세</div>
            <div className="text-base font-bold">
              {formatShortPrice(property.priceMin)}~
              {formatShortPrice(property.priceMax)}
            </div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-[10px] text-white/60">전월 대비</div>
            <div className="text-base font-bold">
              +{property.priceChange.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-[10px] text-white/60">총 세대</div>
            <div className="text-base font-bold">
              {property.totalUnits.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 실거래 내역 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">최근 실거래 내역</h3>
          <span className="text-[10px] text-gray-400">
            출처: 국토교통부 실거래가
          </span>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-gray-500">평균 매매가</div>
            <div className="text-sm font-bold text-primary">
              {formatPrice(avgPrice)}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-gray-500">최고 거래가</div>
            <div className="text-sm font-bold text-red-600">
              {formatPrice(maxPrice)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-gray-500">최근 전세가</div>
            <div className="text-sm font-bold text-blue-600">
              {latestJeonse > 0 ? formatPrice(latestJeonse) : "-"}
            </div>
          </div>
        </div>

        {/* 거래 테이블 */}
        <div className="overflow-x-auto">
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
              {recentSales.map((t, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2.5 text-gray-600">{t.date}</td>
                  <td className="py-2.5">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                      매매
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-600">{t.area}㎡</td>
                  <td className="py-2.5 text-center text-gray-600">
                    {t.floor}층
                  </td>
                  <td className="py-2.5 text-right font-semibold">
                    {formatPrice(t.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 20년 시세 추이 차트 */}
      {complex && (
        <PriceChart
          complexId={complex.id}
          currentPriceMax={complex.priceMax}
          builtYear={complex.builtYear}
        />
      )}

      {/* 주변 단지 시세 비교 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h3 className="font-bold text-base mb-4">
          {district} 주변 단지 시세 비교
        </h3>
        <div className="space-y-2">
          {/* 내 아파트 강조 */}
          {complex && (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      내 아파트
                    </span>
                    <span className="font-semibold text-sm">
                      {complex.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">
                    {formatShortPrice(complex.priceMin)}~
                    {formatShortPrice(complex.priceMax)}
                  </div>
                  <div className="text-[10px] text-red-500">
                    +{complex.priceChange.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
          {sameDistrictComplexes.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border border-gray-100 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-sm">{c.name}</span>
                <div className="text-[10px] text-gray-400">
                  {c.totalUnits.toLocaleString()}세대 · {c.builtYear}년
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">
                  {formatShortPrice(c.priceMin)}~{formatShortPrice(c.priceMax)}
                </div>
                <div
                  className={`text-[10px] ${
                    c.priceChange > 0 ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {c.priceChange > 0 ? "+" : ""}
                  {c.priceChange.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 규제/호재 요약 */}
      {districtInfo && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-bold text-base mb-3">
            {district} 주요 이슈
          </h3>
          <div className="space-y-2">
            {districtInfo.regulations.slice(0, 2).map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm ${
                  r.impactType === "positive"
                    ? "bg-green-50"
                    : r.impactType === "negative"
                    ? "bg-red-50"
                    : "bg-amber-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      r.status === "시행중"
                        ? "border-red-200 text-red-700"
                        : r.status === "해제"
                        ? "border-green-200 text-green-700"
                        : "border-amber-200 text-amber-700"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="font-semibold">{r.title}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {r.impact}
                </p>
              </div>
            ))}
            {districtInfo.redevelopments
              .filter((d) => d.priceImpact === "호재")
              .slice(0, 1)
              .map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      호재
                    </span>
                    <span className="font-semibold">{d.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {d.detail}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 시세 차익 계산기 */}
      <GainCalculator />

      {/* 하단 액션 버튼 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/consult"
          className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          매도 상담 신청
        </Link>
        <Link
          href="/alerts"
          className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          시세 알림 설정
        </Link>
      </div>
    </div>
  );
}
