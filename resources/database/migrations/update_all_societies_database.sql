-- ==============================================================================
-- IEEE SREC - ALL TECHNICAL SOCIETIES & STUDENT BRANCH COMPLETE DATABASE SCRIPT
-- ==============================================================================
-- Copy & Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- ─── 1. DDL: CREATE TABLES FOR ALL SOCIETIES & STUDENT BRANCH ────────────────

-- 1.1 CIS (Computational Intelligence Society)
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

-- 1.2 ComSoc (Communications Society)
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

-- 1.3 CS (Computer Society)
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

-- 1.4 CAS (Circuits and Systems Society)
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

-- 1.5 EMBS (Engineering in Medicine & Biology Society)
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

-- 1.6 IMS / IM (Instrumentation & Measurement Society)
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

-- 1.7 PELS (Power Electronics Society)
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

-- 1.8 WIE (Women in Engineering)
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

-- 1.9 SREC Student Branch (Main Student Branch)
CREATE TABLE IF NOT EXISTS public.srec_office_bearers (
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

CREATE TABLE IF NOT EXISTS public.srec_executive_members (
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

-- ─── 2. ENABLE ROW LEVEL SECURITY & POLICIES ─────────────────────────────────
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
            'wie_office_bearers', 'wie_executive_members',
            'srec_office_bearers', 'srec_executive_members'
        )
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public Read" ON public.%I;', tbl);
        EXECUTE format('CREATE POLICY "Public Read" ON public.%I FOR SELECT USING (true);', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Auth All" ON public.%I;', tbl);
        EXECUTE format('CREATE POLICY "Auth All" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
    END LOOP;
END $$;

-- ─── 3. STORAGE BUCKETS CONFIGURATION ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('office_bearers', 'office_bearers', true),
    ('society_members', 'society_members', true),
    ('leadership_portraits', 'leadership_portraits', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access Office Bearers" ON storage.objects;
    CREATE POLICY "Public Access Office Bearers" ON storage.objects
    FOR SELECT USING (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));

    DROP POLICY IF EXISTS "Public Upload Office Bearers" ON storage.objects;
    CREATE POLICY "Public Upload Office Bearers" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));

    DROP POLICY IF EXISTS "Public Update Office Bearers" ON storage.objects;
    CREATE POLICY "Public Update Office Bearers" ON storage.objects
    FOR UPDATE USING (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));

    DROP POLICY IF EXISTS "Public Delete Office Bearers" ON storage.objects;
    CREATE POLICY "Public Delete Office Bearers" ON storage.objects
    FOR DELETE USING (bucket_id IN ('office_bearers', 'society_members', 'leadership_portraits'));
END $$;

-- ─── 4. SEED DATA: OFFICIAL ROSTERS ──────────────────────────────────────────

-- 4.1 CIS
TRUNCATE TABLE public.cis_office_bearers, public.cis_executive_members RESTART IDENTITY;
INSERT INTO public.cis_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr. J. Anitha', 'IEEE CIS Coordinator', 'Prof/AI&DS', '2024-2026', 2026),
    ('K S Surya Narayanan', 'Chairperson', 'II EEE B', '2024-2026', 2026),
    ('S V Hemesh', 'Vice-Chairperson', 'II CSE A', '2024-2026', 2026),
    ('D Akshaya Dharun', 'Secretary', 'II CSE A', '2024-2026', 2026),
    ('A Dhivya Tharsana', 'Treasurer', 'II AI & DS', '2024-2026', 2026),
    ('S Mathusri', 'Joint Activity Coordinator', 'III M.Tech CSE', '2024-2026', 2026);

INSERT INTO public.cis_executive_members (name, role, department, academic_year, year) VALUES
    ('R Vishnu Kaarthik', 'Technical Lead', 'III EEE', '2024-2026', 2026),
    ('S Amirtha Varshini', 'Executive Member', 'III CSE A', '2024-2026', 2026),
    ('S Latisha', 'Creative Lead', 'III CSE B', '2024-2026', 2026),
    ('M Barath', 'Executive Member', 'II EEE A', '2024-2026', 2026),
    ('Bhargavan Balaji', 'Executive Member', 'II EEE A', '2024-2026', 2026),
    ('F Mohammed Aathif F', 'Executive Member', 'II EEE A', '2024-2026', 2026);

