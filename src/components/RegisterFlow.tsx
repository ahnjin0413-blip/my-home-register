"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import {
  DISTRICTS,
  APARTMENT_DATA,
  type District,
  type ApartmentComplex,
} from "@/data/apartments";

type Step = "district" | "complex" | "unit" | "confirm" | "complete";

interface RegistrationData {
  district: District | null;
  complex: ApartmentComplex | null;
  dong: string;
  ho: string;
}

export default function RegisterFlow() {
  const { user, isLoading } = useAuth();
  const { registerProperty } = useProperty();
  const router = useRouter();

  const [step, setStep] = useState<Step>("district");
  const [data, setData] = useState<RegistrationData>({
    district: null,
    complex: null,
    dong: "",
    ho: "",
  });

  const filteredComplexes = data.district
    ? APARTMENT_DATA.filter((apt) => apt.district === data.district)
    : [];

  function selectDistrict(district: District) {
    setData({ ...data, district, complex: null, dong: "", ho: "" });
    setStep("complex");
  }

  function selectComplex(complex: ApartmentComplex) {
    setData({ ...data, complex, dong: "", ho: "" });
    setStep("unit");
  }

  function goBack() {
    if (step === "complex") setStep("district");
    else if (step === "unit") setStep("complex");
    else if (step === "confirm") setStep("unit");
  }

  function submitUnit() {
    if (!data.dong || !data.ho) return;
    setStep("confirm");
  }

  function confirmRegister() {
    if (data.complex) {
      registerProperty(data.complex, data.dong, data.ho);
    }
    setStep("complete");
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
        로딩 중...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
        로그인 페이지로 이동 중...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      {step !== "complete" && (
        <div className="px-6 pt-6">
          <div className="flex gap-1 mb-6">
            {["district", "complex", "unit", "confirm"].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  ["district", "complex", "unit", "confirm"].indexOf(step) >= i
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 1: 구 선택 */}
      {step === "district" && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-1">어느 구에 위치하나요?</h3>
          <p className="text-sm text-gray-400 mb-5">
            서비스 대상 지역을 선택해주세요
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DISTRICTS.map((district) => {
              const count = APARTMENT_DATA.filter(
                (a) => a.district === district
              ).length;
              return (
                <button
                  key={district}
                  onClick={() => selectDistrict(district)}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all text-left group"
                >
                  <span className="font-medium group-hover:text-primary">
                    {district}
                  </span>
                  <span className="text-xs text-gray-400">
                    {count}개 단지
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: 단지 선택 */}
      {step === "complex" && (
        <div className="px-6 pb-6">
          <button
            onClick={goBack}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          >
            &larr; 지역 다시 선택
          </button>
          <h3 className="text-lg font-semibold mb-1">
            {data.district} 아파트 단지
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            300세대 이상 단지만 표시됩니다
          </p>
          <div className="space-y-2">
            {filteredComplexes.map((complex) => (
              <button
                key={complex.id}
                onClick={() => selectComplex(complex)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all group"
              >
                <div className="font-medium group-hover:text-primary">
                  {complex.name}
                </div>
                <div className="text-xs text-gray-400 mt-1 flex gap-3">
                  <span>{complex.totalUnits.toLocaleString()}세대</span>
                  <span>{complex.builtYear}년</span>
                  <span>{complex.address}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 동/호수 입력 */}
      {step === "unit" && data.complex && (
        <div className="px-6 pb-6">
          <button
            onClick={goBack}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          >
            &larr; 단지 다시 선택
          </button>
          <h3 className="text-lg font-semibold mb-1">{data.complex.name}</h3>
          <p className="text-sm text-gray-400 mb-5">동과 호수를 입력해주세요</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                동 선택
              </label>
              <div className="grid grid-cols-4 gap-2">
                {data.complex.dongList.map((dong) => (
                  <button
                    key={dong}
                    onClick={() => setData({ ...data, dong })}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      data.dong === dong
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {dong}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                호수 입력
              </label>
              <input
                type="text"
                placeholder="예: 1504"
                value={data.ho}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setData({ ...data, ho: value });
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg"
                inputMode="numeric"
              />
            </div>

            <button
              onClick={submitUnit}
              disabled={!data.dong || !data.ho}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 확인 */}
      {step === "confirm" && data.complex && (
        <div className="px-6 pb-6">
          <button
            onClick={goBack}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          >
            &larr; 수정하기
          </button>
          <h3 className="text-lg font-semibold mb-5">등록 정보 확인</h3>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
            <InfoRow label="지역" value={data.district!} />
            <InfoRow label="단지명" value={data.complex.name} />
            <InfoRow label="주소" value={data.complex.address} />
            <InfoRow label="동" value={data.dong} />
            <InfoRow label="호수" value={`${data.ho}호`} />
            <InfoRow
              label="총 세대수"
              value={`${data.complex.totalUnits.toLocaleString()}세대`}
            />
          </div>

          <p className="text-xs text-gray-400 mb-4 text-center">
            * 소유권 검증은 등록 후 별도로 진행됩니다
          </p>

          <button
            onClick={confirmRegister}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
          >
            등록 완료하기
          </button>
        </div>
      )}

      {/* Step 5: 완료 + 매도 유도 */}
      {step === "complete" && data.complex && (
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">등록이 완료되었습니다!</h3>
            <p className="text-sm text-gray-500">
              {data.complex.name} {data.dong} {data.ho}호
            </p>
          </div>

          {/* 매도 유도 섹션 */}
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    지금이 매도 적기일 수 있습니다
                  </h4>
                  <p className="text-sm text-amber-700">
                    {data.district} 지역 최근 실거래가가 상승세입니다. 전문가
                    시세 분석을 무료로 받아보세요.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/my-property"
              className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              내 아파트 시세 확인하기
            </Link>

            <Link
              href="/consult"
              className="w-full py-4 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              매도 전문 상담 신청
            </Link>

            <Link
              href="/alerts"
              className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              시세 변동 알림 받기
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            매도 상담은 무료이며, 전문 중개사가 연락드립니다
          </p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
