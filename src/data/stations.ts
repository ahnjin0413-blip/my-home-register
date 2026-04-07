export interface Station {
  name: string;
  line: string; // 대표 호선 (표시용)
  lines: string[]; // 모든 호선
  district: string;
  lat: number;
  lng: number;
}

/** 서울 지하철 호선별 공식 색상 */
export const LINE_COLORS: Record<string, string> = {
  "1": "#0052A4",
  "2": "#00A84D",
  "3": "#EF7C1C",
  "4": "#00A5DE",
  "5": "#996CAC",
  "6": "#CD7C2F",
  "7": "#747F00",
  "8": "#E6186C",
  "9": "#BDB092",
  "경의": "#77C4A3",
  "분당": "#F5A200",
  "신분당": "#D4003B",
};

export const STATION_DATA: Station[] = [
  // ── 강남구 ──
  { name: "강남", line: "2", lines: ["2"], district: "강남구", lat: 37.4980, lng: 127.0276 },
  { name: "역삼", line: "2", lines: ["2"], district: "강남구", lat: 37.5007, lng: 127.0365 },
  { name: "선릉", line: "2", lines: ["2"], district: "강남구", lat: 37.5045, lng: 127.0490 },
  { name: "삼성", line: "2", lines: ["2"], district: "강남구", lat: 37.5088, lng: 127.0631 },
  { name: "대치", line: "3", lines: ["3"], district: "강남구", lat: 37.4948, lng: 127.0635 },
  { name: "학여울", line: "3", lines: ["3"], district: "강남구", lat: 37.4965, lng: 127.0715 },
  { name: "도곡", line: "3", lines: ["3"], district: "강남구", lat: 37.4915, lng: 127.0540 },
  { name: "매봉", line: "3", lines: ["3"], district: "강남구", lat: 37.4872, lng: 127.0475 },
  { name: "개포디지털단지", line: "3", lines: ["3"], district: "강남구", lat: 37.4835, lng: 127.0440 },
  { name: "대모산입구", line: "3", lines: ["3"], district: "강남구", lat: 37.4870, lng: 127.0730 },
  { name: "한티", line: "분당", lines: ["분당"], district: "강남구", lat: 37.5100, lng: 127.0650 },
  { name: "선정릉", line: "분당", lines: ["분당"], district: "강남구", lat: 37.5105, lng: 127.0430 },

  // ── 서초구 ──
  { name: "서초", line: "2", lines: ["2"], district: "서초구", lat: 37.4920, lng: 127.0075 },
  { name: "교대", line: "2", lines: ["2", "3"], district: "서초구", lat: 37.4937, lng: 127.0145 },
  { name: "방배", line: "2", lines: ["2"], district: "서초구", lat: 37.4815, lng: 126.9977 },
  { name: "반포", line: "7", lines: ["7"], district: "서초구", lat: 37.5085, lng: 127.0120 },
  { name: "고속터미널", line: "3", lines: ["3", "7", "9"], district: "서초구", lat: 37.5050, lng: 127.0050 },
  { name: "잠원", line: "3", lines: ["3"], district: "서초구", lat: 37.5110, lng: 126.9970 },
  { name: "내방", line: "7", lines: ["7"], district: "서초구", lat: 37.4877, lng: 126.9908 },
  { name: "신반포", line: "9", lines: ["9"], district: "서초구", lat: 37.5085, lng: 127.0005 },

  // ── 송파구 ──
  { name: "잠실", line: "2", lines: ["2", "8"], district: "송파구", lat: 37.5133, lng: 127.1000 },
  { name: "잠실새내", line: "2", lines: ["2"], district: "송파구", lat: 37.5117, lng: 127.0860 },
  { name: "종합운동장", line: "2", lines: ["2", "9"], district: "송파구", lat: 37.5110, lng: 127.0740 },
  { name: "석촌", line: "8", lines: ["8", "9"], district: "송파구", lat: 37.5055, lng: 127.1070 },
  { name: "송파", line: "8", lines: ["8"], district: "송파구", lat: 37.5005, lng: 127.1120 },
  { name: "가락시장", line: "3", lines: ["3", "8"], district: "송파구", lat: 37.4927, lng: 127.1180 },
  { name: "몽촌토성", line: "8", lines: ["8"], district: "송파구", lat: 37.5170, lng: 127.1120 },
  { name: "올림픽공원", line: "5", lines: ["5", "9"], district: "송파구", lat: 37.5160, lng: 127.1310 },

  // ── 마포구 ──
  { name: "마포", line: "5", lines: ["5"], district: "마포구", lat: 37.5395, lng: 126.9460 },
  { name: "아현", line: "2", lines: ["2"], district: "마포구", lat: 37.5578, lng: 126.9562 },
  { name: "이대", line: "2", lines: ["2"], district: "마포구", lat: 37.5567, lng: 126.9460 },
  { name: "신촌", line: "2", lines: ["2"], district: "마포구", lat: 37.5553, lng: 126.9368 },
  { name: "홍대입구", line: "2", lines: ["2", "경의"], district: "마포구", lat: 37.5573, lng: 126.9237 },
  { name: "공덕", line: "5", lines: ["5", "6", "경의"], district: "마포구", lat: 37.5440, lng: 126.9518 },
  { name: "상암월드컵경기장", line: "6", lines: ["6"], district: "마포구", lat: 37.5680, lng: 126.8975 },
  { name: "디지털미디어시티", line: "6", lines: ["6", "경의"], district: "마포구", lat: 37.5760, lng: 126.8997 },
  { name: "망원", line: "6", lines: ["6"], district: "마포구", lat: 37.5566, lng: 126.9100 },

  // ── 용산구 ──
  { name: "용산", line: "1", lines: ["1", "경의"], district: "용산구", lat: 37.5299, lng: 126.9648 },
  { name: "이촌", line: "4", lines: ["4", "경의"], district: "용산구", lat: 37.5215, lng: 126.9710 },
  { name: "한강진", line: "6", lines: ["6"], district: "용산구", lat: 37.5348, lng: 127.0000 },
  { name: "녹사평", line: "6", lines: ["6"], district: "용산구", lat: 37.5342, lng: 126.9870 },
  { name: "삼각지", line: "4", lines: ["4", "6"], district: "용산구", lat: 37.5346, lng: 126.9728 },
  { name: "신용산", line: "4", lines: ["4"], district: "용산구", lat: 37.5280, lng: 126.9670 },
  { name: "서빙고", line: "경의", lines: ["경의"], district: "용산구", lat: 37.5215, lng: 126.9830 },

  // ── 성동구 ──
  { name: "왕십리", line: "2", lines: ["2", "5", "분당"], district: "성동구", lat: 37.5610, lng: 127.0380 },
  { name: "한양대", line: "2", lines: ["2"], district: "성동구", lat: 37.5575, lng: 127.0445 },
  { name: "뚝섬", line: "2", lines: ["2"], district: "성동구", lat: 37.5475, lng: 127.0470 },
  { name: "성수", line: "2", lines: ["2"], district: "성동구", lat: 37.5445, lng: 127.0560 },
  { name: "옥수", line: "3", lines: ["3", "경의"], district: "성동구", lat: 37.5400, lng: 127.0175 },
  { name: "금호", line: "3", lines: ["3"], district: "성동구", lat: 37.5470, lng: 127.0250 },
  { name: "행당", line: "5", lines: ["5"], district: "성동구", lat: 37.5585, lng: 127.0320 },
  { name: "마장", line: "5", lines: ["5"], district: "성동구", lat: 37.5635, lng: 127.0430 },
];
