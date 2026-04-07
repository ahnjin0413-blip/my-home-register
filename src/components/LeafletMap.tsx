"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  APARTMENT_DATA,
  DISTRICT_CENTER,
  type District,
  type ApartmentComplex,
} from "@/data/apartments";
import { SCHOOL_DATA, type SchoolType } from "@/data/schools";
import { STATION_DATA, LINE_COLORS } from "@/data/stations";

function formatPrice(price: number): string {
  if (price >= 10) {
    const eok = Math.floor(price);
    const cheon = Math.round((price - eok) * 10);
    return cheon > 0 ? `${eok}억${cheon}천` : `${eok}억`;
  }
  return `${Math.round(price * 1000)}만`;
}

// ── 아파트 아이콘 ──
const APT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36" width="32" height="36">
  <path d="M4 34V8l12-6 12 6v26H4z" fill="FILL" stroke="STROKE" stroke-width="1.5"/>
  <rect x="8" y="12" width="4" height="4" rx="0.5" fill="WIN"/>
  <rect x="14" y="12" width="4" height="4" rx="0.5" fill="WIN"/>
  <rect x="20" y="12" width="4" height="4" rx="0.5" fill="WIN"/>
  <rect x="8" y="19" width="4" height="4" rx="0.5" fill="WIN"/>
  <rect x="14" y="19" width="4" height="4" rx="0.5" fill="WIN"/>
  <rect x="20" y="19" width="4" height="4" rx="0.5" fill="WIN"/>
  <rect x="13" y="27" width="6" height="7" rx="1" fill="STROKE"/>
