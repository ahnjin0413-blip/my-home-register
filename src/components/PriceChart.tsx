"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  generatePriceHistory,
  toYearlySummary,
  type PriceHistoryPoint,
  type YearSummary,
} from "@/data/price-history";

function fmtEok(manwon: number): string {
  const eok = manwon / 10000;
  return eok >= 1 ? `${eok.toFixed(1)}억` : `${manwon.toLocaleString()}만`;
}

function fmtFull(manwon: number): string {
  const eok = Math.floor(manwon / 10000);
  const man = manwon % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
  if (eok > 0) return `${eok}억`;
  return `${manwon.toLocaleString()}만`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
      <div className="font-bold text-gray-800 mb-1.5">
        {label}
        <span className="text-[10px] font-normal text-primary ml-2">
          클릭하여 상세 보기
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-gray-500">평균</span>
          <span className="font-semibold ml-auto">{fmtEok(d.avgPrice)}</span>
        </div>
        {d.maxPrice && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-gray-500">최고</span>
            <span className="font-semibold ml-auto">{fmtEok(d.maxPrice)}</span>
          </div>
        )}
        {d.minPrice && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-300" />
            <span className="text-gray-500">최저</span>
            <span className="font-semibold ml-auto">{fmtEok(d.minPrice)}</span>
          </div>
        )}
        {(d.volume || d.totalVolume) && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-gray-500">거래량</span>
            <span className="font-semibold ml-auto">
              {d.volume || d.totalVolume}건
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const Q_LABEL = ["1~3월", "4~6월", "7~9월", "10~12월"];

export default function PriceChart({
  complexId,
  currentPriceMax,
  builtYear,
}: {
  complexId: string;
  currentPriceMax: number;
  builtYear: number;
}) {
  const [view, setView] = useState<"yearly" | "quarterly">("yearly");
  const [range, setRange] = useState<"all" | "10y" | "5y" | "3y">("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const quarterly = useMemo(
    () => generatePriceHistory(complexId, currentPriceMax, builtYear),
    [complexId, currentPriceMax, builtYear]
  );
  const yearly = useMemo(() => toYearlySummary(quarterly), [quarterly]);

  const cutoffYear =
    range === "10y" ? 2016 : range === "5y" ? 2021 : range === "3y" ? 2023 : 0;

  const data: (PriceHistoryPoint | YearSummary)[] =
    view === "yearly"
      ? yearly.filter((d) => d.year >= cutoffYear)
      : quarterly.filter((d) => d.year >= cutoffYear);

  const allPrices = data.map((d) => d.maxPrice);
  const allMin = data.map((d) => d.minPrice);
  const yMin = Math.floor(Math.min(...allMin) / 10000) * 10000;
  const yMax = Math.ceil(Math.max(...allPrices) / 10000) * 10000;

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  const totalChange =
    firstPoint && lastPoint
      ? (
          ((lastPoint.avgPrice - firstPoint.avgPrice) / firstPoint.avgPrice) *
          100
        ).toFixed(0)
      : "0";

  // 선택된 연도의 분기별 거래 내역
  const selectedQuarters = useMemo(
    () =>
      selectedYear
        ? quarterly.filter((p) => p.year === selectedYear)
        : [],
    [selectedYear, quarterly]
  );

  // 전년 대비 변동
  const prevYearAvg = useMemo(() => {
    if (!selectedYear) return null;
    const prev = yearly.find((y) => y.year === selectedYear - 1);
    return prev ? prev.avgPrice : null;
  }, [selectedYear, yearly]);

  const handleChartClick = useCallback((chartData: any) => {
    if (!chartData?.activePayload?.[0]?.payload) return;
    const point = chartData.activePayload[0].payload;
    const year = point.year as number;
    setSelectedYear((prev) => (prev === year ? null : year));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-base">시세 추이 (84㎡ 기준)</h2>
        <span className="text-xs text-gray-400">
          출처: 국토교통부 실거래가
        </span>
      </div>

      {firstPoint && lastPoint && (
        <div className="flex items-center gap-4 mb-4 text-xs">
          <div>
            <span className="text-gray-400">
              {(firstPoint as any).year || ""}년
            </span>{" "}
            <span className="font-semibold">{fmtEok(firstPoint.avgPrice)}</span>
          </div>
          <span className="text-gray-300">→</span>
          <div>
            <span className="text-gray-400">현재</span>{" "}
            <span className="font-semibold">{fmtEok(lastPoint.avgPrice)}</span>
          </div>
          <span
            className={`font-bold ${
              Number(totalChange) >= 0 ? "text-red-500" : "text-blue-500"
            }`}
          >
            {Number(totalChange) >= 0 ? "+" : ""}
            {totalChange}%
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {(["all", "10y", "5y", "3y"] as const).map((r) => {
            const labels = {
              all: "전체",
              "10y": "10년",
              "5y": "5년",
              "3y": "3년",
            };
            return (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  setSelectedYear(null);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  range === r
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1 bg-gray-100 p-0.5 rounded-md">
          <button
            onClick={() => {
              setView("yearly");
              setSelectedYear(null);
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              view === "yearly"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500"
            }`}
          >
            연도별
          </button>
          <button
            onClick={() => {
              setView("quarterly");
              setSelectedYear(null);
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              view === "quarterly"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500"
            }`}
          >
            분기별
          </button>
        </div>
      </div>

      {/* 차트 */}
      <div style={{ width: "100%", height: 300 }} className="cursor-pointer">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              interval={view === "quarterly" ? 3 : 0}
              angle={view === "quarterly" ? -45 : 0}
              textAnchor={view === "quarterly" ? "end" : "middle"}
              height={view === "quarterly" ? 50 : 30}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}억`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={28}
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="maxPrice"
              stroke="none"
              fill="#dbeafe"
              fillOpacity={0.4}
              name="최고가"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="minPrice"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
              name="최저가"
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2563eb", stroke: "#fff", strokeWidth: 2, cursor: "pointer" }}
              activeDot={{ r: 7, fill: "#2563eb", stroke: "#fff", strokeWidth: 3, cursor: "pointer" }}
              name="평균 매매가"
            />
            <Bar
              dataKey={view === "yearly" ? "totalVolume" : "volume"}
              fill="#fbbf24"
              opacity={0.5}
              barSize={view === "quarterly" ? 4 : 12}
              name="거래량"
              yAxisId="right"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: "#d1d5db" }}
              tickFormatter={(v: number) => `${v}`}
              width={30}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 연도 선택 버튼 바 */}
      <div className="mt-3">
        <div className="text-[10px] text-gray-400 mb-1.5">연도를 선택하면 실거래 내역을 확인할 수 있습니다</div>
        <div className="flex flex-wrap gap-1">
          {yearly
            .filter((y) => y.year >= cutoffYear)
            .map((y) => (
              <button
                key={y.year}
                onClick={() =>
                  setSelectedYear((prev) =>
                    prev === y.year ? null : y.year
                  )
                }
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedYear === y.year
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-primary"
                }`}
              >
                {y.year}
              </button>
            ))}
        </div>
      </div>

      {/* 선택된 연도 실거래 상세 */}
      {selectedYear && selectedQuarters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span className="text-primary">{selectedYear}년</span>
              실거래 내역
              {prevYearAvg && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    selectedQuarters[0].avgPrice > prevYearAvg
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  전년 대비{" "}
                  {selectedQuarters[0].avgPrice > prevYearAvg ? "+" : ""}
                  {(
                    ((selectedQuarters.reduce((s, q) => s + q.avgPrice, 0) /
                      selectedQuarters.length -
                      prevYearAvg) /
                      prevYearAvg) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              )}
            </h3>
            <button
              onClick={() => setSelectedYear(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              닫기 &times;
            </button>
          </div>

          <div className="space-y-2">
            {selectedQuarters.map((q) => {
              const prevQ =
                selectedQuarters.find(
                  (p) => p.quarter === q.quarter - 1
                ) ||
                quarterly.find(
                  (p) =>
                    p.year === q.year - 1 && p.quarter === 4
                );
              const qChange =
                prevQ
                  ? (
                      ((q.avgPrice - prevQ.avgPrice) / prevQ.avgPrice) *
                      100
                    ).toFixed(1)
                  : null;

              return (
                <div
                  key={q.quarter}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        Q{q.quarter}{" "}
                        <span className="font-normal text-gray-400">
                          ({Q_LABEL[q.quarter - 1]})
                        </span>
                      </span>
                      {qChange && (
                        <span
                          className={`text-[10px] font-semibold ${
                            Number(qChange) >= 0
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {Number(qChange) >= 0 ? "▲" : "▼"}{" "}
                          {Math.abs(Number(qChange))}%
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      거래 {q.volume}건
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-[9px] text-gray-500">평균</div>
                      <div className="text-xs font-bold text-primary">
                        {fmtFull(q.avgPrice)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-[9px] text-gray-500">최고</div>
                      <div className="text-xs font-bold text-red-600">
                        {fmtFull(q.maxPrice)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-[9px] text-gray-500">최저</div>
                      <div className="text-xs font-bold text-blue-600">
                        {fmtFull(q.minPrice)}
                      </div>
                    </div>
                  </div>

                  {/* 분기 내 시세 바 */}
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-gray-400 w-6">최저</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                        {(() => {
                          const yearData = selectedQuarters;
                          const allMax = Math.max(
                            ...yearData.map((d) => d.maxPrice)
                          );
                          const allMn = Math.min(
                            ...yearData.map((d) => d.minPrice)
                          );
                          const total = allMax - allMn || 1;
                          const left =
                            ((q.minPrice - allMn) / total) * 100;
                          const width =
                            ((q.maxPrice - q.minPrice) / total) * 100;
                          return (
                            <div
                              className="absolute h-full bg-gradient-to-r from-blue-400 to-primary rounded-full"
                              style={{
                                left: `${left}%`,
                                width: `${Math.max(width, 4)}%`,
                              }}
                            />
                          );
                        })()}
                      </div>
                      <span className="text-[9px] text-gray-400 w-6 text-right">
                        최고
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 연간 요약 */}
          {(() => {
            const ys = yearly.find((y) => y.year === selectedYear);
            if (!ys) return null;
            return (
              <div className="mt-3 bg-primary/5 rounded-xl p-4">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  {selectedYear}년 연간 요약
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-[9px] text-gray-400">연평균</div>
                    <div className="text-xs font-bold text-primary">
                      {fmtEok(ys.avgPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400">최고가</div>
                    <div className="text-xs font-bold text-red-600">
                      {fmtEok(ys.maxPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400">최저가</div>
                    <div className="text-xs font-bold text-blue-600">
                      {fmtEok(ys.minPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400">총 거래</div>
                    <div className="text-xs font-bold text-gray-700">
                      {ys.totalVolume}건
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
