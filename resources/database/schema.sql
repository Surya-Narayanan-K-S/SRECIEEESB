-- ============================================
-- IEEE Student Branch SREC - Database Schema
-- Run this in Supabase SQL Editor FIRST
-- ============================================

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  sno INTEGER NOT NULL,
  event TEXT NOT NULL,
  event_date TEXT NOT NULL,
  chief_guest TEXT NOT NULL,
  participants TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Office Bearers table
CREATE TABLE IF NOT EXISTS office_bearers (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year TEXT DEFAULT '2025-2026',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Executive Members table
CREATE TABLE IF NOT EXISTS executive_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year TEXT DEFAULT '2025-2026',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advisors table
CREATE TABLE IF NOT EXISTS advisors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Societies table
CREATE TABLE IF NOT EXISTS societies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON activities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON office_bearers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON executive_members FOR SELECT USING (true);
CREATE POLICY "Public read access" ON advisors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON societies FOR SELECT USING (true);
