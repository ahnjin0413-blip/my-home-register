"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ComplexDetailPage from "@/components/ComplexDetailPage";

function Inner() {
  const params = useSearchParams();
  const id = params.get("id");
  if (!id) return <div className="p-10 text-center text-gray-400">단지를 찾을 수 없습니다</div>;
  return <ComplexDetailPage complexId={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-400">로딩 중...</div>}>
      <Inner />
    </Suspense>
  );
}
