"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HeroCTA() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  function handleClick() {
    if (user) {
      router.push("/explore");
    } else {
      router.push("/login");
    }
  }

  // 로딩 중에도 버튼은 표시 (Supabase 연결 지연 대비)
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="px-10 py-4 bg-white text-gray-900 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-80"
    >
      {isLoading ? "로딩 중..." : user ? "아파트 시세 확인하기" : "시작하기"}
    </button>
  );
}
