-- ==============================================================================
-- IEEE SREC Student Branch - Student Members & Membership Portal Table Setup
-- Run this SQL in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Create `student_members` table
CREATE TABLE IF NOT EXISTS student_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ieee_id TEXT DEFAULT 'PENDING',
    roll_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    gender TEXT,
    tshirt_size TEXT DEFAULT 'L',
    designation TEXT DEFAULT 'Student Member',
    applicant_type TEXT DEFAULT 'undergraduate',
    membership_type TEXT DEFAULT 'new',
    member_type TEXT NOT NULL DEFAULT 'Student Member',
    join_date TEXT DEFAULT 'August 2025',
    valid_thru TEXT DEFAULT 'DEC 2026',
    membership_status TEXT NOT NULL DEFAULT 'ACTIVE',
    target_societies TEXT[] NOT NULL DEFAULT '{"IEEE Student Branch SREC"}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    bio_sop TEXT,
    payment_mode TEXT DEFAULT 'upi',
    transaction_ref TEXT,
    avatar_url TEXT,
    card_pdf_url TEXT,
    security_pin TEXT DEFAULT '1234',
    password TEXT DEFAULT 'srecieee@1234',
    awards_count INT DEFAULT 0,
    events_count INT DEFAULT 0
);

-- Migration helpers if table already exists
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS card_pdf_url TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS password TEXT DEFAULT 'srecieee@1234';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT '1234';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS tshirt_size TEXT DEFAULT 'L';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Student Member';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS applicant_type TEXT DEFAULT 'undergraduate';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'new';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS payment_mode TEXT DEFAULT 'upi';
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS transaction_ref TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS awards_count INT DEFAULT 0;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS events_count INT DEFAULT 0;
ALTER TABLE student_members ADD COLUMN IF NOT EXISTS target_societies TEXT[] DEFAULT '{"IEEE Student Branch SREC"}';

-- 2. Create index for fast login lookup
CREATE INDEX IF NOT EXISTS idx_student_members_ieee_id ON student_members (ieee_id);
CREATE INDEX IF NOT EXISTS idx_student_members_roll ON student_members (roll_number);
CREATE INDEX IF NOT EXISTS idx_student_members_email ON student_members (email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE student_members ENABLE ROW LEVEL SECURITY;

-- Allow public read so students can look up their digital ID card credentials
CREATE POLICY "Allow public read student_members" 
    ON student_members 
    FOR SELECT 
    USING (true);

-- Allow public insert (for registration workflows)
CREATE POLICY "Allow public insert student_members" 
    ON student_members 
    FOR INSERT 
    WITH CHECK (true);

-- Allow public update (or restrict to admin)
CREATE POLICY "Allow public update student_members" 
    ON student_members 
    FOR UPDATE 
    USING (true);

-- Allow public delete (or restrict to admin)
CREATE POLICY "Allow public delete student_members" 
    ON student_members 
    FOR DELETE 
    USING (true);

-- ==============================================================================
-- 4. Insert Verified Sample Student Members
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
    member_type,
    join_date,
    valid_thru,
    membership_status,
    target_societies,
    skills,
    bio_sop,
    avatar_url,
    security_pin
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
    'August 2022',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Student Branch SREC', 'IEEE Power Electronics Society (PELS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Power Systems', 'Embedded Systems', 'Technical Leadership', 'Project Management', 'IoT Solutions'],
    'Active IEEE SB leader committed to advancing power technology and inspiring engineering students across Madras Section.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    '1234'
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
    'September 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Computer Society (CS)', 'IEEE Computational Intelligence Society (CIS)'],
    ARRAY['Machine Learning', 'Full-Stack Development', 'Cloud Architecture', 'Python', 'Data Structures'],
    'Passionate CS researcher focusing on applied artificial intelligence, open-source algorithms, and scalable web apps.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    '1234'
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
    'October 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Engineering in Medicine & Biology Society (EMBS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Biosensors', 'Medical Image Processing', 'Healthcare AI', 'MATLAB', 'Event Organizing'],
    'Fostering interdisciplinary research at the intersection of medicine and smart instrumentation systems.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    '1234'
)
ON CONFLICT (ieee_id) DO NOTHING;
