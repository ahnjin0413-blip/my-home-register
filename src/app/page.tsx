import HeroCTA from "@/components/HeroCTA";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80')",
        }}
      />

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* 컨텐츠 */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* 서비스 태그 */}
        <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8 border border-white/20">
          강남 &middot; 서초 &middot; 송파 &middot; 마포 &middot; 용산 &middot;
          성동
        </div>

        {/* 후킹 문장 */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          우리 집 시세,
          <br />
          <span className="text-amber-300">20년 흐름</span>으로 읽다
        </h1>

        <p className="text-lg sm:text-xl text-white/75 mb-10 leading-relaxed">
          실거래가 추이 · 학군 · 규제 · 재개발까지
          <br className="hidden sm:block" />
          한눈에 보고, 최적의 매도 타이밍을 잡으세요
        </p>

        {/* CTA 버튼 */}
        <HeroCTA />

        {/* 기능 하이라이트 */}
        <div className="mt-12 flex items-center justify-center gap-5 text-white/50 text-sm">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span>20년 실거래가</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
            </svg>
            <span>학군 정보</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>시세 차익 계산</span>
          </div>
        </div>
      </div>
    </div>
  );
}
