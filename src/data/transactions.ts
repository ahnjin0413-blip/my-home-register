/** 국토교통부 실거래가 공개시스템 형식 기반 */
export interface Transaction {
  date: string; // YYYY.MM.DD
  area: string; // 전용면적 (㎡)
  floor: number;
  price: number; // 만원 단위
  type: "매매" | "전세" | "월세";
  dong: string;
}

// 단지별 최근 실거래 내역 (complexId → Transaction[])
// 실제 서비스에서는 국토교통부 실거래가 공개시스템 API 연동
export const TRANSACTION_DATA: Record<string, Transaction[]> = {
  // 강남구
  "gn-001": [
    { date: "2026.03.15", area: "84.97", floor: 18, price: 325000, type: "매매", dong: "103동" },
    { date: "2026.03.08", area: "84.97", floor: 7, price: 310000, type: "매매", dong: "107동" },
    { date: "2026.02.22", area: "59.96", floor: 12, price: 265000, type: "매매", dong: "101동" },
    { date: "2026.02.10", area: "84.97", floor: 22, price: 335000, type: "매매", dong: "105동" },
    { date: "2026.01.28", area: "114.90", floor: 15, price: 420000, type: "매매", dong: "108동" },
    { date: "2026.03.20", area: "84.97", floor: 10, price: 180000, type: "전세", dong: "102동" },
    { date: "2026.02.15", area: "59.96", floor: 5, price: 145000, type: "전세", dong: "106동" },
  ],
  "gn-002": [
    { date: "2026.03.22", area: "84.43", floor: 8, price: 295000, type: "매매", dong: "12동" },
    { date: "2026.03.10", area: "84.43", floor: 3, price: 280000, type: "매매", dong: "5동" },
    { date: "2026.02.28", area: "84.43", floor: 12, price: 302000, type: "매매", dong: "20동" },
    { date: "2026.02.05", area: "76.79", floor: 6, price: 258000, type: "매매", dong: "8동" },
    { date: "2026.01.18", area: "84.43", floor: 10, price: 288000, type: "매매", dong: "15동" },
    { date: "2026.03.05", area: "84.43", floor: 7, price: 155000, type: "전세", dong: "3동" },
  ],
  "gn-003": [
    { date: "2026.03.25", area: "84.98", floor: 25, price: 385000, type: "매매", dong: "110동" },
    { date: "2026.03.12", area: "59.99", floor: 18, price: 310000, type: "매매", dong: "103동" },
    { date: "2026.03.01", area: "114.81", floor: 30, price: 520000, type: "매매", dong: "112동" },
    { date: "2026.02.20", area: "84.98", floor: 10, price: 370000, type: "매매", dong: "105동" },
    { date: "2026.02.08", area: "84.98", floor: 20, price: 378000, type: "매매", dong: "108동" },
    { date: "2026.03.18", area: "84.98", floor: 15, price: 210000, type: "전세", dong: "101동" },
  ],
  "gn-004": [
    { date: "2026.03.18", area: "84.95", floor: 14, price: 248000, type: "매매", dong: "104동" },
    { date: "2026.02.25", area: "84.95", floor: 8, price: 238000, type: "매매", dong: "101동" },
    { date: "2026.02.12", area: "122.47", floor: 20, price: 335000, type: "매매", dong: "106동" },
    { date: "2026.01.30", area: "84.95", floor: 16, price: 252000, type: "매매", dong: "103동" },
    { date: "2026.03.10", area: "84.95", floor: 6, price: 135000, type: "전세", dong: "102동" },
  ],
  "gn-005": [
    { date: "2026.03.20", area: "84.90", floor: 22, price: 365000, type: "매매", dong: "102동" },
    { date: "2026.03.05", area: "59.94", floor: 15, price: 298000, type: "매매", dong: "101동" },
    { date: "2026.02.18", area: "84.90", floor: 10, price: 348000, type: "매매", dong: "103동" },
    { date: "2026.01.25", area: "114.85", floor: 28, price: 480000, type: "매매", dong: "104동" },
  ],
  "gn-006": [
    { date: "2026.03.12", area: "84.99", floor: 12, price: 235000, type: "매매", dong: "103동" },
    { date: "2026.02.20", area: "84.99", floor: 7, price: 225000, type: "매매", dong: "101동" },
    { date: "2026.01.28", area: "59.97", floor: 15, price: 190000, type: "매매", dong: "104동" },
    { date: "2026.03.08", area: "84.99", floor: 5, price: 130000, type: "전세", dong: "102동" },
  ],
  "gn-007": [
    { date: "2026.03.15", area: "84.92", floor: 15, price: 268000, type: "매매", dong: "102동" },
    { date: "2026.02.22", area: "84.92", floor: 8, price: 255000, type: "매매", dong: "101동" },
    { date: "2026.02.05", area: "59.88", floor: 11, price: 215000, type: "매매", dong: "103동" },
  ],
  // 서초구
  "sc-001": [
    { date: "2026.03.22", area: "84.96", floor: 20, price: 355000, type: "매매", dong: "108동" },
    { date: "2026.03.05", area: "84.96", floor: 10, price: 338000, type: "매매", dong: "103동" },
    { date: "2026.02.18", area: "59.93", floor: 16, price: 275000, type: "매매", dong: "110동" },
    { date: "2026.02.01", area: "114.87", floor: 25, price: 458000, type: "매매", dong: "105동" },
    { date: "2026.01.20", area: "84.96", floor: 8, price: 330000, type: "매매", dong: "101동" },
    { date: "2026.03.15", area: "84.96", floor: 12, price: 195000, type: "전세", dong: "106동" },
  ],
  "sc-002": [
    { date: "2026.03.25", area: "84.98", floor: 28, price: 498000, type: "매매", dong: "105동" },
    { date: "2026.03.10", area: "84.98", floor: 15, price: 475000, type: "매매", dong: "102동" },
    { date: "2026.02.22", area: "59.96", floor: 20, price: 385000, type: "매매", dong: "107동" },
    { date: "2026.02.05", area: "114.92", floor: 32, price: 620000, type: "매매", dong: "101동" },
    { date: "2026.03.18", area: "84.98", floor: 10, price: 260000, type: "전세", dong: "103동" },
  ],
  "sc-003": [
    { date: "2026.03.20", area: "84.95", floor: 18, price: 342000, type: "매매", dong: "109동" },
    { date: "2026.03.08", area: "84.95", floor: 8, price: 325000, type: "매매", dong: "103동" },
    { date: "2026.02.15", area: "59.91", floor: 12, price: 268000, type: "매매", dong: "112동" },
    { date: "2026.02.02", area: "114.88", floor: 22, price: 445000, type: "매매", dong: "107동" },
    { date: "2026.01.18", area: "84.95", floor: 15, price: 335000, type: "매매", dong: "101동" },
  ],
  "sc-004": [
    { date: "2026.03.18", area: "84.93", floor: 20, price: 278000, type: "매매", dong: "104동" },
    { date: "2026.03.02", area: "59.90", floor: 12, price: 228000, type: "매매", dong: "101동" },
    { date: "2026.02.10", area: "84.93", floor: 8, price: 265000, type: "매매", dong: "105동" },
    { date: "2026.01.22", area: "114.86", floor: 25, price: 368000, type: "매매", dong: "103동" },
  ],
  "sc-005": [
    { date: "2026.03.15", area: "84.91", floor: 15, price: 255000, type: "매매", dong: "103동" },
    { date: "2026.02.28", area: "84.91", floor: 8, price: 242000, type: "매매", dong: "101동" },
    { date: "2026.02.12", area: "59.89", floor: 10, price: 198000, type: "매매", dong: "104동" },
  ],
  "sc-006": [
    { date: "2026.03.22", area: "84.94", floor: 22, price: 328000, type: "매매", dong: "106동" },
    { date: "2026.03.08", area: "59.92", floor: 15, price: 262000, type: "매매", dong: "102동" },
    { date: "2026.02.20", area: "84.94", floor: 10, price: 312000, type: "매매", dong: "104동" },
    { date: "2026.01.30", area: "114.89", floor: 28, price: 435000, type: "매매", dong: "107동" },
  ],
  // 송파구
  "sp-001": [
    { date: "2026.03.22", area: "84.82", floor: 15, price: 278000, type: "매매", dong: "112동" },
    { date: "2026.03.10", area: "84.82", floor: 8, price: 262000, type: "매매", dong: "105동" },
    { date: "2026.02.25", area: "59.88", floor: 12, price: 218000, type: "매매", dong: "118동" },
    { date: "2026.02.08", area: "114.78", floor: 20, price: 355000, type: "매매", dong: "103동" },
    { date: "2026.01.22", area: "84.82", floor: 18, price: 270000, type: "매매", dong: "110동" },
    { date: "2026.03.18", area: "84.82", floor: 10, price: 155000, type: "전세", dong: "107동" },
  ],
  "sp-002": [
    { date: "2026.03.25", area: "84.98", floor: 22, price: 218000, type: "매매", dong: "115동" },
    { date: "2026.03.12", area: "84.98", floor: 10, price: 205000, type: "매매", dong: "108동" },
    { date: "2026.02.28", area: "59.96", floor: 15, price: 170000, type: "매매", dong: "120동" },
    { date: "2026.02.10", area: "99.93", floor: 25, price: 258000, type: "매매", dong: "103동" },
    { date: "2026.01.25", area: "84.98", floor: 8, price: 198000, type: "매매", dong: "112동" },
    { date: "2026.03.20", area: "84.98", floor: 12, price: 120000, type: "전세", dong: "105동" },
  ],
  "sp-003": [
    { date: "2026.03.20", area: "84.95", floor: 18, price: 258000, type: "매매", dong: "108동" },
    { date: "2026.03.05", area: "84.95", floor: 7, price: 242000, type: "매매", dong: "103동" },
    { date: "2026.02.18", area: "59.91", floor: 12, price: 198000, type: "매매", dong: "111동" },
    { date: "2026.02.02", area: "114.88", floor: 22, price: 335000, type: "매매", dong: "105동" },
  ],
  "sp-004": [
    { date: "2026.03.18", area: "84.90", floor: 20, price: 268000, type: "매매", dong: "113동" },
    { date: "2026.03.02", area: "84.90", floor: 10, price: 252000, type: "매매", dong: "106동" },
    { date: "2026.02.15", area: "59.87", floor: 14, price: 208000, type: "매매", dong: "118동" },
    { date: "2026.01.28", area: "114.85", floor: 25, price: 345000, type: "매매", dong: "101동" },
  ],
  "sp-005": [
    { date: "2026.03.25", area: "84.96", floor: 28, price: 308000, type: "매매", dong: "107동" },
    { date: "2026.03.10", area: "84.96", floor: 15, price: 295000, type: "매매", dong: "103동" },
    { date: "2026.02.22", area: "59.93", floor: 20, price: 245000, type: "매매", dong: "108동" },
    { date: "2026.02.05", area: "114.90", floor: 32, price: 405000, type: "매매", dong: "105동" },
  ],
  "sp-006": [
    { date: "2026.03.15", area: "84.79", floor: 10, price: 208000, type: "매매", dong: "108동" },
    { date: "2026.02.28", area: "84.79", floor: 5, price: 195000, type: "매매", dong: "103동" },
    { date: "2026.02.10", area: "59.85", floor: 8, price: 162000, type: "매매", dong: "112동" },
    { date: "2026.01.20", area: "84.79", floor: 12, price: 202000, type: "매매", dong: "105동" },
  ],
  // 마포구
  "mp-001": [
    { date: "2026.03.22", area: "84.97", floor: 20, price: 192000, type: "매매", dong: "110동" },
    { date: "2026.03.08", area: "84.97", floor: 10, price: 182000, type: "매매", dong: "104동" },
    { date: "2026.02.20", area: "59.93", floor: 15, price: 152000, type: "매매", dong: "112동" },
    { date: "2026.02.05", area: "114.90", floor: 22, price: 248000, type: "매매", dong: "107동" },
    { date: "2026.01.18", area: "84.97", floor: 8, price: 178000, type: "매매", dong: "101동" },
    { date: "2026.03.15", area: "84.97", floor: 12, price: 105000, type: "전세", dong: "108동" },
  ],
  "mp-002": [
    { date: "2026.03.18", area: "84.95", floor: 18, price: 172000, type: "매매", dong: "106동" },
    { date: "2026.03.02", area: "84.95", floor: 8, price: 162000, type: "매매", dong: "102동" },
    { date: "2026.02.15", area: "59.91", floor: 12, price: 135000, type: "매매", dong: "108동" },
    { date: "2026.01.28", area: "114.88", floor: 20, price: 225000, type: "매매", dong: "104동" },
  ],
  "mp-003": [
    { date: "2026.03.25", area: "84.93", floor: 22, price: 202000, type: "매매", dong: "105동" },
    { date: "2026.03.10", area: "59.90", floor: 15, price: 165000, type: "매매", dong: "102동" },
    { date: "2026.02.22", area: "84.93", floor: 10, price: 195000, type: "매매", dong: "104동" },
    { date: "2026.02.05", area: "114.86", floor: 25, price: 268000, type: "매매", dong: "106동" },
  ],
  "mp-004": [
    { date: "2026.03.12", area: "84.90", floor: 12, price: 125000, type: "매매", dong: "503동" },
    { date: "2026.02.25", area: "84.90", floor: 8, price: 118000, type: "매매", dong: "501동" },
    { date: "2026.02.08", area: "59.87", floor: 10, price: 98000, type: "매매", dong: "504동" },
  ],
  "mp-005": [
    { date: "2026.03.15", area: "84.92", floor: 15, price: 142000, type: "매매", dong: "103동" },
    { date: "2026.02.28", area: "84.92", floor: 8, price: 135000, type: "매매", dong: "101동" },
    { date: "2026.02.10", area: "59.89", floor: 10, price: 112000, type: "매매", dong: "104동" },
  ],
  // 용산구
  "ys-001": [
    { date: "2026.03.22", area: "84.96", floor: 18, price: 258000, type: "매매", dong: "105동" },
    { date: "2026.03.05", area: "84.96", floor: 10, price: 242000, type: "매매", dong: "102동" },
    { date: "2026.02.18", area: "59.93", floor: 14, price: 198000, type: "매매", dong: "107동" },
    { date: "2026.02.01", area: "114.89", floor: 22, price: 338000, type: "매매", dong: "103동" },
    { date: "2026.03.18", area: "84.96", floor: 8, price: 145000, type: "전세", dong: "106동" },
  ],
  "ys-002": [
    { date: "2026.03.20", area: "244.78", floor: 3, price: 780000, type: "매매", dong: "103동" },
    { date: "2026.02.28", area: "176.53", floor: 5, price: 620000, type: "매매", dong: "105동" },
    { date: "2026.02.10", area: "244.78", floor: 2, price: 750000, type: "매매", dong: "101동" },
    { date: "2026.01.22", area: "176.53", floor: 4, price: 605000, type: "매매", dong: "104동" },
  ],
  "ys-003": [
    { date: "2026.03.18", area: "84.94", floor: 15, price: 208000, type: "매매", dong: "108동" },
    { date: "2026.03.02", area: "84.94", floor: 8, price: 195000, type: "매매", dong: "103동" },
    { date: "2026.02.15", area: "59.91", floor: 12, price: 162000, type: "매매", dong: "110동" },
    { date: "2026.01.28", area: "114.87", floor: 20, price: 275000, type: "매매", dong: "105동" },
  ],
  "ys-004": [
    { date: "2026.03.12", area: "84.88", floor: 10, price: 182000, type: "매매", dong: "102동" },
    { date: "2026.02.22", area: "84.88", floor: 5, price: 172000, type: "매매", dong: "101동" },
    { date: "2026.02.05", area: "59.84", floor: 8, price: 142000, type: "매매", dong: "103동" },
  ],
  "ys-005": [
    { date: "2026.03.25", area: "206.65", floor: 8, price: 880000, type: "매매", dong: "102동" },
    { date: "2026.02.28", area: "158.32", floor: 5, price: 680000, type: "매매", dong: "101동" },
    { date: "2026.02.08", area: "206.65", floor: 6, price: 850000, type: "매매", dong: "103동" },
  ],
  // 성동구
  "sd-001": [
    { date: "2026.03.22", area: "84.96", floor: 20, price: 228000, type: "매매", dong: "105동" },
    { date: "2026.03.08", area: "84.96", floor: 12, price: 218000, type: "매매", dong: "102동" },
    { date: "2026.02.20", area: "59.93", floor: 15, price: 178000, type: "매매", dong: "106동" },
    { date: "2026.02.02", area: "114.89", floor: 22, price: 298000, type: "매매", dong: "103동" },
    { date: "2026.03.15", area: "84.96", floor: 8, price: 128000, type: "전세", dong: "101동" },
  ],
  "sd-002": [
    { date: "2026.03.15", area: "84.88", floor: 10, price: 142000, type: "매매", dong: "103동" },
    { date: "2026.02.25", area: "84.88", floor: 5, price: 132000, type: "매매", dong: "101동" },
    { date: "2026.02.08", area: "59.84", floor: 8, price: 108000, type: "매매", dong: "102동" },
  ],
  "sd-003": [
    { date: "2026.03.20", area: "84.93", floor: 18, price: 168000, type: "매매", dong: "106동" },
    { date: "2026.03.05", area: "84.93", floor: 8, price: 155000, type: "매매", dong: "102동" },
    { date: "2026.02.18", area: "59.90", floor: 12, price: 128000, type: "매매", dong: "107동" },
    { date: "2026.01.30", area: "114.86", floor: 20, price: 218000, type: "매매", dong: "104동" },
  ],
  "sd-004": [
    { date: "2026.03.12", area: "84.91", floor: 12, price: 158000, type: "매매", dong: "103동" },
    { date: "2026.02.28", area: "84.91", floor: 7, price: 148000, type: "매매", dong: "101동" },
    { date: "2026.02.10", area: "59.88", floor: 10, price: 122000, type: "매매", dong: "104동" },
  ],
  "sd-005": [
    { date: "2026.03.22", area: "84.94", floor: 18, price: 182000, type: "매매", dong: "106동" },
    { date: "2026.03.05", area: "84.94", floor: 10, price: 172000, type: "매매", dong: "103동" },
    { date: "2026.02.18", area: "59.91", floor: 14, price: 140000, type: "매매", dong: "107동" },
    { date: "2026.02.01", area: "114.87", floor: 20, price: 235000, type: "매매", dong: "105동" },
  ],
};

export function getTransactions(complexId: string): Transaction[] {
  return TRANSACTION_DATA[complexId] || [];
}
