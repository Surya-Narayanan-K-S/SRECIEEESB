-- ==============================================================================
-- IEEE SREC - COMPLETE RLS PERMISSIONS & CMS FIX SCRIPT FOR SUPABASE
-- Run this entire script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- This resolves all 403 / RLS errors and ensures all columns exist!
-- ==============================================================================

-- 1. Create and Fix page_content (CMS System)
CREATE TABLE IF NOT EXISTS public.page_content (
    id BIGSERIAL PRIMARY KEY,
    page_key TEXT NOT NULL,
    content_key TEXT NOT NULL,
    content_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT page_content_unique_key UNIQUE (page_key, content_key)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read page_content" ON public.page_content;
CREATE POLICY "Allow public read page_content" ON public.page_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access page_content" ON public.page_content;
CREATE POLICY "Allow full access page_content" ON public.page_content FOR ALL USING (true) WITH CHECK (true);

-- 2. Create and Fix admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read admins" ON public.admins;
CREATE POLICY "Allow public read admins" ON public.admins FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access admins" ON public.admins;
CREATE POLICY "Allow full access admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- 3. Create and Fix funding_submissions table
CREATE TABLE IF NOT EXISTS public.funding_submissions (
    id SERIAL PRIMARY KEY,
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

-- 4. Create and Fix senior_members table
CREATE TABLE IF NOT EXISTS public.senior_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    s_no INT,
    "current_role" TEXT,
    college TEXT,
    linkedin_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.senior_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read senior_members" ON public.senior_members;
CREATE POLICY "Allow public read senior_members" ON public.senior_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access senior_members" ON public.senior_members;
CREATE POLICY "Allow full access senior_members" ON public.senior_members FOR ALL USING (true) WITH CHECK (true);

-- 5. Policies for activities, member_counts, annual_plan, awards, events_gallery
CREATE TABLE IF NOT EXISTS public.activities (
    id BIGSERIAL PRIMARY KEY,
    year INT,
    s_no INT,
    sno INT,
    event TEXT,
    date TEXT,
    event_date TEXT,
    chief_guest TEXT,
    participants TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access activities" ON public.activities;
CREATE POLICY "Allow full access activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.member_counts (
    id BIGSERIAL PRIMARY KEY,
    year INT,
    professional_members INT DEFAULT 0,
    student_members INT DEFAULT 0,
    total_members INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.member_counts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access member_counts" ON public.member_counts;
CREATE POLICY "Allow full access member_counts" ON public.member_counts FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.annual_plan (
    id BIGSERIAL PRIMARY KEY,
    s_no INT,
    event TEXT,
    sub_event TEXT,
    schedule TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.annual_plan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access annual_plan" ON public.annual_plan;
CREATE POLICY "Allow full access annual_plan" ON public.annual_plan FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.awards (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    awardee TEXT,
    year TEXT,
    organization TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access awards" ON public.awards;
CREATE POLICY "Allow full access awards" ON public.awards FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.events_gallery (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    category TEXT,
    image_url TEXT NOT NULL,
    event_date TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.events_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access events_gallery" ON public.events_gallery;
CREATE POLICY "Allow full access events_gallery" ON public.events_gallery FOR ALL USING (true) WITH CHECK (true);

-- 6. Ensure ALL Office Bearers & Executive Member Tables and Columns Exist!
CREATE TABLE IF NOT EXISTS public.office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    year INT DEFAULT 2025,
    group_name TEXT DEFAULT 'IEEE SB',
    society_code TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT 'IEEE SB';
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS society_code TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS year INT DEFAULT 2025;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.office_bearers ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.office_bearers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access office_bearers" ON public.office_bearers;
CREATE POLICY "Allow full access office_bearers" ON public.office_bearers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    year INT DEFAULT 2025,
    group_name TEXT DEFAULT 'IEEE SB',
    society_code TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT 'IEEE SB';
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS society_code TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS year INT DEFAULT 2025;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.executive_members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.executive_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access executive_members" ON public.executive_members;
CREATE POLICY "Allow full access executive_members" ON public.executive_members FOR ALL USING (true) WITH CHECK (true);

-- 7. New Office Bearers & New Executive Members (Dual-Compat)
CREATE TABLE IF NOT EXISTS public.new_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    year INT DEFAULT 2025,
    group_name TEXT DEFAULT 'IEEE SB',
    society_code TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT 'IEEE SB';
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS society_code TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS year INT DEFAULT 2025;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.new_office_bearers ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.new_office_bearers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access new_office_bearers" ON public.new_office_bearers;
CREATE POLICY "Allow full access new_office_bearers" ON public.new_office_bearers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.new_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    year INT DEFAULT 2025,
    group_name TEXT DEFAULT 'IEEE SB',
    society_code TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT 'IEEE SB';
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS society_code TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS year INT DEFAULT 2025;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.new_executive_members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.new_executive_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access new_executive_members" ON public.new_executive_members;
CREATE POLICY "Allow full access new_executive_members" ON public.new_executive_members FOR ALL USING (true) WITH CHECK (true);

-- 8. Society Specific Tables (society_office_bearers and society_executive_members)
CREATE TABLE IF NOT EXISTS public.society_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    society_code TEXT NOT NULL,
    group_name TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS society_code TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.society_office_bearers ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.society_office_bearers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access society_office_bearers" ON public.society_office_bearers;
CREATE POLICY "Allow full access society_office_bearers" ON public.society_office_bearers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.society_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    society_code TEXT NOT NULL,
    group_name TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS society_code TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2025';
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.society_executive_members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.society_executive_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access society_executive_members" ON public.society_executive_members;
CREATE POLICY "Allow full access society_executive_members" ON public.society_executive_members FOR ALL USING (true) WITH CHECK (true);

-- 9. Storage Bucket Permissions for image uploads (office_bearers and member-avatars)
INSERT INTO storage.buckets (id, name, public)
VALUES ('office_bearers', 'office_bearers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('member-avatars', 'member-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public uploads office_bearers" ON storage.objects;
CREATE POLICY "Allow public uploads office_bearers" ON storage.objects FOR ALL USING (bucket_id IN ('office_bearers', 'member-avatars')) WITH CHECK (bucket_id IN ('office_bearers', 'member-avatars'));