-- 4.2 ComSoc
TRUNCATE TABLE public.comsoc_office_bearers, public.comsoc_executive_members RESTART IDENTITY;
INSERT INTO public.comsoc_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr. S. Mary Praveena', 'IEEE ComSoc Coordinator', 'AsP/ECE', '2024-2026', 2026),
    ('R Vishnu Kaarthik', 'Chairperson', 'III EEE', '2024-2026', 2026),
    ('V Smrthikha', 'Vice-Chairperson', 'III BME', '2024-2026', 2026),
    ('K Muthtamil', 'Secretary', 'III ECE', '2024-2026', 2026),
    ('Nithin Annamalai R', 'Treasurer', 'II EEE B', '2024-2026', 2026),
    ('S Deepak', 'Joint Activity Coordinator', 'IV EEE', '2024-2026', 2026);

INSERT INTO public.comsoc_executive_members (name, role, department, academic_year, year) VALUES
    ('Sabarinathan R', 'Technical Lead', 'IV ECE C', '2024-2026', 2026),
    ('S Kaniska Sri', 'Executive Member', 'II EEE A', '2024-2026', 2026),
    ('D R Prithika', 'Executive Member', 'II EEE B', '2024-2026', 2026),
    ('M Kavisre', 'Executive Member', 'IV EEE', '2024-2026', 2026),
    ('V Nithiin', 'Executive Member', 'III EEE', '2024-2026', 2026);

-- 4.3 CS
TRUNCATE TABLE public.cs_office_bearers, public.cs_executive_members RESTART IDENTITY;
INSERT INTO public.cs_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr. M. Karpagam', 'IEEE CS Coordinator', 'Prof/ECE', '2024-2026', 2026),
    ('Sabarinathan R', 'Chairperson', 'IV ECE C', '2024-2026', 2026),
    ('S Amirtha Varshini', 'Vice-Chairperson', 'III CSE A', '2024-2026', 2026),
    ('S Latisha', 'Secretary', 'III CSE B', '2024-2026', 2026),
    ('K S Surya Narayanan', 'Web Designer', 'II EEE B', '2024-2026', 2026),
    ('S Mathusri', 'Treasurer', 'III M.Tech CSE', '2024-2026', 2026),
    ('D Jennifer Shobha', 'Joint Activity Coordinator', 'III Civil', '2024-2026', 2026);

INSERT INTO public.cs_executive_members (name, role, department, academic_year, year) VALUES
    ('D Akshaya Dharun', 'Technical Lead', 'II CSE A', '2024-2026', 2026),
    ('S V Hemesh', 'Joint Secretary', 'II CSE A', '2024-2026', 2026),
    ('R Srenithi', 'Executive Member', 'III M.Tech CSE', '2024-2026', 2026),
    ('A Dhivya Tharsana', 'Creative Lead', 'II AI & DS', '2024-2026', 2026),
    ('F Mohammed Aathif F', 'Executive Member', 'II EEE A', '2024-2026', 2026),
    ('Bhargavan Balaji', 'Executive Member', 'II EEE A', '2024-2026', 2026);

-- 4.4 CAS
TRUNCATE TABLE public.cas_office_bearers, public.cas_executive_members RESTART IDENTITY;
INSERT INTO public.cas_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr. P. Karuppuswamy', 'IEEE CAS Coordinator', 'Prof/ECE', '2024-2026', 2026),
    ('Sabarinathan R', 'Chairperson', 'IV ECE C', '2024-2026', 2026),
    ('K S Surya Narayanan', 'Vice-Chairperson', 'II EEE B', '2024-2026', 2026),
    ('R Vishnu Kaarthik', 'Secretary', 'III EEE', '2024-2026', 2026),
    ('S Kaniska Sri', 'Treasurer', 'II EEE A', '2024-2026', 2026),
    ('F Mohammed Aathif F', 'Joint Activity Coordinator', 'II EEE A', '2024-2026', 2026);

INSERT INTO public.cas_executive_members (name, role, department, academic_year, year) VALUES
    ('D Akshaya Dharun', 'Executive Member', 'II CSE A', '2024-2026', 2026),
    ('S V Hemesh', 'Executive Member', 'II CSE A', '2024-2026', 2026),
    ('S Latisha', 'Executive Member', 'III CSE B', '2024-2026', 2026),
    ('Dharshini', 'Executive Member', 'III IT A', '2024-2026', 2026),
    ('S Deepak', 'Executive Member', 'IV EEE', '2024-2026', 2026);

