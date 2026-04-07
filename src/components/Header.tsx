"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isMyPage = pathname.startsWith("/mypage");

  return (
    <header
      className={
        isLanding
          ? "absolute top-0 left-0 right-0 z-20 px-4 py-4"
          : "bg-white border-b border-gray-200 px-4 py-3"
      }
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className={`text-lg font-bold ${isLanding ? "text-white" : "text-primary"}`}
        >
          매도파트너
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/mypage"
                className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                  isLanding
                    ? "text-white/80 hover:text-white"
                    : isMyPage
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {user.name}님
              </Link>
              <button
                onClick={logout}
                className={`text-xs rounded-lg px-2.5 py-1 ${
                  isLanding
                    ? "text-white/70 hover:text-white border border-white/30"
                    : "text-gray-400 hover:text-gray-600 border border-gray-200"
                }`}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`text-sm font-medium ${
                isLanding
                  ? "text-white/90 hover:text-white"
                  : "text-primary hover:underline"
              }`}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
