"use client";

import { useState } from "react";
import type { District } from "@/data/apartments";
import { DISTRICT_INFO } from "@/data/district-info";

function StatusBadge({ status }: { status: "시행중" | "예정" | "해제" }) {
  const colors = {
    시행중: "bg-red-50 text-red-700 border-red-200",
    예정: "bg-amber-50 text-amber-700 border-amber-200",
    해제: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[status]}`}
    >
      {status}
    </span>
  );
}

function ImpactBadge({ type }: { type: "호재" | "악재" | "관망" }) {
  const colors = {
    호재: "bg-red-50 text-red-600",
    악재: "bg-blue-50 text-blue-600",
    관망: "bg-gray-50 text-gray-600",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[type]}`}>
      {type}
    </span>
  );
}

export default function DistrictInfoPanel({
  district,
}: {
  district: District;
}) {
  const info = DISTRICT_INFO[district];
  const [tab, setTab] = useState<"regulation" | "redevelopment">("regulation");
  const [expandedReg, setExpandedReg] = useState<number | null>(null);
  const [expandedDev, setExpandedDev] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-base mb-3">
        {district} 규제 &middot; 개발 정보
      </h3>

      {/* 탭 */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setTab("regulation")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            tab === "regulation"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          }`}
        >
          규제 현황
        </button>
        <button
          onClick={() => setTab("redevelopment")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            tab === "redevelopment"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          }`}
        >
          재개발 &middot; 재건축
        </button>
      </div>

      {/* 규제 현황 */}
      {tab === "regulation" && (
        <div className="space-y-2">
          {info.regulations.map((reg, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedReg(expandedReg === i ? null : i)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={reg.status} />
                  <span className="text-xs text-gray-400">{reg.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{reg.title}</h4>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedReg === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {expandedReg === i && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-[10px] font-medium text-gray-500 mb-1">
                      규제 내용
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {reg.description}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      reg.impactType === "positive"
                        ? "bg-green-50"
                        : reg.impactType === "negative"
                        ? "bg-red-50"
                        : "bg-amber-50"
                    }`}
                  >
                    <div className="text-[10px] font-medium text-gray-500 mb-1">
                      시세 영향 분석
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {reg.impact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 재개발/재건축 */}
      {tab === "redevelopment" && (
        <div className="space-y-2">
          {info.redevelopments.map((dev, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedDev(expandedDev === i ? null : i)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ImpactBadge type={dev.priceImpact} />
                  <span className="text-xs text-gray-400">{dev.stage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{dev.name}</h4>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedDev === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {expandedDev === i && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-gray-500">
                        사업 개요
                      </span>
                      <span className="text-[10px] text-gray-400">
                        완료 예상: {dev.expectedCompletion}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {dev.description}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      dev.priceImpact === "호재"
                        ? "bg-red-50"
                        : dev.priceImpact === "악재"
                        ? "bg-blue-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-[10px] font-medium text-gray-500 mb-1">
                      시세 영향 분석
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {dev.detail}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
