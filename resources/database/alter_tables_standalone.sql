-- ==============================================================================
-- IEEE SREC STUDENT BRANCH - STANDALONE ALTER TABLE & SCHEMA UPDATE SCRIPT
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project -> SQL Editor -> New Query -> Paste & Click Run.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADMINS TABLE (Security Clearance, Custom Roles & Avatars)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'Master Administrator',
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Alter columns if admins table already exists
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Master Administrator';
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read admins" ON public.admins;
CREATE POLICY "Allow public read admins" ON public.admins FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access admins" ON public.admins;
CREATE POLICY "Allow full access admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- Insert Default Master Admin if not exists
INSERT INTO public.admins (username, password, role, display_name, avatar_url)
VALUES (
    'admin',
    'MRBB2026',
    'Master Administrator',
    'Admin Manager',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
)
ON CONFLICT (username) DO UPDATE
SET role = EXCLUDED.role,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;


-- ------------------------------------------------------------------------------
-- 2. STUDENT MEMBERS TABLE (Roster, PDF Cards, Target Societies & Avatars)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_members (
    id BIGSERIAL PRIMARY KEY,
    roll_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    ieee_id TEXT DEFAULT 'PENDING',
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    gender TEXT,
    tshirt_size TEXT DEFAULT 'L',
    applicant_type TEXT DEFAULT 'undergraduate',
    membership_status TEXT DEFAULT 'ACTIVE',
    security_pin TEXT DEFAULT '1234',
    phone TEXT,
    card_pdf_url TEXT,
    avatar_url TEXT,
    bio_sop TEXT,
    target_societies TEXT[] DEFAULT ARRAY['IEEE Student Branch SREC']::TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Alter columns for existing student_members table
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS ieee_id TEXT DEFAULT 'PENDING';
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS card_pdf_url TEXT;
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS bio_sop TEXT;
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT '1234';
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS target_societies TEXT[] DEFAULT ARRAY['IEEE Student Branch SREC']::TEXT[];
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS applicant_type TEXT DEFAULT 'undergraduate';
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS tshirt_size TEXT DEFAULT 'L';
ALTER TABLE public.student_members ADD COLUMN IF NOT EXISTS gender TEXT;

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.student_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read student_members" ON public.student_members;
CREATE POLICY "Allow public read student_members" ON public.student_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access student_members" ON public.student_members;
CREATE POLICY "Allow full access student_members" ON public.student_members FOR ALL USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 3. APPLICATIONS TABLE (Join Submissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL,
    year_of_study TEXT,
    roll_number TEXT,
    target_society TEXT,
    target_societies TEXT[],
    statement_of_purpose TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Alter columns for existing applications table
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS year_of_study TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS target_society TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS target_societies TEXT[];
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS statement_of_purpose TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read applications" ON public.applications;
CREATE POLICY "Allow public read applications" ON public.applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access applications" ON public.applications;
CREATE POLICY "Allow full access applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 4. PAGE CONTENT TABLE (CMS System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_content (
    id BIGSERIAL PRIMARY KEY,
    page_key TEXT NOT NULL,
    content_key TEXT NOT NULL,
    content_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT page_content_unique_key UNIQUE (page_key, content_key)
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read page_content" ON public.page_content;
CREATE POLICY "Allow public read page_content" ON public.page_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access page_content" ON public.page_content;
CREATE POLICY "Allow full access page_content" ON public.page_content FOR ALL USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 5. FUNDING SUBMISSIONS & ANNUAL PLANS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.funding_submissions (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    submission_type TEXT NOT NULL,
    description TEXT,
    budget_amount NUMERIC,
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.funding_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read funding_submissions" ON public.funding_submissions;
CREATE POLICY "Allow public read funding_submissions" ON public.funding_submissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access funding_submissions" ON public.funding_submissions;
CREATE POLICY "Allow full access funding_submissions" ON public.funding_submissions FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.annual_plan (
    id BIGSERIAL PRIMARY KEY,
    s_no INT,
    event TEXT NOT NULL,
    sub_event TEXT,
    schedule TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.annual_plan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read annual_plan" ON public.annual_plan;
CREATE POLICY "Allow public read annual_plan" ON public.annual_plan FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access annual_plan" ON public.annual_plan;
CREATE POLICY "Allow full access annual_plan" ON public.annual_plan FOR ALL USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 6. AWARDS & SENIOR MEMBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.awards (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    year INT NOT NULL,
    description TEXT,
    category TEXT,
    amount TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read awards" ON public.awards;
CREATE POLICY "Allow public read awards" ON public.awards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access awards" ON public.awards;
CREATE POLICY "Allow full access awards" ON public.awards FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.senior_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    s_no INT,
    "current_role" TEXT,
    college TEXT,
    linkedin_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.senior_members ADD COLUMN IF NOT EXISTS "current_role" TEXT;
ALTER TABLE public.senior_members ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.senior_members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.senior_members ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.senior_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read senior_members" ON public.senior_members;
CREATE POLICY "Allow public read senior_members" ON public.senior_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access senior_members" ON public.senior_members;
CREATE POLICY "Allow full access senior_members" ON public.senior_members FOR ALL USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 7. EVENT REPORTS (Database Collection)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_reports (
    id BIGSERIAL PRIMARY KEY,
    event_name TEXT NOT NULL,
    society TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_type TEXT DEFAULT 'Technical Workshop',
    venue TEXT DEFAULT 'SREC Campus',
    participants_count INT DEFAULT 0,
    chief_guest TEXT,
    summary TEXT,
    key_takeaways TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    report_pdf_url TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.event_reports ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.event_reports ADD COLUMN IF NOT EXISTS report_pdf_url TEXT;
ALTER TABLE public.event_reports ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';

ALTER TABLE public.event_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read event_reports" ON public.event_reports;
CREATE POLICY "Allow public read event_reports" ON public.event_reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access event_reports" ON public.event_reports;
CREATE POLICY "Allow full access event_reports" ON public.event_reports FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- END OF ALTER TABLE SCRIPT
-- ==============================================================================
