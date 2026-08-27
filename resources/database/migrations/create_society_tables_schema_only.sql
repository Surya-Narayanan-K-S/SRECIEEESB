-- ==============================================================================
-- IEEE SREC - SOCIETIES DEDICATED TABLES DDL SCHEMA (NO SEED DATA)
-- ==============================================================================
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- ─── 1. IEEE CIS (Computational Intelligence Society) ───
CREATE TABLE IF NOT EXISTS public.cis_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cis_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. IEEE ComSoc (Communications Society) ───
CREATE TABLE IF NOT EXISTS public.comsoc_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comsoc_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. IEEE CS (Computer Society) ───
CREATE TABLE IF NOT EXISTS public.cs_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cs_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. IEEE CAS (Circuits and Systems Society) ───
CREATE TABLE IF NOT EXISTS public.cas_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cas_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. IEEE EMBS (Engineering in Medicine & Biology Society) ───
CREATE TABLE IF NOT EXISTS public.embs_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.embs_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. IEEE IMS / IM (Instrumentation & Measurement Society) ───
CREATE TABLE IF NOT EXISTS public.im_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.im_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. IEEE PELS (Power Electronics Society) ───
CREATE TABLE IF NOT EXISTS public.pels_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2026-2027',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pels_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2026-2027',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. IEEE WIE (Women in Engineering) ───
CREATE TABLE IF NOT EXISTS public.wie_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wie_executive_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2026',
    year INT DEFAULT 2026,
    image_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 2. ENABLE ROW LEVEL SECURITY & OPEN ACCESS POLICIES
-- ==============================================================================
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN (
            'cis_office_bearers', 'cis_executive_members',
            'comsoc_office_bearers', 'comsoc_executive_members',
            'cs_office_bearers', 'cs_executive_members',
            'cas_office_bearers', 'cas_executive_members',
            'embs_office_bearers', 'embs_executive_members',
            'im_office_bearers', 'im_executive_members',
            'pels_office_bearers', 'pels_executive_members',
            'wie_office_bearers', 'wie_executive_members'
        )
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public Read" ON public.%I;', tbl);
        EXECUTE format('CREATE POLICY "Public Read" ON public.%I FOR SELECT USING (true);', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Auth All" ON public.%I;', tbl);
        EXECUTE format('CREATE POLICY "Auth All" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- 3. STORAGE BUCKET CONFIGURATION & POLICIES (FOR PHOTOS & PORTRAITS)
-- ==============================================================================
-- 1. Create Public Storage Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('office_bearers', 'office_bearers', true),
    ('society_members', 'society_members', true),
    ('leadership_portraits', 'leadership_portraits', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policies for Public Image Access and Management
DO $$
BEGIN
    -- Public Read
    DROP POLICY IF EXISTS "Public Access Office Bearers" ON storage.objects;
    CREATE POLICY "Public Access Office Bearers" ON storage.objects
    FOR SELECT USING (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));

    -- Public Upload/Insert
    DROP POLICY IF EXISTS "Public Upload Office Bearers" ON storage.objects;
    CREATE POLICY "Public Upload Office Bearers" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));

    -- Public Update
    DROP POLICY IF EXISTS "Public Update Office Bearers" ON storage.objects;
    CREATE POLICY "Public Update Office Bearers" ON storage.objects
    FOR UPDATE USING (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));

    -- Public Delete
    DROP POLICY IF EXISTS "Public Delete Office Bearers" ON storage.objects;
    CREATE POLICY "Public Delete Office Bearers" ON storage.objects
    FOR DELETE USING (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));
END $$;


