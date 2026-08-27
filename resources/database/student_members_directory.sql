-- ==============================================================================
-- IEEE SREC Student Branch (Code 64581)
-- Student Members Directory & Membership Verification Database Schema
-- Run this SQL in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Create `student_members` table
CREATE TABLE IF NOT EXISTS student_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ieee_id TEXT NOT NULL UNIQUE,
    roll_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    member_type TEXT NOT NULL DEFAULT 'Student Member',
    join_date TEXT DEFAULT 'August 2024',
    valid_thru TEXT DEFAULT 'DEC 2026',
    membership_status TEXT NOT NULL DEFAULT 'ACTIVE',
    target_societies TEXT[] NOT NULL DEFAULT '{"IEEE Student Branch SREC"}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    bio_sop TEXT,
    avatar_url TEXT,
    security_pin TEXT DEFAULT '1234',
    awards_count INT DEFAULT 0,
    events_count INT DEFAULT 0
);

-- 2. Indexes for high-speed queries on mobile app search
CREATE INDEX IF NOT EXISTS idx_student_members_ieee_id ON student_members (ieee_id);
CREATE INDEX IF NOT EXISTS idx_student_members_roll ON student_members (roll_number);
CREATE INDEX IF NOT EXISTS idx_student_members_email ON student_members (email);
CREATE INDEX IF NOT EXISTS idx_student_members_dept ON student_members (department);
CREATE INDEX IF NOT EXISTS idx_student_members_status ON student_members (membership_status);

-- 3. Row Level Security (RLS)
ALTER TABLE student_members ENABLE ROW LEVEL SECURITY;

-- Allow public read so mobile app users can view member directory and verify digital ID cards
CREATE POLICY "Allow public read student_members" 
    ON student_members 
    FOR SELECT 
    USING (true);

-- Allow public insert (for registration workflows)
CREATE POLICY "Allow public insert student_members" 
    ON student_members 
    FOR INSERT 
    WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update student_members" 
    ON student_members 
    FOR UPDATE 
    USING (true);

-- Allow public delete
CREATE POLICY "Allow public delete student_members" 
    ON student_members 
    FOR DELETE 
    USING (true);

-- ==============================================================================
-- 4. Sample Verified Student Members Directory Dataset
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
    security_pin,
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
    'August 2022',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Student Branch SREC', 'IEEE Power Electronics Society (PELS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Power Systems', 'Embedded Systems', 'Technical Leadership', 'Project Management', 'IoT Solutions'],
    'Active IEEE SB leader committed to advancing power technology and inspiring engineering students across Madras Section.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    '1234',
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
    'September 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Computer Society (CS)', 'IEEE Computational Intelligence Society (CIS)'],
    ARRAY['Machine Learning', 'Full-Stack Development', 'Cloud Architecture', 'Python', 'Data Structures'],
    'Passionate CS researcher focusing on applied artificial intelligence, open-source algorithms, and scalable web apps.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    '1234',
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
    'October 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Engineering in Medicine & Biology Society (EMBS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Biosensors', 'Medical Image Processing', 'Healthcare AI', 'MATLAB', 'Event Organizing'],
    'Fostering interdisciplinary research at the intersection of medicine and smart instrumentation systems.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    '1234',
    4,
    12
),
(
    '98661294',
    '22EC185',
    'Siddharth',
    'Venkatesh',
    'siddharth.22ec185@srec.ac.in',
    '+91 97890 12345',
    'Electronics & Communication Engineering',
    'IV Year (2022-2026)',
    'Vice Chair - ComSoc',
    'August 2022',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Communication Society (ComSoc)', 'IEEE Student Branch SREC'],
    ARRAY['5G Networks', 'Wireless Communications', 'Signal Processing', 'RF Engineering', 'Antenna Design'],
    'Researching high-frequency telecommunication protocols and next-generation wireless communications.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    '1234',
    2,
    11
),
(
    '98774512',
    '24IT092',
    'Deepika',
    'Sundar',
    'deepika.24it092@srec.ac.in',
    '+91 98940 54321',
    'Information Technology',
    'II Year (2024-2028)',
    'Executive Member',
    'August 2024',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Computer Society (CS)', 'IEEE Women in Engineering (WIE)'],
    ARRAY['Cybersecurity', 'Web Security', 'React.js', 'Ethical Hacking', 'UI/UX Design'],
    'Active student contributor exploring cloud security models and encouraging women in computing.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    '1234',
    1,
    7
),
(
    '98889321',
    '23AD055',
    'Manojkumar',
    'Ramesh',
    'manojkumar.23ad@srec.ac.in',
    '+91 96290 87654',
    'Artificial Intelligence & Data Science',
    'III Year (2023-2027)',
    'Technical Lead - CIS',
    'September 2023',
    'DEC 2026',
    'ACTIVE',
    ARRAY['IEEE Computational Intelligence Society (CIS)', 'IEEE Student Branch SREC'],
    ARRAY['Deep Learning', 'PyTorch', 'Computer Vision', 'Generative AI', 'TensorFlow'],
    'Exploring neural architectures, LLM fine-tuning, and AI-driven assistive systems.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    '1234',
    3,
    15
)
ON CONFLICT (ieee_id) DO NOTHING;