-- 4.5 EMBS
TRUNCATE TABLE public.embs_office_bearers, public.embs_executive_members RESTART IDENTITY;
INSERT INTO public.embs_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr. S. Allirani', 'IEEE EMBS Coordinator', 'Prof & HoD/EEE', '2024-2026', 2026),
    ('S Karishma', 'Chairperson', 'IV BME', '2024-2026', 2026),
    ('V Smrthikha', 'Vice-Chairperson', 'III BME', '2024-2026', 2026),
    ('D Jennifer Shobha', 'Secretary', 'III Civil', '2024-2026', 2026),
    ('M Kavisre', 'Treasurer', 'IV EEE', '2024-2026', 2026),
    ('S Amirtha Varshini', 'Joint Activity Coordinator', 'III CSE A', '2024-2026', 2026);

INSERT INTO public.embs_executive_members (name, role, department, academic_year, year) VALUES
    ('S Mathusri', 'Executive Member', 'III M.Tech CSE', '2024-2026', 2026),
    ('R Srenithi', 'Executive Member', 'III M.Tech CSE', '2024-2026', 2026),
    ('V Swetha', 'Executive Member', 'III EIE', '2024-2026', 2026),
    ('A Dhivya Tharsana', 'Creative Executive', 'II AI & DS', '2024-2026', 2026),
    ('S Kaniska Sri', 'Executive Member', 'II EEE A', '2024-2026', 2026);

-- 4.6 IMS / IM
TRUNCATE TABLE public.im_office_bearers, public.im_executive_members RESTART IDENTITY;
INSERT INTO public.im_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr. M. Sangeetha', 'IEEE IMS Coordinator', 'AsP/EIE', '2024-2026', 2026),
    ('V Swetha', 'Chairperson', 'III EIE', '2024-2026', 2026),
    ('Nithin Annamalai R', 'Vice-Chairperson', 'II EEE B', '2024-2026', 2026),
    ('D R Prithika', 'Secretary', 'II EEE B', '2024-2026', 2026),
    ('Bhargavan Balaji', 'Treasurer', 'II EEE A', '2024-2026', 2026),
    ('M Barath', 'Joint Activity Coordinator', 'II EEE A', '2024-2026', 2026);

INSERT INTO public.im_executive_members (name, role, department, academic_year, year) VALUES
    ('Pabitra Santra', 'Technical Lead', 'IV EEE', '2024-2026', 2026),
    ('Harini S', 'Executive Member', 'IV EEE', '2024-2026', 2026),
    ('Abirami K', 'Executive Member', 'IV EEE', '2024-2026', 2026),
    ('Naren K', 'Executive Member', 'III EEE', '2024-2026', 2026),
    ('V Nithiin', 'Executive Member', 'III EEE', '2024-2026', 2026);

-- 4.7 PELS (Power Electronics Society)
TRUNCATE TABLE public.pels_office_bearers, public.pels_executive_members RESTART IDENTITY;

INSERT INTO public.pels_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr.K.Balamurugan', 'Student Branch Counsellor', 'AsP/EEE', '2026-2027', 2026),
    ('Praveen Kumar', 'IEEE PELS Coordinator', 'AP(Sl.G)/EEE', '2026-2027', 2026),
    ('Pabitra Santra', 'Chairperson', 'III EEE', '2026-2027', 2026),
    ('Jeevith Pranav P', 'Vice-Chairperson', 'IV EEE', '2026-2027', 2026),
    ('Akshreeya T', 'Secretary', 'II EEE', '2026-2027', 2026),
    ('Gowri Priya vadana A', 'Activities Coordinator', 'II EEE', '2026-2027', 2026),
    ('Alexander Samuel R', 'Activities Coordinator', 'II EEE', '2026-2027', 2026),
    ('Vaibhavi M', 'Treasurer', 'II EEE', '2026-2027', 2026),
    ('Swathi P', 'Editor', 'II EEE', '2026-2027', 2026),
    ('Sabarinath V S B', 'Editor', 'II EEE', '2026-2027', 2026);

