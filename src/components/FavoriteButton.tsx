"use client";

import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  complexId,
  size = "md",
}: {
  complexId: string;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useProperty();
  const router = useRouter();
  const active = user ? isFavorite(complexId) : false;

  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconDim = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleFavorite(complexId);
  }

  return (
    <button
      onClick={handleClick}
      className={`${dim} rounded-full flex items-center justify-center transition-all ${
        active
          ? "bg-red-50 hover:bg-red-100"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
      title={active ? "관심 해제" : "관심 등록"}
    >
      <svg
        className={`${iconDim} transition-colors ${
          active ? "text-red-500" : "text-gray-300"
        }`}
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
