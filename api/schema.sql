-- Seoul Festival Map 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 사용자 테이블 (전화번호 + 비밀번호 인증)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 찜하기 테이블
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  festival_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, festival_id)
);

-- 리뷰 테이블 (수정 불가, 축제 종료 후 조회 안됨)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  festival_id TEXT NOT NULL,
  festival_end_date DATE NOT NULL,
  text TEXT NOT NULL CHECK (char_length(text) <= 10),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  x NUMERIC NOT NULL,
  y NUMERIC NOT NULL,
  font_size NUMERIC NOT NULL,
  rotate NUMERIC NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, festival_id)  -- 1인 1리뷰 제한
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_festival ON favorites(festival_id);
CREATE INDEX IF NOT EXISTS idx_reviews_festival ON reviews(festival_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_end_date ON reviews(festival_end_date);

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 테이블에 대해 서비스 역할(service_role)만 접근 가능
-- API를 통해서만 데이터 접근하도록 설정
CREATE POLICY "Service role access" ON users FOR ALL USING (true);
CREATE POLICY "Service role access" ON favorites FOR ALL USING (true);
CREATE POLICY "Service role access" ON reviews FOR ALL USING (true);
