export type SchoolType = "elementary" | "middle" | "high";

export interface School {
  name: string;
  type: SchoolType;
  district: string;
  address: string;
  lat: number;
  lng: number;
  students?: number;
  established?: number;
  note?: string; // 특목고, 학군 인기 등
}

export const SCHOOL_TYPE_LABEL: Record<SchoolType, string> = {
  elementary: "초등학교",
  middle: "중학교",
  high: "고등학교",
};

export const SCHOOL_DATA: School[] = [
  // ── 강남구 ──
  // 대치동 학원가 인근
  { name: "대치초등학교", type: "elementary", district: "강남구", address: "대치동 509", lat: 37.4950, lng: 127.0575, students: 1250, established: 1983 },
  { name: "대곡초등학교", type: "elementary", district: "강남구", address: "대치동 993", lat: 37.4935, lng: 127.0610, students: 980, established: 1986 },
  { name: "개포초등학교", type: "elementary", district: "강남구", address: "개포동 157", lat: 37.4845, lng: 127.0500, students: 870, established: 1983 },
  { name: "도곡초등학교", type: "elementary", district: "강남구", address: "도곡동 542", lat: 37.4890, lng: 127.0450, students: 720, established: 1987 },
  { name: "대치중학교", type: "middle", district: "강남구", address: "대치동 1000", lat: 37.4960, lng: 127.0600, students: 950, established: 1984, note: "강남 대표 학군" },
  { name: "역삼중학교", type: "middle", district: "강남구", address: "역삼동 710", lat: 37.5010, lng: 127.0500, students: 820, established: 1985 },
  { name: "개포중학교", type: "middle", district: "강남구", address: "개포동 180", lat: 37.4830, lng: 127.0520, students: 780, established: 1984 },
  { name: "도곡중학교", type: "middle", district: "강남구", address: "도곡동 540", lat: 37.4880, lng: 127.0430, students: 680, established: 1989 },
  { name: "휘문고등학교", type: "high", district: "강남구", address: "대치동 1003", lat: 37.4972, lng: 127.0610, students: 1100, established: 1906, note: "명문 사립고" },
  { name: "단대부속고등학교", type: "high", district: "강남구", address: "대치동 314", lat: 37.4985, lng: 127.0560, students: 950, established: 1958, note: "강남 인기 고교" },
  { name: "중동고등학교", type: "high", district: "강남구", address: "일원동 642", lat: 37.4870, lng: 127.0680, students: 1050, established: 1946, note: "명문 사립고" },
  { name: "개포고등학교", type: "high", district: "강남구", address: "개포동 187", lat: 37.4820, lng: 127.0540, students: 880, established: 1984 },

  // ── 서초구 ──
  { name: "반포초등학교", type: "elementary", district: "서초구", address: "반포동 63", lat: 37.5050, lng: 127.0020, students: 1050, established: 1982 },
  { name: "서초초등학교", type: "elementary", district: "서초구", address: "서초동 1336", lat: 37.4910, lng: 127.0100, students: 920, established: 1989 },
  { name: "잠원초등학교", type: "elementary", district: "서초구", address: "잠원동 55", lat: 37.5095, lng: 126.9980, students: 780, established: 1982 },
  { name: "반포중학교", type: "middle", district: "서초구", address: "반포동 67", lat: 37.5040, lng: 127.0000, students: 850, established: 1983, note: "반포 대표 학군" },
  { name: "서초중학교", type: "middle", district: "서초구", address: "서초동 1338", lat: 37.4905, lng: 127.0120, students: 780, established: 1990 },
  { name: "세화중학교", type: "middle", district: "서초구", address: "반포동 129", lat: 37.5025, lng: 127.0060, students: 720, established: 1972 },
  { name: "세화고등학교", type: "high", district: "서초구", address: "반포동 131", lat: 37.5030, lng: 127.0070, students: 950, established: 1972, note: "명문 사립고" },
  { name: "서초고등학교", type: "high", district: "서초구", address: "서초동 1340", lat: 37.4900, lng: 127.0080, students: 860, established: 1990 },
  { name: "반포고등학교", type: "high", district: "서초구", address: "반포동 69", lat: 37.5060, lng: 127.0040, students: 920, established: 1983 },

  // ── 송파구 ──
  { name: "잠실초등학교", type: "elementary", district: "송파구", address: "잠실동 175", lat: 37.5120, lng: 127.0860, students: 1150, established: 1978 },
  { name: "잠전초등학교", type: "elementary", district: "송파구", address: "잠실동 43", lat: 37.5105, lng: 127.0830, students: 980, established: 1983 },
  { name: "가락초등학교", type: "elementary", district: "송파구", address: "가락동 105", lat: 37.4965, lng: 127.1080, students: 850, established: 1983 },
  { name: "잠실중학교", type: "middle", district: "송파구", address: "잠실동 180", lat: 37.5130, lng: 127.0870, students: 900, established: 1979, note: "잠실 핵심 학군" },
  { name: "잠신중학교", type: "middle", district: "송파구", address: "잠실동 200", lat: 37.5140, lng: 127.0900, students: 780, established: 1981 },
  { name: "가락중학교", type: "middle", district: "송파구", address: "가락동 120", lat: 37.4955, lng: 127.1050, students: 720, established: 1984 },
  { name: "잠실고등학교", type: "high", district: "송파구", address: "잠실동 182", lat: 37.5145, lng: 127.0875, students: 1000, established: 1979 },
  { name: "보인고등학교", type: "high", district: "송파구", address: "잠실동 210", lat: 37.5155, lng: 127.0910, students: 950, established: 1954, note: "명문 사립고" },
  { name: "송파고등학교", type: "high", district: "송파구", address: "가락동 122", lat: 37.4975, lng: 127.1070, students: 880, established: 1988 },

  // ── 마포구 ──
  { name: "아현초등학교", type: "elementary", district: "마포구", address: "아현동 695", lat: 37.5555, lng: 126.9575, students: 650, established: 1945 },
  { name: "마포초등학교", type: "elementary", district: "마포구", address: "마포동 460", lat: 37.5440, lng: 126.9490, students: 580, established: 1938 },
  { name: "상암초등학교", type: "elementary", district: "마포구", address: "상암동 1580", lat: 37.5760, lng: 126.8930, students: 720, established: 2004 },
  { name: "아현중학교", type: "middle", district: "마포구", address: "아현동 700", lat: 37.5545, lng: 126.9555, students: 580, established: 1972 },
  { name: "마포중학교", type: "middle", district: "마포구", address: "신수동 10", lat: 37.5450, lng: 126.9460, students: 520, established: 1969 },
  { name: "상암중학교", type: "middle", district: "마포구", address: "상암동 1590", lat: 37.5775, lng: 126.8920, students: 620, established: 2007 },
  { name: "서울여자고등학교", type: "high", district: "마포구", address: "염리동 170", lat: 37.5540, lng: 126.9510, students: 850, established: 1947, note: "명문 여고" },
  { name: "마포고등학교", type: "high", district: "마포구", address: "아현동 710", lat: 37.5565, lng: 126.9540, students: 780, established: 1979 },
  { name: "DMC고등학교", type: "high", district: "마포구", address: "상암동 1595", lat: 37.5780, lng: 126.8940, students: 680, established: 2010 },

  // ── 용산구 ──
  { name: "이촌초등학교", type: "elementary", district: "용산구", address: "이촌동 305", lat: 37.5225, lng: 126.9735, students: 720, established: 1966 },
  { name: "한남초등학교", type: "elementary", district: "용산구", address: "한남동 815", lat: 37.5335, lng: 127.0040, students: 480, established: 1948 },
  { name: "보광초등학교", type: "elementary", district: "용산구", address: "보광동 310", lat: 37.5300, lng: 127.0010, students: 520, established: 1946 },
  { name: "이촌중학교", type: "middle", district: "용산구", address: "이촌동 307", lat: 37.5215, lng: 126.9720, students: 620, established: 1980 },
  { name: "한강중학교", type: "middle", district: "용산구", address: "이촌동 420", lat: 37.5205, lng: 126.9710, students: 580, established: 1972 },
  { name: "용산중학교", type: "middle", district: "용산구", address: "한남동 820", lat: 37.5345, lng: 127.0060, students: 550, established: 1946 },
  { name: "용산고등학교", type: "high", district: "용산구", address: "이촌동 310", lat: 37.5235, lng: 126.9760, students: 850, established: 1940, note: "용산 명문고" },
  { name: "한강고등학교", type: "high", district: "용산구", address: "이촌동 425", lat: 37.5195, lng: 126.9690, students: 780, established: 1972 },
  { name: "중경고등학교", type: "high", district: "용산구", address: "한남동 810", lat: 37.5330, lng: 127.0030, students: 680, established: 1949 },

  // ── 성동구 ──
  { name: "성수초등학교", type: "elementary", district: "성동구", address: "성수동1가 690", lat: 37.5465, lng: 127.0460, students: 620, established: 1945 },
  { name: "옥수초등학교", type: "elementary", district: "성동구", address: "옥수동 385", lat: 37.5405, lng: 127.0180, students: 550, established: 1966 },
  { name: "행당초등학교", type: "elementary", district: "성동구", address: "행당동 295", lat: 37.5600, lng: 127.0370, students: 580, established: 1965 },
  { name: "성수중학교", type: "middle", district: "성동구", address: "성수동1가 695", lat: 37.5475, lng: 127.0480, students: 530, established: 1972 },
  { name: "옥정중학교", type: "middle", district: "성동구", address: "옥수동 390", lat: 37.5415, lng: 127.0165, students: 480, established: 1982 },
  { name: "왕십리중학교", type: "middle", district: "성동구", address: "행당동 300", lat: 37.5615, lng: 127.0390, students: 520, established: 1975 },
  { name: "한양대부속고등학교", type: "high", district: "성동구", address: "행당동 310", lat: 37.5590, lng: 127.0400, students: 880, established: 1972, note: "명문 사립고" },
  { name: "성동고등학교", type: "high", district: "성동구", address: "성수동2가 320", lat: 37.5480, lng: 127.0520, students: 720, established: 1946 },
  { name: "무학고등학교", type: "high", district: "성동구", address: "옥수동 345", lat: 37.5390, lng: 127.0200, students: 650, established: 1964 },
];
