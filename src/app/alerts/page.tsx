"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProperty, type AlertSettings } from "@/context/PropertyContext";

interface AlertEvent {
  id: string;
  type: "price" | "regulation" | "redevelopment" | "market";
  title: string;
  description: string;
  date: string;
  impact: "positive" | "negative" | "neutral";
  isNew: boolean;
}

// 등록된 아파트 기반 샘플 알림 생성
function generateSampleAlerts(
  complexName: string,
  district: string
): AlertEvent[] {
  return [
    {
      id: "a1",
      type: "price",
      title: `${complexName} 84㎡ 신고가 경신`,
      description: `${complexName} 84㎡ 타입이 전고점 대비 2,000만원 높은 가격에 거래되었습니다. 동일 단지 매물 소진 중.`,
      date: "2026.04.05",
      impact: "positive",
      isNew: true,
    },
    {
      id: "a2",
      type: "regulation",
      title: `${district} 토지거래허가구역 재지정 검토`,
      description: `서울시가 ${district} 일부 지역의 토지거래허가구역 재지정을 검토 중입니다. 확정 시 실거주 의무 2년 적용.`,
      date: "2026.04.03",
      impact: "negative",
      isNew: true,
    },
    {
      id: "a3",
      type: "redevelopment",
      title: `${district} 인근 재건축 조합설립 인가`,
      description: `${district} 내 주요 재건축 단지의 조합설립이 인가되었습니다. 주변 시세 상승 요인으로 작용 전망.`,
      date: "2026.04.01",
      impact: "positive",
      isNew: false,
    },
    {
      id: "a4",
      type: "market",
      title: "한국은행 기준금리 0.25%p 인하",
      description:
        "기준금리가 2.75%로 인하되었습니다. 대출 이자 부담 감소로 매수 심리 회복 기대.",
      date: "2026.03.28",
      impact: "positive",
      isNew: false,
    },
    {
      id: "a5",
      type: "price",
      title: `${complexName} 전세가율 상승`,
      description: `${complexName}의 전세가율이 58%에서 62%로 상승했습니다. 갭투자 진입 수요 증가 가능성.`,
      date: "2026.03.25",
      impact: "neutral",
      isNew: false,
    },
    {
      id: "a6",
      type: "regulation",
      title: `${district} 분양가상한제 적용 구역 변경`,
      description: `${district} 일부 구역의 분양가상한제 적용이 조정됩니다. 재건축 사업성에 영향 예상.`,
      date: "2026.03.22",
      impact: "negative",
      isNew: false,
    },
    {
      id: "a7",
      type: "redevelopment",
      title: `${district} 정비사업 정밀안전진단 통과`,
      description: `${district} 주요 단지가 정밀안전진단을 통과하여 재건축 사업이 본격화됩니다.`,
      date: "2026.03.18",
      impact: "positive",
      isNew: false,
    },
  ];
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  price: { label: "시세 변동", color: "bg-red-50 text-red-700" },
  regulation: { label: "규제 변경", color: "bg-purple-50 text-purple-700" },
  redevelopment: { label: "재개발", color: "bg-amber-50 text-amber-700" },
  market: { label: "시장 동향", color: "bg-blue-50 text-blue-700" },
};

const IMPACT_ICON: Record<string, { icon: string; color: string }> = {
  positive: { icon: "▲", color: "text-red-500" },
  negative: { icon: "▼", color: "text-blue-500" },
  neutral: { icon: "●", color: "text-gray-400" },
};

export default function AlertsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { property, alertSettings, updateAlertSettings } = useProperty();
  const [settings, setSettings] = useState<AlertSettings>(alertSettings);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState<string>("all");

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
          먼저 아파트를 등록한 후 알림을 설정할 수 있습니다
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

  const alerts = generateSampleAlerts(property.complexName, property.district);
  const filteredAlerts =
    filter === "all" ? alerts : alerts.filter((a) => a.type === filter);
  const newCount = alerts.filter((a) => a.isNew).length;

  function handleToggle(key: keyof AlertSettings) {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSaved(false);
  }

  function handleSave() {
    updateAlertSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const toggleItems: {
    key: keyof AlertSettings;
    label: string;
    desc: string;
    icon: string;
  }[] = [
    {
      key: "priceChange",
      label: "시세 변동 알림",
      desc: "내 아파트 실거래가 변동, 신고가/신저가 발생 시",
      icon: "💰",
    },
    {
      key: "regulation",
      label: "규제 변경 알림",
      desc: "투기과열지구, 토지거래허가구역 등 규제 변동 시",
      icon: "📋",
    },
    {
      key: "redevelopment",
      label: "재개발/재건축 알림",
      desc: "주변 재건축·재개발 사업 단계 변경 시",
      icon: "🏗️",
    },
    {
      key: "marketTrend",
      label: "시장 동향 알림",
      desc: "금리 변동, 정책 발표 등 전체 시장 영향 이벤트",
      icon: "📈",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">시세 변동 알림</h2>
        <p className="text-sm text-gray-500">
          {property.complexName}의 시세에 영향을 주는 이벤트를 실시간으로
          알려드립니다
        </p>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">알림 설정</h3>
          {saved && (
            <span className="text-xs text-green-600 font-medium">
              저장 완료
            </span>
          )}
        </div>
        <div className="space-y-3">
          {toggleItems.map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[11px] text-gray-400">{item.desc}</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center ${
                  settings[item.key] ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[item.key] ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          설정 저장
        </button>
      </div>

      {/* 알림 내역 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">최근 알림</h3>
            {newCount > 0 && (
              <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                {newCount}건 새 알림
              </span>
            )}
          </div>
        </div>

        {/* 필터 */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {[
            { key: "all", label: "전체" },
            { key: "price", label: "시세" },
            { key: "regulation", label: "규제" },
            { key: "redevelopment", label: "재개발" },
            { key: "market", label: "시장" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 알림 리스트 */}
        <div className="space-y-2">
          {filteredAlerts.map((alert) => {
            const typeInfo = TYPE_LABELS[alert.type];
            const impactInfo = IMPACT_ICON[alert.impact];
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.isNew
                    ? "border-primary/30 bg-blue-50/30"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`text-sm ${impactInfo.color}`}>
                      {impactInfo.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      {alert.isNew && (
                        <span className="text-[10px] font-bold text-red-500">
                          NEW
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 ml-auto">
                        {alert.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/my-property"
          className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-hover transition-colors"
        >
          내 아파트 시세 보기
        </Link>
        <Link
          href="/consult"
          className="flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          매도 상담 신청
        </Link>
      </div>
    </div>
  );
}
