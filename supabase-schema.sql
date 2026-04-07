-- ============================================
-- Supabase SQL Editor에서 이 파일을 실행하세요
-- ============================================

-- 1. 사용자 프로필 (Supabase Auth와 연동)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  birth_date date not null,
  phone text not null unique,
  created_at timestamptz default now()
);

-- RLS 활성화
alter table profiles enable row level security;

-- 본인 프로필만 읽기/수정
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- 2. 등록 아파트
create table if not exists registered_properties (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  complex_id text not null,
  complex_name text not null,
  district text not null,
  address text not null,
  dong text not null,
  ho text not null,
  total_units integer,
  built_year integer,
  price_min numeric,
  price_max numeric,
  price_change numeric,
  registered_at timestamptz default now(),
  unique(user_id)
);

alter table registered_properties enable row level security;

create policy "Users can view own property"
  on registered_properties for select using (auth.uid() = user_id);
create policy "Users can insert own property"
  on registered_properties for insert with check (auth.uid() = user_id);
create policy "Users can update own property"
  on registered_properties for update using (auth.uid() = user_id);
create policy "Users can delete own property"
  on registered_properties for delete using (auth.uid() = user_id);

-- 3. 관심 아파트
create table if not exists favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  complex_id text not null,
  added_at timestamptz default now(),
  unique(user_id, complex_id)
);

alter table favorites enable row level security;

create policy "Users can view own favorites"
  on favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites"
  on favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites"
  on favorites for delete using (auth.uid() = user_id);

-- 4. 알림 설정
create table if not exists alert_settings (
  user_id uuid references auth.users on delete cascade primary key,
  price_change boolean default true,
  regulation boolean default true,
  redevelopment boolean default true,
  market_trend boolean default false,
  updated_at timestamptz default now()
);

alter table alert_settings enable row level security;

create policy "Users can view own alerts"
  on alert_settings for select using (auth.uid() = user_id);
create policy "Users can upsert own alerts"
  on alert_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own alerts"
  on alert_settings for update using (auth.uid() = user_id);
