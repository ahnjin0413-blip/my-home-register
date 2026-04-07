import type { District } from "./apartments";

export interface Regulation {
  title: string;
  status: "시행중" | "예정" | "해제";
  date: string;
  description: string;
  impact: string;
  impactType: "positive" | "negative" | "neutral";
}

export interface RedevelopmentInfo {
  name: string;
  stage: string;
  expectedCompletion: string;
  description: string;
  priceImpact: "호재" | "악재" | "관망";
  detail: string;
}

export interface DistrictInfo {
  regulations: Regulation[];
  redevelopments: RedevelopmentInfo[];
}

export const DISTRICT_INFO: Record<District, DistrictInfo> = {
  강남구: {
    regulations: [
      {
        title: "투기과열지구 지정",
        status: "시행중",
        date: "2017.08 ~",
        description: "주택담보대출 LTV 40%, DTI 40% 적용. 분양권 전매 제한.",
        impact: "매수 진입장벽이 높아 실수요 위주 거래. 급격한 가격 하락보다는 거래량 감소로 이어지는 경향.",
        impactType: "negative",
      },
      {
        title: "토지거래허가구역 지정 (대치·삼성·청담)",
        status: "시행중",
        date: "2025.03 ~",
        description: "일정 면적 이상 토지 거래 시 구청장 허가 필요. 2년간 실거주 의무.",
        impact: "단기 투자 목적 거래 차단. 실거주 수요만 남아 가격 안정화 효과가 있으나, 매물 잠김으로 공급 부족 시 오히려 가격 상승 압력.",
        impactType: "neutral",
      },
      {
        title: "재건축 초과이익환수제",
        status: "시행중",
        date: "2025.01 ~",
        description: "재건축 시 초과이익 3천만원 초과분에 대해 10~50% 부담금 부과.",
        impact: "재건축 사업성 저하로 추진 속도 둔화. 기존 아파트 가격에 부담금 선반영으로 단기 가격 조정 가능성.",
        impactType: "negative",
      },
    ],
    redevelopments: [
      {
        name: "은마아파트 재건축",
        stage: "정비구역 지정 완료 · 조합설립 추진 중",
        expectedCompletion: "2032~2034년 (예상)",
        description: "4,424세대 → 약 5,600세대 예정. 대치동 최대 재건축 사업.",
        priceImpact: "호재",
        detail: "재건축 기대감으로 주변 시세 견인 효과. 다만 초과이익환수제 부담금이 세대당 수억 원 예상되어 실제 수익률은 제한적.",
      },
      {
        name: "개포시영 재건축 (디에이치퍼스티어)",
        stage: "입주 완료",
        expectedCompletion: "2023년 입주",
        description: "기존 1,900세대 → 6,702세대. 강남 최대 규모 신축 단지.",
        priceImpact: "호재",
        detail: "입주 완료로 주변 인프라 확충. 대단지 프리미엄으로 인근 시세 상승 견인 중.",
      },
    ],
  },
  서초구: {
    regulations: [
      {
        title: "투기과열지구 지정",
        status: "시행중",
        date: "2017.08 ~",
        description: "LTV 40%, DTI 40% 적용. 분양권 전매 제한, 청약 1순위 자격 강화.",
        impact: "대출 한도 제한으로 고가 아파트 매수 시 자기자본 비중 높아야 함. 자금력 있는 실수요자 위주 시장 형성.",
        impactType: "negative",
      },
      {
        title: "분양가상한제 적용 (반포동 일대)",
        status: "시행중",
        date: "2020.07 ~",
        description: "재건축 분양 시 분양가를 택지비 + 건축비 기준으로 산정.",
        impact: "분양가 억제로 로또 청약 경쟁 심화. 기존 아파트와의 가격 괴리 발생으로 주변 시세에 복합적 영향.",
        impactType: "neutral",
      },
    ],
    redevelopments: [
      {
        name: "반포주공1단지 재건축 (래미안 원펜타스)",
        stage: "분양 완료 · 공사 중",
        expectedCompletion: "2027년 입주 예정",
        description: "2,444세대 → 약 2,990세대. 반포 한강변 초대형 재건축.",
        priceImpact: "호재",
        detail: "분양가 대비 시세 차익 기대감으로 인근 재건축 단지 가격 동반 상승. 입주 후 반포 전체 시세 레벨업 예상.",
      },
      {
        name: "잠원동 신반포15차 재건축",
        stage: "관리처분 인가",
        expectedCompletion: "2028~2029년 (예상)",
        description: "1,244세대 규모. 잠원래미안아이파크 인근 재건축.",
        priceImpact: "호재",
        detail: "잠원 한강변 신축 공급으로 서초구 남부 시세 상승 견인.",
      },
    ],
  },
  송파구: {
    regulations: [
      {
        title: "투기과열지구 지정",
        status: "시행중",
        date: "2017.08 ~",
        description: "LTV 40%, DTI 40%. 잠실 재건축 단지 중심 규제.",
        impact: "잠실 주공 5단지 등 재건축 기대 단지의 투기 수요 억제. 실거주 의무 강화로 전세 매물 감소.",
        impactType: "negative",
      },
      {
        title: "토지거래허가구역 (잠실동 일대)",
        status: "시행중",
        date: "2025.04 ~",
        description: "잠실 주공 5단지 등 재건축 예정 구역 포함. 실거주 의무 2년.",
        impact: "투기 수요 원천 차단. 매물 동결 효과로 거래 절벽 가능. 해제 시 가격 급등 가능성 내포.",
        impactType: "neutral",
      },
    ],
    redevelopments: [
      {
        name: "잠실주공 5단지 재건축",
        stage: "정비구역 지정 · 안전진단 통과",
        expectedCompletion: "2033~2035년 (예상)",
        description: "3,930세대 → 약 6,500세대. 잠실 최대 재건축 사업.",
        priceImpact: "호재",
        detail: "서울 대표 재건축 사업. 사업 진행 단계마다 주변 시세 상승 촉매. 다만 사업 기간이 길어 단기 시세 영향은 제한적.",
      },
      {
        name: "잠실래미안아이파크 (미성·크로바 재건축)",
        stage: "입주 완료",
        expectedCompletion: "2024년 입주",
        description: "기존 1,480세대 → 2,678세대. 잠실 신축 랜드마크.",
        priceImpact: "호재",
        detail: "입주와 함께 잠실동 시세 기준점 상향. 인근 엘스·리센츠·파크리오 시세 동반 상승.",
      },
    ],
  },
  마포구: {
    regulations: [
      {
        title: "투기과열지구 해제",
        status: "해제",
        date: "2024.05 해제",
        description: "마포구 전역 투기과열지구에서 해제. LTV·DTI 규제 완화.",
        impact: "대출 한도 확대로 매수 접근성 개선. 실수요 및 투자 수요 유입으로 거래량 회복, 가격 상승 압력 발생.",
        impactType: "positive",
      },
      {
        title: "정비사업 활성화 지구 지정 (아현동 일대)",
        status: "시행중",
        date: "2025.06 ~",
        description: "노후 주거지 정비 촉진. 용적률 인센티브 부여.",
        impact: "재개발 사업 속도 향상 기대. 용적률 상향으로 사업성 개선, 주변 노후 단지 가격 상승 요인.",
        impactType: "positive",
      },
    ],
    redevelopments: [
      {
        name: "마포로5구역 재개발",
        stage: "관리처분 인가 · 이주 진행 중",
        expectedCompletion: "2028~2029년 (예상)",
        description: "약 2,800세대 규모 대단지 아파트 예정. 마포대로변 입지.",
        priceImpact: "호재",
        detail: "마포구 중심부 대규모 신축 공급. 마포래미안푸르지오, 마포프레스티지자이 등 인근 시세 견인 기대.",
      },
      {
        name: "성산시영 재건축",
        stage: "추진위원회 구성",
        expectedCompletion: "2032~2034년 (예상)",
        description: "월드컵경기장 인근 대규모 재건축 추진.",
        priceImpact: "관망",
        detail: "초기 단계로 사업 불확실성 존재. 장기적으로 상암 DMC 일대 시세에 영향 가능.",
      },
    ],
  },
  용산구: {
    regulations: [
      {
        title: "투기과열지구 지정",
        status: "시행중",
        date: "2017.08 ~",
        description: "LTV 40%, DTI 40% 적용. 용산정비창 개발 기대감 관련 투기 억제.",
        impact: "용산 개발 호재에도 불구, 대출 규제로 실수요 위주 시장. 자금 여력 있는 매수자 중심 고가 거래.",
        impactType: "negative",
      },
      {
        title: "용산공원 특별법",
        status: "시행중",
        date: "2024.12 ~",
        description: "미군기지 이전 부지를 국가공원으로 조성. 주변 개발 가이드라인 수립.",
        impact: "대규모 공원 조성으로 주거 환경 획기적 개선 기대. 이촌·한남동 일대 장기 가격 상승 요인.",
        impactType: "positive",
      },
    ],
    redevelopments: [
      {
        name: "용산정비창 개발 (용산 국제업무지구)",
        stage: "마스터플랜 확정 · 사업 준비 중",
        expectedCompletion: "2030~2035년 (단계별)",
        description: "49만㎡ 부지에 업무·상업·주거 복합 개발. 서울 최대 도심 개발 사업.",
        priceImpact: "호재",
        detail: "서울의 맨해튼을 표방하는 초대형 프로젝트. 용산구 전역 시세에 장기적 상승 모멘텀. 특히 이촌동·한남동 직접 수혜.",
      },
      {
        name: "한남 재정비촉진지구",
        stage: "구역별 사업 추진 중",
        expectedCompletion: "2029~2033년 (구역별 상이)",
        description: "한남동 일대 5개 구역 재개발. 총 약 5,000세대 이상 공급 예정.",
        priceImpact: "호재",
        detail: "한남더힐·나인원한남과 함께 용산 한강변 초고가 주거벨트 형성. 강남 대치동 수준 시세 도달 전망.",
      },
    ],
  },
  성동구: {
    regulations: [
      {
        title: "투기과열지구 해제",
        status: "해제",
        date: "2024.05 해제",
        description: "성동구 전역 투기과열지구 해제. 대출 규제 완화.",
        impact: "규제 완화로 투자 매력도 상승. 강남 접근성 대비 가격 메리트로 유입 수요 증가, 시세 상승세.",
        impactType: "positive",
      },
      {
        title: "성수전략정비구역 지정",
        status: "시행중",
        date: "2025.09 ~",
        description: "성수동 일대를 전략정비구역으로 지정. IT·패션 산업과 주거 복합 개발.",
        impact: "성수동 상권 활성화와 맞물려 주거 수요 증가. 서울숲 인근 프리미엄 확대 기대.",
        impactType: "positive",
      },
    ],
    redevelopments: [
      {
        name: "성수동 전략정비사업",
        stage: "기본계획 수립 중",
        expectedCompletion: "2031~2033년 (예상)",
        description: "성수동 준공업지역 일대 복합 개발. 주거 약 3,000세대 포함.",
        priceImpact: "호재",
        detail: "성수동 '힙' 상권 + 서울숲 + 한강 조망의 트리플 프리미엄. 서울숲트리마제 등 인근 기존 단지 시세 상승 촉매.",
      },
      {
        name: "옥수동 재개발 (옥수13구역)",
        stage: "사업시행 인가",
        expectedCompletion: "2029~2030년 (예상)",
        description: "약 1,800세대 규모. 한강 조망 프리미엄 입지.",
        priceImpact: "호재",
        detail: "옥수역 역세권 + 한강 조망으로 높은 사업성. 옥수하이츠·옥수파크힐스 시세 동반 상승 예상.",
      },
    ],
  },
};
