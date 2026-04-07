"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-4 text-center text-xs text-gray-400">
      &copy; 2026 매도파트너. 본 서비스는 300세대 이상 아파트 단지를 대상으로
      합니다.
    </footer>
  );
}
