"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import { APARTMENT_DATA } from "@/data/apartments";

function formatPhone(value: string): string {
  const nums = value.replace(/[^0-9]/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
}

function formatPhoneDisplay(raw: string): string {
  if (raw.length === 11) return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
  if (raw.length === 10) return `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
  return raw;
}

function formatShortPrice(price: number): string {
  if (price >= 10) {
    const eok = Math.floor(price);
    const cheon = Math.round((price - eok) * 10);
    return cheon > 0 ? `${eok}억 ${cheon},000만` : `${eok}억`;
  }
  return `${Math.round(price * 1000).toLocaleString()}만`;
}

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, changePassword, logout } = useAuth();
  const { property, favorites, toggleFavorite } = useProperty();

  const [tab, setTab] = useState<"info" | "property" | "favorites">("info");
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // 개인정보 수정 폼
  const [editForm, setEditForm] = useState({
    name: "",
    birthDate: "",
    phone: "",
  });
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // 비밀번호 변경 폼
  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  if (isLoading) {
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

  function startEdit() {
    if (!user) return;
    setEditForm({
      name: user.name,
      birthDate: user.birthDate,
      phone: formatPhone(user.phone),
    });
    setEditing(true);
    setEditError("");
    setEditSuccess("");
  }

  function cancelEdit() {
    setEditing(false);
    setEditError("");
  }

  async function saveEdit() {
    if (!editForm.name.trim()) {
      setEditError("이름을 입력해주세요");
      return;
    }
    if (!editForm.birthDate) {
      setEditError("생년월일을 선택해주세요");
      return;
    }
    const rawPhone = editForm.phone.replace(/[^0-9]/g, "");
    if (rawPhone.length < 10) {
      setEditError("휴대폰 번호를 정확히 입력해주세요");
      return;
    }

    const result = await updateProfile({
      name: editForm.name.trim(),
      birthDate: editForm.birthDate,
      phone: rawPhone,
    });

    if (result.success) {
      setEditing(false);
      setEditSuccess("개인정보가 수정되었습니다");
      setTimeout(() => setEditSuccess(""), 3000);
    } else {
      setEditError(result.error || "수정에 실패했습니다");
    }
  }

  async function handleChangePw() {
    setPwError("");
    if (!pwForm.current) {
      setPwError("현재 비밀번호를 입력해주세요");
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError("새 비밀번호는 6자 이상이어야 합니다");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("새 비밀번호가 일치하지 않습니다");
      return;
    }
    const result = await changePassword(pwForm.current, pwForm.next);
    if (result.success) {
      setChangingPw(false);
      setPwForm({ current: "", next: "", confirm: "" });
      setPwSuccess("비밀번호가 변경되었습니다");
      setTimeout(() => setPwSuccess(""), 3000);
    } else {
      setPwError(result.error || "변경에 실패했습니다");
    }
  }

  const registeredDate = property
    ? new Date(property.registeredAt).toLocaleDateString("ko-KR")
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {user.name[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}님</h2>
            <p className="text-sm text-gray-500">
              {formatPhoneDisplay(user.phone)}
            </p>
            {property && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  아파트 등록 완료
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setTab("info")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            tab === "info"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          }`}
        >
          개인정보
        </button>
        <button
          onClick={() => setTab("property")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            tab === "property"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          }`}
        >
          나의 아파트
        </button>
        <button
          onClick={() => setTab("favorites")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all relative ${
            tab === "favorites"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          }`}
        >
          관심아파트
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* 개인정보 탭 */}
      {tab === "info" && (
        <div className="space-y-4">
          {/* 성공 메시지 */}
          {(editSuccess || pwSuccess) && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-xl">
              {editSuccess || pwSuccess}
            </div>
          )}

          {/* 개인정보 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">기본 정보</h3>
              {!editing && (
                <button
                  onClick={startEdit}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  수정
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-4">
                <InfoRow label="이름" value={user.name} />
                <InfoRow label="생년월일" value={user.birthDate} />
                <InfoRow
                  label="휴대폰"
                  value={formatPhoneDisplay(user.phone)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    이름
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    생년월일
                  </label>
                  <input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthDate: e.target.value })
                    }
                    max="2008-12-31"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    휴대폰
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    inputMode="numeric"
                  />
                </div>
                {editError && (
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    {editError}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 비밀번호 변경 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">비밀번호</h3>
              {!changingPw && (
                <button
                  onClick={() => {
                    setChangingPw(true);
                    setPwError("");
                    setPwSuccess("");
                  }}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  변경
                </button>
              )}
            </div>

            {!changingPw ? (
              <p className="text-sm text-gray-500">••••••••</p>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    value={pwForm.current}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, current: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="6자 이상"
                    value={pwForm.next}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, next: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, confirm: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                {pwError && (
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    {pwError}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePw}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                  >
                    변경
                  </button>
                  <button
                    onClick={() => {
                      setChangingPw(false);
                      setPwError("");
                    }}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 계정 관리 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-base mb-4">계정 관리</h3>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* 나의 아파트 탭 */}
      {tab === "property" && (
        <div className="space-y-4">
          {property ? (
            <>
              {/* 등록 아파트 카드 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-5 text-white">
                  <div className="text-xs text-white/60 mb-1">나의 아파트</div>
                  <h3 className="text-lg font-bold">{property.complexName}</h3>
                  <p className="text-sm text-white/80">
                    {property.dong} {property.ho}호
                  </p>
                </div>
                <div className="p-5 space-y-3">
                  <InfoRow label="지역" value={property.district} />
                  <InfoRow label="주소" value={property.address} />
                  <InfoRow label="동 / 호수" value={`${property.dong} ${property.ho}호`} />
                  <InfoRow
                    label="총 세대수"
                    value={`${property.totalUnits.toLocaleString()}세대`}
                  />
                  <InfoRow label="준공년도" value={`${property.builtYear}년`} />
                  <InfoRow
                    label="예상 시세 (84㎡)"
                    value={`${formatShortPrice(property.priceMin)} ~ ${formatShortPrice(property.priceMax)}`}
                  />
                  <InfoRow
                    label="전월 대비"
                    value={`+${property.priceChange.toFixed(1)}%`}
                    highlight
                  />
                  <InfoRow
                    label="등록일"
                    value={registeredDate || "-"}
                  />
                </div>
              </div>

              {/* 바로가기 */}
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/my-property"
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:border-primary hover:bg-blue-50/30 transition-all group"
                >
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-primary">
                    시세 확인
                  </span>
                </Link>
                <Link
                  href="/consult"
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:border-primary hover:bg-blue-50/30 transition-all group"
                >
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-primary">
                    매도 상담
                  </span>
                </Link>
                <Link
                  href="/alerts"
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:border-primary hover:bg-blue-50/30 transition-all group"
                >
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-primary">
                    알림 설정
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-2">
                아직 등록된 아파트가 없습니다
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                아파트를 등록하면 실시간 시세 확인, 매도 상담,
                <br />
                시세 변동 알림 등을 이용할 수 있습니다
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
              >
                내 아파트 등록하고 시세 확인하기
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 관심아파트 탭 */}
      {tab === "favorites" && (
        <div className="space-y-4">
          {favorites.length > 0 ? (
            <>
              <div className="text-xs text-gray-400">
                {favorites.length}개의 관심 아파트
              </div>
              {favorites.map((fav) => {
                const c = APARTMENT_DATA.find((a) => a.id === fav.complexId);
                if (!c) return null;
                return (
                  <div
                    key={fav.complexId}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        href={`/complex?id=${c.id}`}
                        className="flex-1 min-w-0"
                      >
                        <h4 className="font-semibold text-sm hover:text-primary transition-colors">
                          {c.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.address}
                        </p>
                      </Link>
                      <button
                        onClick={() => toggleFavorite(fav.complexId)}
                        className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 ml-2 hover:bg-red-100 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold text-primary">
                        {formatShortPrice(c.priceMin)} ~{" "}
                        {formatShortPrice(c.priceMax)}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          c.priceChange > 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {c.priceChange > 0 ? "+" : ""}
                        {c.priceChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex gap-2">
                      <span>84㎡ 기준</span>
                      <span>&middot;</span>
                      <span>
                        {c.totalUnits.toLocaleString()}세대
                      </span>
                      <span>&middot;</span>
                      <span>{c.builtYear}년</span>
                    </div>
                    <Link
                      href={`/complex?id=${c.id}`}
                      className="block mt-3 text-center py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-blue-50 hover:text-primary transition-colors"
                    >
                      시세 · 규제 상세 보기
                    </Link>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-2">
                관심 아파트가 없습니다
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                시세 지도에서 마음에 드는 단지의 하트를 눌러
                <br />
                관심 아파트로 등록해보세요
              </p>
              <Link
                href="/explore"
                className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
              >
                시세 지도 둘러보기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-red-500" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