</svg>`;

function createPriceIcon(complex: ApartmentComplex, isSelected: boolean) {
  const price = formatPrice(complex.priceMax);
  const fill = isSelected ? "#2563eb" : "#dbeafe";
  const stroke = isSelected ? "#1e40af" : "#60a5fa";
  const win = isSelected ? "#93c5fd" : "#ffffff";
  const textColor = isSelected ? "#ffffff" : "#1e40af";
  const bgColor = isSelected ? "#2563eb" : "#ffffff";
  const borderColor = isSelected ? "#1e40af" : "#93c5fd";
  const svg = APT_SVG.replace(/FILL/g, fill).replace(/STROKE/g, stroke).replace(/WIN/g, win);

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;">
      <div style="width:36px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${svg}</div>
      <div style="margin-top:2px;background:${bgColor};color:${textColor};border:1.5px solid ${borderColor};border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.12);line-height:1.4;">${price}</div>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// ── 학교 아이콘 ──
const SCHOOL_COLORS: Record<SchoolType, { bg: string; border: string; text: string; label: string }> = {
  elementary: { bg: "#fef9c3", border: "#facc15", text: "#854d0e", label: "초" },
  middle: { bg: "#d1fae5", border: "#34d399", text: "#065f46", label: "중" },
  high: { bg: "#ede9fe", border: "#a78bfa", text: "#4c1d95", label: "고" },
};

function createSchoolIcon(type: SchoolType) {
  const c = SCHOOL_COLORS[type];
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      transform:translate(-50%,-50%);
      width:26px;height:26px;
      background:${c.bg};
      border:2px solid ${c.border};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:800;color:${c.text};
      box-shadow:0 1px 4px rgba(0,0,0,0.15);
      cursor:pointer;
    ">${c.label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

interface LeafletMapProps {
  selectedDistrict: District | null;
  onSelectDistrict: (d: District) => void;
  onSelectComplex: (c: ApartmentComplex) => void;
  selectedComplexId: string | null;
}

export default function LeafletMap({
  selectedDistrict,
  onSelectDistrict,
  onSelectComplex,
  selectedComplexId,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const schoolLayersRef = useRef<Record<SchoolType, L.LayerGroup>>({
    elementary: L.layerGroup(),
    middle: L.layerGroup(),
    high: L.layerGroup(),
  });

  const stationLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  const [showSchools, setShowSchools] = useState<Record<SchoolType, boolean>>({
    elementary: true,
    middle: true,
    high: true,
  });

  // 지도 초기화
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [37.52, 127.02],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 아파트 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    const complexes = selectedDistrict
      ? APARTMENT_DATA.filter((a) => a.district === selectedDistrict)
      : APARTMENT_DATA;

    complexes.forEach((complex) => {
      const marker = L.marker([complex.lat, complex.lng], {
        icon: createPriceIcon(complex, complex.id === selectedComplexId),
      });

      const changeColor = complex.priceChange > 0 ? "#dc2626" : "#2563eb";
      const changeSign = complex.priceChange > 0 ? "+" : "";

      marker.bindPopup(
        `<div style="font-family:sans-serif;min-width:220px;">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${complex.name}</div>
          <div style="color:#6b7280;font-size:11px;margin-bottom:8px;">${complex.address}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:15px;font-weight:700;color:#2563eb;">
              ${formatPrice(complex.priceMin)}~${formatPrice(complex.priceMax)}
            </span>
            <span style="font-size:11px;font-weight:600;color:${changeColor};">
              ${changeSign}${complex.priceChange.toFixed(1)}%
            </span>
          </div>
          <div style="color:#9ca3af;font-size:10px;margin-bottom:10px;">
            84㎡ 기준 · ${complex.totalUnits.toLocaleString()}세대 · ${complex.builtYear}년
          </div>
          <a href="/complex?id=${complex.id}" style="
            display:block;text-align:center;padding:8px;
            background:#2563eb;color:#fff;border-radius:8px;
            font-size:12px;font-weight:600;text-decoration:none;
          ">시세 · 규제 상세 보기 →</a>
        </div>`,
        { closeButton: false, className: "custom-popup" }
      );

      marker.on("click", () => {
        onSelectComplex(complex);
        if (complex.district !== selectedDistrict) {
          onSelectDistrict(complex.district as District);
        }
      });

      markersRef.current!.addLayer(marker);
    });
  }, [selectedDistrict, selectedComplexId, onSelectComplex, onSelectDistrict]);

  // 학교 마커 업데이트
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    (["elementary", "middle", "high"] as SchoolType[]).forEach((type) => {
      const layer = schoolLayersRef.current[type];
      layer.clearLayers();

      if (showSchools[type]) {
        const schools = selectedDistrict
          ? SCHOOL_DATA.filter((s) => s.type === type && s.district === selectedDistrict)
          : SCHOOL_DATA.filter((s) => s.type === type);

        schools.forEach((school) => {
          const marker = L.marker([school.lat, school.lng], {
            icon: createSchoolIcon(type),
            zIndexOffset: -100,
          });

          const noteHtml = school.note
            ? `<div style="margin-top:4px;"><span style="font-size:10px;font-weight:600;color:#2563eb;background:#eff6ff;padding:2px 6px;border-radius:4px;">${school.note}</span></div>`
            : "";

          marker.bindPopup(
            `<div style="font-family:sans-serif;min-width:160px;">
              <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${school.name}</div>
              <div style="color:#6b7280;font-size:10px;margin-bottom:4px;">${school.address}</div>
              <div style="color:#9ca3af;font-size:10px;">
                ${school.students ? school.students.toLocaleString() + "명" : ""}
                ${school.established ? " · " + school.established + "년 개교" : ""}
              </div>
              ${noteHtml}
            </div>`,
            { closeButton: false, className: "custom-popup" }
          );

          layer.addLayer(marker);
        });

        if (!map.hasLayer(layer)) layer.addTo(map);
      } else {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      }
    });
  }, [showSchools, selectedDistrict]);

  // 지하철역 마커
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const layer = stationLayerRef.current;
    layer.clearLayers();

    const stations = selectedDistrict
      ? STATION_DATA.filter((s) => s.district === selectedDistrict)
      : STATION_DATA;

    stations.forEach((station) => {
      const color = LINE_COLORS[station.line] || "#6b7280";
      const lineLabel = /^\d$/.test(station.line) ? station.line : station.line[0];

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          transform:translate(-50%,-50%);
          display:flex;align-items:center;gap:3px;
          cursor:pointer;white-space:nowrap;
        ">
          <div style="
            width:20px;height:20px;
            background:${color};
            border:2px solid #ffffff;
            border-radius:4px;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 1px 4px rgba(0,0,0,0.25);
            color:#fff;font-size:10px;font-weight:800;
            line-height:1;flex-shrink:0;
          ">${lineLabel}</div>
          <span style="
            font-size:10px;font-weight:700;color:#374151;
            text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;
          ">${station.name}</span>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([station.lat, station.lng], {
        icon,
        zIndexOffset: -200,
      });

      // 호선 배지 HTML
      const lineBadges = station.lines.map((l) => {
        const c = LINE_COLORS[l] || "#6b7280";
        const lbl = /^\d$/.test(l) ? l + "호선" : l + "선";
        return `<span style="display:inline-block;background:${c};color:#fff;font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;">${lbl}</span>`;
      }).join(" ");

      marker.bindPopup(
        `<div style="font-family:sans-serif;min-width:130px;">
          <div style="font-weight:700;font-size:13px;margin-bottom:5px;">${station.name}역</div>
          <div style="display:flex;gap:3px;flex-wrap:wrap;">${lineBadges}</div>
        </div>`,
        { closeButton: false, className: "custom-popup" }
      );

      layer.addLayer(marker);
    });

    if (!map.hasLayer(layer)) layer.addTo(map);
  }, [selectedDistrict]);

  // 구 선택 시 지도 이동
  useEffect(() => {
    if (!mapRef.current || !selectedDistrict) return;
    const center = DISTRICT_CENTER[selectedDistrict];
    mapRef.current.flyTo([center.lat, center.lng], 14, { duration: 0.8 });
  }, [selectedDistrict]);

  function toggleSchool(type: SchoolType) {
    setShowSchools((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  const toggleButtons: { type: SchoolType; label: string; activeColor: string; activeBg: string }[] = [
    { type: "elementary", label: "초등학교", activeColor: "#854d0e", activeBg: "#fef9c3" },
    { type: "middle", label: "중학교", activeColor: "#065f46", activeBg: "#d1fae5" },
    { type: "high", label: "고등학교", activeColor: "#4c1d95", activeBg: "#ede9fe" },
  ];

  return (
    <>
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px 14px;
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>

      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{ height: 420 }}
      />

      {/* 범례 (학교 토글 켜져있을 때) */}
      {(showSchools.elementary || showSchools.middle || showSchools.high) && (
        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
          <span>범례:</span>
          {showSchools.elementary && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center text-[8px] font-black text-yellow-800">초</span>
              초등학교
            </span>
          )}
          {showSchools.middle && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-[8px] font-black text-emerald-800">중</span>
              중학교
            </span>
          )}
          {showSchools.high && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-violet-100 border-2 border-violet-400 flex items-center justify-center text-[8px] font-black text-violet-800">고</span>
              고등학교
            </span>
          )}
        </div>
      )}
    </>
  );
}