INSERT INTO public.pels_executive_members (name, role, department, academic_year, year) VALUES
    ('Divyadharshini N', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Kishore Kumar', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Hari saran M', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Ishani S', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Arya M S', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Kavipriya K', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Nikhil Balaji R', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Ranjith Kumar R', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Vishweshwaran G', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Dipendra Mahato', 'Executive Member', 'II EEE', '2026-2027', 2026),
    ('Janani A P', 'Executive Member', 'II EEE', '2026-2027', 2026);

-- 4.8 WIE (Women In Engineering Affinity Group)
TRUNCATE TABLE public.wie_office_bearers, public.wie_executive_members RESTART IDENTITY;

INSERT INTO public.wie_office_bearers (name, role, department, academic_year, year) VALUES
    ('Mrs.S.Jansi Rani', 'IEEE WIE Coordinator', 'AP (Sr.G)/IT', '2026-2027', 2026),
    ('G J Lithigaa', 'Chairperson', 'III IT A', '2026-2027', 2026),
    ('S Dhakshitha', 'Secretary', 'III CSE A', '2026-2027', 2026),
    ('S Karishma', 'Joint Secretary', 'IV EEE', '2026-2027', 2026),
    ('S Tejasvi', 'Joint Activity Coordinator', 'III BME', '2026-2027', 2026),
    ('S I Aravindh', 'Joint Activity Coordinator', 'II EEE A', '2026-2027', 2026),
    ('N Dharshana', 'Joint Activity Coordinator', 'III EIE', '2026-2027', 2026),
    ('R Tejashri', 'Treasurer', 'III BME', '2026-2027', 2026),
    ('J Sindhu', 'Social Media', 'III M.Tech CSE', '2026-2027', 2026),
    ('P S Allan', 'Social Media', 'III Civil', '2026-2027', 2026);

INSERT INTO public.wie_executive_members (name, role, department, academic_year, year) VALUES
    ('K Lahitha', 'Executive Member', 'III M.Tech CSE', '2026-2027', 2026),
    ('S Lavanya', 'Executive Member', 'III EIE', '2026-2027', 2026),
    ('K Muthtamil', 'Executive Member', 'II EEE A', '2026-2027', 2026),
    ('P Mahalakshmi', 'Executive Member', 'II AI & DS', '2026-2027', 2026),
    ('V Mahalakshmi', 'Executive Member', 'II AI & DS', '2026-2027', 2026),
    ('D Eklesia Blessie', 'Executive Member', 'II IT A', '2026-2027', 2026),
    ('S Poojaa Dharshini', 'Executive Member', 'II CSE B', '2026-2027', 2026),
    ('S Kaniska Sri', 'Executive Member', 'II EEE A', '2026-2027', 2026);

-- 4.9 SREC Student Branch
TRUNCATE TABLE public.srec_office_bearers, public.srec_executive_members RESTART IDENTITY;
INSERT INTO public.srec_office_bearers (name, role, department, academic_year, year) VALUES
    ('Dr.K.Balamurugan', 'Student Branch Counsellor', 'AsP/EEE', '2024-2026', 2026),
    ('S Darshan', 'Chairperson', 'IV EEE', '2024-2026', 2026),
    ('D Jennifer Shobha', 'Vice-Chairperson', 'III Civil', '2024-2026', 2026),
    ('R Vishnu Kaarthik', 'Secretary', 'III EEE', '2024-2026', 2026),
    ('D R Prithika', 'Treasurer', 'II EEE B', '2024-2026', 2026),
    ('S Deepak', 'Activities Coordinator', 'IV EEE', '2024-2026', 2026),
    ('S Amirtha Varshini', 'Joint Activity Coordinator', 'III CSE A', '2024-2026', 2026),
    ('V Smrthikha', 'Joint Activity Coordinator', 'III BME', '2024-2026', 2026),
    ('K S Surya Narayanan', 'Web Designer', 'II EEE B', '2024-2026', 2026),
    ('Nithin Annamalai R', 'Editor', 'II EEE B', '2024-2026', 2026),
    ('S Latisha', 'Editor', 'III CSE B', '2024-2026', 2026),
    ('Dharshini', 'Editor', 'III IT A', '2024-2026', 2026);

INSERT INTO public.srec_executive_members (name, role, department, academic_year, year) VALUES
    ('S Mathusri', 'Executive Lead', 'III M.Tech CSE', '2024-2026', 2026),
    ('D Akshaya Dharun', 'Technical Executive', 'II CSE A', '2024-2026', 2026),
    ('A Dhivya Tharsana', 'Creative Executive', 'II AI & DS', '2024-2026', 2026),
    ('S V Hemesh', 'Operations Executive', 'II CSE A', '2024-2026', 2026),
    ('M Barath', 'Events Executive', 'II EEE A', '2024-2026', 2026),
    ('F Mohammed Aathif F', 'Social Media Executive', 'II EEE A', '2024-2026', 2026),
    ('Bhargavan Balaji', 'Executive Member', 'II EEE A', '2024-2026', 2026),
    ('R Srenithi', 'Executive Member', 'III M.Tech CSE', '2024-2026', 2026),
    ('V Swetha', 'Executive Member', 'III EIE', '2024-2026', 2026);
