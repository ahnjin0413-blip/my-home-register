"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase, isSupabaseReady } from "@/lib/supabase";
import type { User as SupaUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
}

export interface SignupData {
  name: string;
  birthDate: string;
  phone: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  birthDate?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>;
  changePassword: (current: string, next: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 전화번호 → 이메일 변환 (Supabase Auth는 이메일 기반)
function phoneToEmail(phone: string): string {
  return `${phone}@mhr.local`;
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    birthDate: data.birth_date,
    phone: data.phone,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 세션 복원
  useEffect(() => {
    if (!isSupabaseReady()) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signup(data: SignupData): Promise<{ success: boolean; error?: string }> {
    const email = phoneToEmail(data.phone);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: data.password,
    });

    if (authError) {
      if (authError.message.includes("rate limit")) {
        return { success: false, error: "잠시 후 다시 시도해주세요 (요청 한도 초과)" };
      }
      if (authError.message.includes("already registered")) {
        return { success: false, error: "이미 가입된 휴대폰 번호입니다" };
      }
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "회원가입에 실패했습니다" };
    }

    // Supabase는 Confirm email OFF 시 기존 유저를 에러 없이 반환함
    // identities가 비어있으면 이미 존재하는 유저
    if (
      authData.user.identities &&
      authData.user.identities.length === 0
    ) {
      return { success: false, error: "이미 가입된 휴대폰 번호입니다" };
    }

    // 프로필 생성
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name: data.name,
      birth_date: data.birthDate,
      phone: data.phone,
    });

    if (profileError) {
      return { success: false, error: "프로필 생성에 실패했습니다: " + profileError.message };
    }

    setUser({
      id: authData.user.id,
      name: data.name,
      birthDate: data.birthDate,
      phone: data.phone,
    });

    return { success: true };
  }

  async function login(
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    const email = phoneToEmail(phone);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login") || error.message.includes("invalid_credentials")) {
        return { success: false, error: "번호 또는 비밀번호가 일치하지 않습니다" };
      }
      if (error.message.includes("Email not confirmed")) {
        return { success: false, error: "이메일 인증이 필요합니다. 관리자에게 문의하세요" };
      }
      if (error.message.includes("rate limit")) {
        return { success: false, error: "잠시 후 다시 시도해주세요 (요청 한도 초과)" };
      }
      return { success: false, error: error.message };
    }

    if (authData.user) {
      const profile = await fetchProfile(authData.user.id);
      setUser(profile);
    }

    return { success: true };
  }

  async function updateProfile(
    data: UpdateProfileData
  ): Promise<{ success: boolean; error?: string }> {
    if (!user) return { success: false, error: "로그인이 필요합니다" };

    const updates: Record<string, unknown> = {};
    if (data.name) updates.name = data.name;
    if (data.birthDate) updates.birth_date = data.birthDate;
    if (data.phone) updates.phone = data.phone;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      if (error.message.includes("unique")) {
        return { success: false, error: "이미 사용 중인 휴대폰 번호입니다" };
      }
      return { success: false, error: error.message };
    }

    setUser({
      ...user,
      name: data.name || user.name,
      birthDate: data.birthDate || user.birthDate,
      phone: data.phone || user.phone,
    });

    return { success: true };
  }

  async function changePassword(
    _current: string,
    next: string
  ): Promise<{ success: boolean; error?: string }> {
    if (next.length < 6) {
      return { success: false, error: "새 비밀번호는 6자 이상이어야 합니다" };
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, updateProfile, changePassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
