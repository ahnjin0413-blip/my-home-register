"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import ComplexDetail from "./ComplexDetail";
import DistrictInfoPanel from "./DistrictInfoPanel";
import FavoriteButton from "./FavoriteButton";
import {
  APARTMENT_DATA,
  type District,
  type ApartmentComplex,
} from "@/data/apartments";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl bg-gray-100 flex items-center justify-center"
      style={{ height: 420 }}
    >
      <span className="text-gray-400 text-sm">지도 로딩 중...</span>
    </div>
  ),
});

function formatPrice(price: number): string {
  if (price >= 10) {
    const eok = Math.floor(price);
    const cheon = Math.round((price - eok) * 10);
    return cheon > 0 ? `${eok}억 ${cheon},000만` : `${eok}억`;
  }
  return `${Math.round(price * 1000).toLocaleString()}만`;
}

function PriceChangeTag({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        &#9650; {change.toFixed(1)}%
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        &#9660; {Math.abs(change).toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
      보합
    </span>
  );
}

function ComplexCard({
  complex,
  onSelect,
}: {
  complex: ApartmentComplex;
  onSelect: (c: ApartmentComplex) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onSelect(complex)}
        className="w-full text-left p-4 pr-14 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm leading-tight group-hover:text-primary">
            {complex.name}
          </h4>
          <PriceChangeTag change={complex.priceChange} />
        </div>
        <div className="text-lg font-bold text-primary mb-1">
          {formatPrice(complex.priceMin)} ~ {formatPrice(complex.priceMax)}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 space-x-2">
            <span>84㎡ 기준</span>
            <span>&middot;</span>
            <span>{complex.totalUnits.toLocaleString()}세대</span>
            <span>&middot;</span>
            <span>{complex.builtYear}년</span>
          </div>
          <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            실거래가 보기 &rarr;
          </span>
        </div>
      </button>
      <div className="absolute top-3 right-3">
        <FavoriteButton complexId={complex.id} size="sm" />
      </div>
    </div>
  );
}

export default function PriceExplorer() {
  const { user } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedComplex, setSelectedComplex] =
    useState<ApartmentComplex | null>(null);
  const [detailComplex, setDetailComplex] =
    useState<ApartmentComplex | null>(null);

  const handleMapSelectComplex = useCallback((c: ApartmentComplex) => {
    setSelectedComplex(c);
  }, []);
  const handleMapSelectDistrict = useCallback((d: District) => {
    setSelectedDistrict(d);
  }, []);

  const filteredComplexes = selectedDistrict
    ? APARTMENT_DATA.filter((a) => a.district === selectedDistrict)
    : [];

  const districtStats = selectedDistrict
    ? {
        avgMin:
          filteredComplexes.reduce((s, a) => s + a.priceMin, 0) /
          filteredComplexes.length,
        avgMax:
          filteredComplexes.reduce((s, a) => s + a.priceMax, 0) /
          filteredComplexes.length,
        avgChange:
          filteredComplexes.reduce((s, a) => s + a.priceChange, 0) /
          filteredComplexes.length,
        totalUnits: filteredComplexes.reduce((s, a) => s + a.totalUnits, 0),
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 지도 섹션 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h2 className="text-lg font-bold mb-1">서울 주요 지역 시세 지도</h2>
        <p className="text-sm text-gray-400 mb-4">
          지도를 움직이며 단지별 시세를 확인하세요. 마커를 클릭하면 상세 정보를 볼 수 있습니다.
        </p>
        <LeafletMap
          selectedDistrict={selectedDistrict}
          onSelectDistrict={handleMapSelectDistrict}
          onSelectComplex={handleMapSelectComplex}
          selectedComplexId={selectedComplex?.id ?? null}
        />

        {/* 구 선택 탭 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(
            [
              "강남구",
              "서초구",
              "송파구",
              "마포구",
              "용산구",
              "성동구",
            ] as District[]
          ).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDistrict === d
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 구 통계 요약 */}
      {selectedDistrict && districtStats && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-bold text-base mb-3">
            {selectedDistrict} 시세 현황
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">평균 시세</div>
              <div className="text-sm font-bold text-primary">
                {formatPrice(districtStats.avgMin)} ~{" "}
                {formatPrice(districtStats.avgMax)}
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">평균 변동률</div>
              <div className="text-sm font-bold text-red-600">
                +{districtStats.avgChange.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">총 세대수</div>
              <div className="text-sm font-bold text-gray-700">
                {districtStats.totalUnits.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 규제 및 재개발 정보 */}
      {selectedDistrict && (
        <DistrictInfoPanel district={selectedDistrict} />
      )}

      {/* 단지별 시세 리스트 */}
      {selectedDistrict && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">
              {selectedDistrict} 단지별 시세
            </h3>
            <span className="text-xs text-gray-400">
              {filteredComplexes.length}개 단지 · 84㎡ 기준 · 클릭 시 실거래가
            </span>
          </div>
          <div className="space-y-2">
            {filteredComplexes
              .sort((a, b) => b.priceMax - a.priceMax)
              .map((complex) => (
                <ComplexCard
                  key={complex.id}
                  complex={complex}
                  onSelect={setDetailComplex}
                />
              ))}
          </div>
        </div>
      )}

      {/* 안내 메시지 (구 미선택 시) */}
      {!selectedDistrict && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            위 지도에서 지역을 선택하면
            <br />
            시세 · 규제 · 재개발 정보를 확인할 수 있습니다
          </p>
        </div>
      )}

      {/* 내 아파트 등록 CTA */}
      <div className="sticky bottom-4 mt-6">
        <Link
          href={user ? "/register" : "/login"}
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-lg hover:bg-primary-hover transition-all hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
            />
          </svg>
          내 아파트 등록하고 시세 확인하기
        </Link>
      </div>

      {/* 실거래가 상세 모달 */}
      {detailComplex && (
        <ComplexDetail
          complex={detailComplex}
          onClose={() => setDetailComplex(null)}
        />
      )}
    </div>
  );
}
