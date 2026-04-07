"use client";

import { useState } from "react";

function formatKoreanPrice(manwon: number): string {
  if (manwon <= 0) return "0원";
  const eok = Math.floor(manwon / 10000);
  const man = manwon % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${manwon.toLocaleString()}만원`;
}

export default function GainCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(""); // 억 단위 입력
  const [currentPrice, setCurrentPrice] = useState("");
  const [holdingYears, setHoldingYears] = useState("2");
  const [isMultiHome, setIsMultiHome] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function calculate() {
    if (!purchasePrice || !currentPrice) return;
    setShowResult(true);
  }

  const purchase = parseFloat(purchasePrice) * 10000; // 만원 단위
  const current = parseFloat(currentPrice) * 10000;
  const gain = current - purchase;
  const gainRate = purchase > 0 ? ((gain / purchase) * 100).toFixed(1) : "0";
  const years = parseInt(holdingYears) || 0;

  // 양도소득세 간이 계산 (2026 기준 개략)
  // 기본공제 250만원
  const basicDeduction = 250;
  const taxableGain = Math.max(0, gain - basicDeduction);

  // 장기보유특별공제 (1세대 1주택, 2년 이상 보유 시)
  let longTermRate = 0;
  if (!isMultiHome && years >= 2) {
    if (years >= 10) longTermRate = 80;
    else if (years >= 3) longTermRate = 24 + (years - 3) * 8; // 3년 24%, 매년 +8%
    else longTermRate = 0;
  }
  const longTermDeduction = Math.round(taxableGain * (longTermRate / 100));
  const afterLongTerm = taxableGain - longTermDeduction;

  // 세율 계산 (간이 누진세율)
  function calcTax(amount: number): number {
    if (amount <= 0) return 0;
    if (amount <= 1400) return Math.round(amount * 0.06);
    if (amount <= 5000) return 84 + Math.round((amount - 1400) * 0.15);
    if (amount <= 8800) return 624 + Math.round((amount - 5000) * 0.24);
    if (amount <= 15000) return 1536 + Math.round((amount - 8800) * 0.35);
    if (amount <= 30000) return 3706 + Math.round((amount - 15000) * 0.38);
    if (amount <= 50000) return 9406 + Math.round((amount - 30000) * 0.40);
    if (amount <= 100000) return 17406 + Math.round((amount - 50000) * 0.42);
    return 38406 + Math.round((amount - 100000) * 0.45);
  }

  // 다주택 중과세 (2주택 이상: 기본세율 + 20~30%p)
  const baseTax = calcTax(afterLongTerm);
  const additionalRate = isMultiHome ? 0.2 : 0;
  const additionalTax = isMultiHome ? Math.round(afterLongTerm * additionalRate) : 0;
  const totalTax = baseTax + additionalTax;
  const netGain = gain - totalTax;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-base mb-1">시세 차익 계산기</h3>
      <p className="text-xs text-gray-400 mb-4">
        예상 양도차익과 세금을 간편하게 계산해보세요
      </p>

      <div className="space-y-4">
        {/* 매입가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            매입가 (취득가액)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="예: 18.5"
              value={purchasePrice}
              onChange={(e) => {
                setPurchasePrice(e.target.value);
                setShowResult(false);
              }}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              inputMode="decimal"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              억원
            </span>
          </div>
        </div>

        {/* 현재 시세 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            현재 시세 (예상 매도가)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="예: 25.0"
              value={currentPrice}
              onChange={(e) => {
                setCurrentPrice(e.target.value);
                setShowResult(false);
              }}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              inputMode="decimal"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              억원
            </span>
          </div>
        </div>

        {/* 보유 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            보유 기간
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="30"
              placeholder="2"
              value={holdingYears}
              onChange={(e) => {
                setHoldingYears(e.target.value);
                setShowResult(false);
              }}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              inputMode="numeric"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              년
            </span>
          </div>
        </div>

        {/* 다주택 여부 */}
        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={isMultiHome}
            onChange={(e) => {
              setIsMultiHome(e.target.checked);
              setShowResult(false);
            }}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">
              다주택자입니다
            </span>
            <p className="text-xs text-gray-400">
              2주택 이상 보유 시 양도세 중과 적용
            </p>
          </div>
        </label>

        <button
          onClick={calculate}
          disabled={!purchasePrice || !currentPrice}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          계산하기
        </button>
      </div>

      {/* 결과 */}
      {showResult && purchasePrice && currentPrice && (
        <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
          {/* 차익 요약 */}
          <div
            className={`rounded-xl p-4 ${
              gain > 0 ? "bg-red-50" : gain < 0 ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">양도차익</div>
            <div
              className={`text-2xl font-bold ${
                gain > 0
                  ? "text-red-600"
                  : gain < 0
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {gain > 0 ? "+" : ""}
              {formatKoreanPrice(gain)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              수익률 {gain > 0 ? "+" : ""}
              {gainRate}%
            </div>
          </div>

          {/* 세금 상세 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="text-xs font-medium text-gray-500 mb-2">
              양도소득세 산출 내역 (간이)
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">양도차익</span>
              <span>{formatKoreanPrice(gain)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">기본공제</span>
              <span>- {formatKoreanPrice(basicDeduction)}</span>
            </div>
            {longTermRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  장기보유특별공제 ({longTermRate}%)
                </span>
                <span>- {formatKoreanPrice(longTermDeduction)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
              <span className="text-gray-500">과세표준</span>
              <span>{formatKoreanPrice(afterLongTerm)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">산출세액</span>
              <span>{formatKoreanPrice(baseTax)}</span>
            </div>
            {isMultiHome && (
              <div className="flex justify-between text-sm text-red-600">
                <span>다주택 중과 (+20%p)</span>
                <span>+ {formatKoreanPrice(additionalTax)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span>예상 양도소득세</span>
              <span className="text-red-600">
                약 {formatKoreanPrice(totalTax)}
              </span>
            </div>
          </div>

          {/* 순수익 */}
          <div className="bg-primary/5 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500">세후 예상 순수익</div>
                <div className="text-xl font-bold text-primary">
                  {netGain > 0 ? "+" : ""}
                  {formatKoreanPrice(netGain)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">실질 수익률</div>
                <div className="text-lg font-bold text-primary">
                  {purchase > 0
                    ? `${((netGain / purchase) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center">
            * 본 계산은 간이 추정이며 실제 세금은 취득비용, 필요경비, 비과세 요건
            등에 따라 달라질 수 있습니다. 정확한 세금은 세무사 상담을 권장합니다.
          </p>
        </div>
      )}
    </div>
  );
}
