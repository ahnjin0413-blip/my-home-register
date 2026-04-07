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

  if (isLoading) {
    return (
      <div className="h-14 w-48 rounded-full bg-white/20 animate-pulse" />
    );
  }

  return (
    <button
      onClick={handleClick}
      className="px-10 py-4 bg-white text-gray-900 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
    >
      {user ? "아파트 시세 확인하기" : "시작하기"}
    </button>
  );
}
