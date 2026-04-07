import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// URL이 유효하지 않으면 더미 클라이언트 생성 방지 (빌드 시)
export const supabase: SupabaseClient =
  supabaseUrl.startsWith("http")
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as SupabaseClient);

export function isSupabaseReady(): boolean {
  return supabase !== null && supabaseUrl.startsWith("http");
}
