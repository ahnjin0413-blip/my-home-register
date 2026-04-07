import RegisterFlow from "@/components/RegisterFlow";

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">내 아파트 등록하고 시세 확인하기</h2>
        <p className="text-gray-500 text-sm">
          소유하신 아파트를 등록하고 최적의 매도 타이밍을 확인하세요
        </p>
      </div>
      <RegisterFlow />
    </div>
  );
}
