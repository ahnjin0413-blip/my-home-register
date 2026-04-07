"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase, isSupabaseReady } from "@/lib/supabase";
import type { ApartmentComplex } from "@/data/apartments";

export interface RegisteredProperty {
  complexId: string;
  complexName: string;
  district: string;
  address: string;
  dong: string;
  ho: string;
  registeredAt: string;
  totalUnits: number;
  builtYear: number;
  priceMin: number;
  priceMax: number;
  priceChange: number;
}

export interface AlertSettings {
  priceChange: boolean;
  regulation: boolean;
  redevelopment: boolean;
  marketTrend: boolean;
}

export interface FavoriteComplex {
  complexId: string;
  addedAt: string;
}

interface PropertyContextType {
  property: RegisteredProperty | null;
  alertSettings: AlertSettings;
  favorites: FavoriteComplex[];
  registerProperty: (complex: ApartmentComplex, dong: string, ho: string) => void;
  updateAlertSettings: (settings: AlertSettings) => void;
  toggleFavorite: (complexId: string) => void;
  isFavorite: (complexId: string) => boolean;
}

const PropertyContext = createContext<PropertyContextType | null>(null);

const DEFAULT_ALERTS: AlertSettings = {
  priceChange: true,
  regulation: true,
  redevelopment: true,
  marketTrend: false,
};

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [property, setProperty] = useState<RegisteredProperty | null>(null);
  const [alertSettings, setAlertSettings] =
    useState<AlertSettings>(DEFAULT_ALERTS);
  const [favorites, setFavorites] = useState<FavoriteComplex[]>([]);

  // 데이터 로드
  useEffect(() => {
    if (!user || !isSupabaseReady()) {
      setProperty(null);
      setAlertSettings(DEFAULT_ALERTS);
      setFavorites([]);
      return;
    }

    // 등록 아파트
    supabase
      .from("registered_properties")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProperty({
            complexId: data.complex_id,
            complexName: data.complex_name,
            district: data.district,
            address: data.address,
            dong: data.dong,
            ho: data.ho,
            registeredAt: data.registered_at,
            totalUnits: data.total_units,
            builtYear: data.built_year,
            priceMin: data.price_min,
            priceMax: data.price_max,
            priceChange: data.price_change,
          });
        }
      });

    // 관심 아파트
    supabase
      .from("favorites")
      .select("complex_id, added_at")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          setFavorites(
            data.map((f) => ({
              complexId: f.complex_id,
              addedAt: f.added_at,
            }))
          );
        }
      });

    // 알림 설정
    supabase
      .from("alert_settings")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setAlertSettings({
            priceChange: data.price_change,
            regulation: data.regulation,
            redevelopment: data.redevelopment,
            marketTrend: data.market_trend,
          });
        }
      });
  }, [user]);

  function registerProperty(
    complex: ApartmentComplex,
    dong: string,
    ho: string
  ) {
    if (!user) return;
    const prop: RegisteredProperty = {
      complexId: complex.id,
      complexName: complex.name,
      district: complex.district,
      address: complex.address,
      dong,
      ho,
      registeredAt: new Date().toISOString(),
      totalUnits: complex.totalUnits,
      builtYear: complex.builtYear,
      priceMin: complex.priceMin,
      priceMax: complex.priceMax,
      priceChange: complex.priceChange,
    };
    setProperty(prop);

    supabase.from("registered_properties").upsert({
      user_id: user.id,
      complex_id: complex.id,
      complex_name: complex.name,
      district: complex.district,
      address: complex.address,
      dong,
      ho,
      total_units: complex.totalUnits,
      built_year: complex.builtYear,
      price_min: complex.priceMin,
      price_max: complex.priceMax,
      price_change: complex.priceChange,
    });
  }

  function updateAlertSettings(settings: AlertSettings) {
    if (!user) return;
    setAlertSettings(settings);

    supabase.from("alert_settings").upsert({
      user_id: user.id,
      price_change: settings.priceChange,
      regulation: settings.regulation,
      redevelopment: settings.redevelopment,
      market_trend: settings.marketTrend,
      updated_at: new Date().toISOString(),
    });
  }

  const toggleFavorite = useCallback(
    (complexId: string) => {
      if (!user) return;
      setFavorites((prev) => {
        const exists = prev.some((f) => f.complexId === complexId);
        if (exists) {
          supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("complex_id", complexId)
            .then();
          return prev.filter((f) => f.complexId !== complexId);
        } else {
          supabase.from("favorites").insert({
            user_id: user.id,
            complex_id: complexId,
          });
          return [
            ...prev,
            { complexId, addedAt: new Date().toISOString() },
          ];
        }
      });
    },
    [user]
  );

  const isFavorite = useCallback(
    (complexId: string) => favorites.some((f) => f.complexId === complexId),
    [favorites]
  );

  return (
    <PropertyContext.Provider
      value={{
        property,
        alertSettings,
        favorites,
        registerProperty,
        updateAlertSettings,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperty must be used within PropertyProvider");
  }
  return context;
}
