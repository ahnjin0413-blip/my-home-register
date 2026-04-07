"use client";

import { useState } from "react";
import type { ApartmentComplex } from "@/data/apartments";
import { getTransactions, type Transaction } from "@/data/transactions";

function formatTransactionPrice(price: number): string {
  const eok = Math.floor(price / 10000);
  const man = price % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
  if (eok > 0) return `${eok}억`;
  return `${price.toLocaleString()}만`;
}

function TypeBadge({ type }: { type: Transaction["type"] }) {
  const colors = {
    매매: "bg-red-50 text-red-700",
    전세: "bg-blue-50 text-blue-700",
    월세: "bg-green-50 text-green-700",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[type]}`}
    >
      {type}
    </span>
  );
}

export default function ComplexDetail({
  complex,
  onClose,
}: {
  complex: ApartmentComplex;
  onClose: () => void;
}) {
  const transactions = getTransactions(complex.id);
  const [filter, setFilter] = useState<"전체" | "매매" | "전세">("전체");

  const filtered =
    filter === "전체" ? transactions : transactions.filter((t) => t.type === filter);

  const salesOnly = transactions.filter((t) => t.type === "매매");
  const avgPrice =
    salesOnly.length > 0
      ? Math.round(salesOnly.reduce((s, t) => s + t.price, 0) / salesOnly.length)
      : 0;
  const maxPrice = salesOnly.length > 0 ? Math.max(...salesOnly.map((t) => t.price)) : 0;
  const minPrice = salesOnly.length > 0 ? Math.min(...salesOnly.map((t) => t.price)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{complex.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{complex.address}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 요약 통계 */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <div className="text-[10px] text-gray-500">평균 매매가</div>
              <div className="text-sm font-bold text-primary">
                {formatTransactionPrice(avgPrice)}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-2.5 text-center">
              <div className="text-[10px] text-gray-500">최고가</div>
              <div className="text-sm font-bold text-red-600">
                {formatTransactionPrice(maxPrice)}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2.5 text-center">
              <div className="text-[10px] text-gray-500">최저가</div>
              <div className="text-sm font-bold text-blue-600">
                {formatTransactionPrice(minPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {(["전체", "매매", "전세"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            출처: 국토교통부 실거래가 공개시스템
          </span>
        </div>

        {/* 거래 내역 리스트 */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
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
              {filtered.map((t, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-2.5 text-gray-600">{t.date}</td>
                  <td className="py-2.5">
                    <TypeBadge type={t.type} />
                  </td>
                  <td className="py-2.5 text-gray-600">{t.area}㎡</td>
                  <td className="py-2.5 text-center text-gray-600">
                    {t.floor}층
                  </td>
                  <td className="py-2.5 text-right font-semibold">
                    {formatTransactionPrice(t.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              해당 유형의 거래 내역이 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
