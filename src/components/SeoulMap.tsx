"use client";

import type { District } from "@/data/apartments";

interface SeoulMapProps {
  selected: District | null;
  onSelect: (district: District) => void;
}

interface DistrictShape {
  id: District;
  label: string;
  path: string;
  labelX: number;
  labelY: number;
}

// 6개 구의 상대적 위치를 반영한 간소화 SVG 경로
const districts: DistrictShape[] = [
  {
    id: "마포구",
    label: "마포",
    path: "M60,80 L120,60 L140,90 L130,140 L80,150 L50,120Z",
    labelX: 95,
    labelY: 110,
  },
  {
    id: "용산구",
    label: "용산",
    path: "M140,90 L200,80 L220,120 L210,160 L130,140Z",
    labelX: 175,
    labelY: 120,
  },
  {
    id: "성동구",
    label: "성동",
    path: "M200,80 L280,60 L300,100 L290,140 L220,120Z",
    labelX: 250,
    labelY: 100,
  },
  {
    id: "서초구",
    label: "서초",
    path: "M130,140 L210,160 L230,220 L200,270 L120,250 L100,190Z",
    labelX: 165,
    labelY: 205,
  },
  {
    id: "강남구",
    label: "강남",
    path: "M210,160 L290,140 L320,180 L310,240 L230,220Z",
    labelX: 265,
    labelY: 190,
  },
  {
    id: "송파구",
    label: "송파",
    path: "M290,140 L370,130 L390,190 L370,250 L310,240 L320,180Z",
    labelX: 345,
    labelY: 190,
  },
];

export default function SeoulMap({ selected, onSelect }: SeoulMapProps) {
  return (
    <div className="relative">
      <svg viewBox="20 30 400 260" className="w-full h-auto">
        {/* 배경 */}
        <rect x="20" y="30" width="400" height="260" fill="#f0f4ff" rx="16" />

        {districts.map((d) => {
          const isSelected = selected === d.id;
          return (
            <g
              key={d.id}
              onClick={() => onSelect(d.id)}
              className="cursor-pointer"
            >
              <path
                d={d.path}
                fill={isSelected ? "#2563eb" : "#dbeafe"}
                stroke={isSelected ? "#1d4ed8" : "#93c5fd"}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-all duration-200 hover:fill-blue-300"
              />
              <text
                x={d.labelX}
                y={d.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight={isSelected ? "700" : "500"}
                fill={isSelected ? "#ffffff" : "#1e40af"}
                className="pointer-events-none select-none"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* 한강 표현 */}
        <path
          d="M30,135 Q100,125 180,130 Q260,135 340,125 Q380,120 410,130"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3"
          strokeDasharray="6 4"
          opacity="0.5"
          className="pointer-events-none"
        />
        <text
          x="42"
          y="128"
          fontSize="9"
          fill="#60a5fa"
          opacity="0.7"
          className="pointer-events-none select-none"
        >
          한강
        </text>
      </svg>
    </div>
  );
}
