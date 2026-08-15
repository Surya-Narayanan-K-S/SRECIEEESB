-- ==============================================================================
-- IEEE SREC Student Branch (Branch Code: 64581)
-- Membership Registration & Student Members Database Schema for Supabase
-- Run this script in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE `student_members` TABLE
-- Stores full member profile, login credentials, digital ID card data, and societies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS student_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Identification & Login Credentials
    roll_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    ieee_id TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT 'srecieee@1234',
    security_pin TEXT DEFAULT '1234',
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    gender TEXT,
    avatar_url TEXT,
    
    -- Academic & Membership Details
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    designation TEXT DEFAULT 'Student Member',
    applicant_type TEXT DEFAULT 'undergraduate',
    membership_type TEXT DEFAULT 'new',
    member_type TEXT NOT NULL DEFAULT 'Student Member',
    join_date TEXT DEFAULT 'August 2025',
    valid_thru TEXT DEFAULT 'DEC 2026',
    membership_status TEXT NOT NULL DEFAULT 'ACTIVE',
    
    -- Technical Affiliations & Activities
    target_societies TEXT[] NOT NULL DEFAULT '{"IEEE Student Branch SREC"}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    bio_sop TEXT,
    
    -- Payment & Receipt Tracking
    payment_mode TEXT DEFAULT 'upi',
    transaction_ref TEXT,
    
    -- App Engagement Counters
    awards_count INT DEFAULT 0,
    events_count INT DEFAULT 0
);

-- Safe migrations in case the table already exists
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS password TEXT DEFAULT 'srecieee@1234';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT '1234';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Student Member';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS applicant_type TEXT DEFAULT 'undergraduate';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'new';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS payment_mode TEXT DEFAULT 'upi';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS transaction_ref TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS awards_count INT DEFAULT 0;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS events_count INT DEFAULT 0;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS target_societies TEXT[] DEFAULT '{"IEEE Student Branch SREC"}';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- ==============================================================================
-- 3. CREATE `applications` TABLE (For Registration Submissions & Audit)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT,
    year_of_study TEXT,
    target_society TEXT,
    skills TEXT[],
    statement_of_purpose TEXT
);

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_student_members_roll ON student_members (roll_number);
CREATE INDEX IF NOT EXISTS idx_student_members_email ON student_members (email);
CREATE INDEX IF NOT EXISTS idx_student_members_ieee_id ON student_members (ieee_id);
CREATE INDEX IF NOT EXISTS idx_student_members_dept ON student_members (department);
CREATE INDEX IF NOT EXISTS idx_student_members_status ON student_members (membership_status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications (email);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE student_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if needed to prevent duplicate policy errors
DROP POLICY IF EXISTS "Allow public read student_members" ON student_members;
DROP POLICY IF EXISTS "Allow public insert student_members" ON student_members;
DROP POLICY IF EXISTS "Allow public update student_members" ON student_members;
DROP POLICY IF EXISTS "Allow public delete student_members" ON student_members;

DROP POLICY IF EXISTS "Allow public read applications" ON applications;
DROP POLICY IF EXISTS "Allow public insert applications" ON applications;
DROP POLICY IF EXISTS "Allow public update applications" ON applications;
DROP POLICY IF EXISTS "Allow public delete applications" ON applications;

-- Policies for `student_members` table
CREATE POLICY "Allow public read student_members" 
    ON student_members 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert student_members" 
    ON student_members 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update student_members" 
    ON student_members 
    FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete student_members" 
    ON student_members 
    FOR DELETE 
    USING (true);

-- Policies for `applications` table
CREATE POLICY "Allow public read applications" 
    ON applications 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert applications" 
    ON applications 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update applications" 
    ON applications 
    FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete applications" 
    ON applications 
    FOR DELETE 
    USING (true);

-- ==============================================================================
-- 6. VERIFIED INITIAL SEED MEMBERS (WITH DEFAULT PASSWORDS: srecieee@<rollnumber>)
-- ==============================================================================
INSERT INTO student_members (
    ieee_id,
    roll_number,
    first_name,
    last_name,
    email,
    phone,
    department,
    year_of_study,
    designation,
    member_type,
    password,
    security_pin,
    join_date,
    valid_thru,
    membership_status,
    target_societies,
    skills,
    bio_sop,
    avatar_url,
    awards_count,
    events_count
) VALUES 
(
    '98421045',
    '22EE104',
    'P.',
    'Joselyn',
    'joselyn.220104@srec.ac.in',
    '+91 94882 14502',
    'Electrical & Electronics Engineering',
    'IV Year (2022-2026)',
    'Student Branch Chairperson',
    'Student Branch Chairperson',
    'srecieee@22EE104',
    'srecieee@22EE104',
    'August 2022',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Student Branch SREC', 'IEEE Power Electronics Society (PELS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Power Systems', 'Embedded Systems', 'Technical Leadership', 'Project Management', 'IoT Solutions'],
    'Active IEEE SB leader committed to advancing power technology and inspiring engineering students across Madras Section.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    3,
    14
),
(
    '98319240',
    '23CS218',
    'Aravind',
    'Karthik',
    'aravind.karthik.23cs@srec.ac.in',
    '+91 98402 33419',
    'Computer Science & Engineering',
    'III Year (2023-2027)',
    'Student Member',
    'Student Member',
    'srecieee@23CS218',
    'srecieee@23CS218',
    'September 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Computer Society (CS)', 'IEEE Computational Intelligence Society (CIS)'],
    ARRAY['Machine Learning', 'Full-Stack Development', 'Cloud Architecture', 'Python', 'Data Structures'],
    'Passionate CS researcher focusing on applied artificial intelligence, open-source algorithms, and scalable web apps.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    2,
    9
),
(
    '98553108',
    '23BM042',
    'Anjanalakshmi',
    'S Prabhu',
    'anjanalakshmi.23bm@srec.ac.in',
    '+91 91234 56780',
    'Biomedical Engineering',
    'III Year (2023-2027)',
    'Activities Co-ordinator',
    'Activities Co-ordinator',
    'srecieee@23BM042',
    'srecieee@23BM042',
    'October 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Engineering in Medicine & Biology Society (EMBS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Biosensors', 'Medical Image Processing', 'Healthcare AI', 'MATLAB', 'Event Organizing'],
    'Fostering interdisciplinary research at the intersection of medicine and smart instrumentation systems.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    4,
    12
)
ON CONFLICT (roll_number) DO UPDATE SET
    password = EXCLUDED.password,
    security_pin = EXCLUDED.security_pin,
    email = EXCLUDED.email,
    target_societies = EXCLUDED.target_societies;

-- ==============================================================================
-- 7. STORAGE BUCKET FOR MEMBER AVATARS & ID PHOTOS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-avatars', 'member-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Member Avatars Read" ON storage.objects;
CREATE POLICY "Public Member Avatars Read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'member-avatars');

DROP POLICY IF EXISTS "Public Member Avatars Upload" ON storage.objects;
CREATE POLICY "Public Member Avatars Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'member-avatars');

DROP POLICY IF EXISTS "Public Member Avatars Update" ON storage.objects;
CREATE POLICY "Public Member Avatars Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'member-avatars');

DROP POLICY IF EXISTS "Public Member Avatars Delete" ON storage.objects;
CREATE POLICY "Public Member Avatars Delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'member-avatars');

