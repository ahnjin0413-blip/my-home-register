"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import { AGENT_DATA, type RealEstateAgent } from "@/data/agents";
import type { District } from "@/data/apartments";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">
        {rating} ({" "}
      </span>
    </div>
  );
}

function AgentCard({
  agent,
  onSelect,
  selected,
}: {
  agent: RealEstateAgent;
  onSelect: (a: RealEstateAgent) => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={() => onSelect(agent)}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? "border-primary bg-blue-50/50 ring-1 ring-primary"
          : "border-gray-100 hover:border-blue-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-gray-500">
            {agent.name[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm">{agent.name}</span>
            <span className="text-xs text-gray-400">
              경력 {agent.experience}년
            </span>
          </div>
          <div className="text-xs text-gray-600 mb-1">
            {agent.officeName}
          </div>
          <div className="flex items-center gap-1 mb-1">
            <StarRating rating={agent.rating} />
            <span className="text-xs text-gray-400">
              {agent.reviewCount}건)
            </span>
          </div>
          <div className="text-[11px] text-gray-500">{agent.speciality}</div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
              최근 3개월 {agent.recentDeals}건 거래
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ConsultPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { property } = useProperty();
  const [selectedAgent, setSelectedAgent] = useState<RealEstateAgent | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [preferredTime, setPreferredTime] = useState("오전 (10~12시)");
  const [submitted, setSubmitted] = useState(false);

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
        <p className="text-gray-500 mb-4">
          먼저 아파트를 등록한 후 상담을 신청할 수 있습니다
        </p>
        <Link
          href="/register"
          className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-medium"
        >
          내 아파트 등록하고 시세 확인하기
        </Link>
      </div>
    );
  }

  const district = property.district as District;
  const agents = AGENT_DATA[district] || [];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">상담 신청이 완료되었습니다</h2>
          <p className="text-sm text-gray-500 mb-2">
            {selectedAgent?.officeName}의 {selectedAgent?.name} 중개사님이
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {preferredTime}에 연락드릴 예정입니다
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="text-xs text-gray-500 mb-2">상담 대상</div>
            <div className="font-semibold text-sm">
              {property.complexName} {property.dong} {property.ho}호
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/my-property"
              className="flex-1 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              내 아파트 시세 보기
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">매도 전문 상담 신청</h2>
        <p className="text-sm text-gray-500">
          {property.complexName} 주변 전문 중개사를 선택하고 상담을 신청하세요
        </p>
      </div>

      {/* 상담 대상 아파트 */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
        <div className="text-xs text-primary font-medium mb-1">상담 대상</div>
        <div className="font-semibold">
          {property.complexName} {property.dong} {property.ho}호
        </div>
        <div className="text-xs text-gray-500">{property.address}</div>
      </div>

      {/* 중개사 선택 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h3 className="font-bold text-base mb-1">
          {district} 전문 중개사
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          상담받으실 중개사를 선택해주세요
        </p>
        <div className="space-y-2">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onSelect={setSelectedAgent}
              selected={selectedAgent?.id === agent.id}
            />
          ))}
        </div>
      </div>

      {/* 상담 정보 입력 */}
      {selectedAgent && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-bold text-base mb-4">상담 정보</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                희망 연락 시간
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "오전 (10~12시)",
                  "오후 (13~15시)",
                  "저녁 (15~18시)",
                ].map((time) => (
                  <button
                    key={time}
                    onClick={() => setPreferredTime(time)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      preferredTime === time
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-gray-600 hover:border-primary"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                상담 내용 (선택)
              </label>
              <textarea
                placeholder="매도 희망 시기, 희망 가격 등을 적어주시면 더 정확한 상담이 가능합니다"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
              />
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              {selectedAgent.name} 중개사님에게 상담 신청
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
