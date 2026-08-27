-- ========================================================
-- SUPABASE SQL SCRIPT: SOCIETIES TABLE & SEED DATA
-- IEEE Student Branch - Sri Ramakrishna Engineering College
-- ========================================================

-- 1. Create the `societies` table
CREATE TABLE IF NOT EXISTS societies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    short_code TEXT,
    description TEXT,
    established_year INT DEFAULT 2001,
    member_count INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow public SELECT (read-only for anonymous & authenticated users)
CREATE POLICY "Allow public read societies" 
    ON societies 
    FOR SELECT 
    USING (true);

-- Allow public INSERT (for admin dashboard operations)
CREATE POLICY "Allow public insert societies" 
    ON societies 
    FOR INSERT 
    WITH CHECK (true);

-- Allow public UPDATE (for admin dashboard operations)
CREATE POLICY "Allow public update societies" 
    ON societies 
    FOR UPDATE 
    USING (true);

-- Allow public DELETE (for admin dashboard operations)
CREATE POLICY "Allow public delete societies" 
    ON societies 
    FOR DELETE 
    USING (true);

-- 4. Seed Data for IEEE Societies at SREC
INSERT INTO societies (name, short_code, description, established_year, member_count) VALUES
('IEEE Student Branch SREC', 'SREC', 'The central student branch uniting all engineering disciplines, driving flagship technical events, leadership workshops, and IEEE global initiatives.', 2001, 150),
('IEEE Women in Engineering', 'WIE', 'Promoting women engineers and scientists, inspiring girls around the world to follow their academic interests in a career in engineering and science.', 2012, 120),
('IEEE Engineering in Medicine and Biology Society', 'EMBS', 'Integrating engineering with medicine and biology to advance health tech, medical imaging, neural engineering, and biosensing devices.', 2015, 85),
('IEEE Computer Society', 'CS', 'Dedicated to computer science and information technology, software architecture, artificial intelligence, cloud systems, and cybersecurity.', 2005, 140),
('IEEE Communications Society', 'ComSoc', 'Promoting technological innovation in telecommunications, 5G/6G wireless networks, signal processing, and IoT ecosystems.', 2010, 95),
('IEEE Power Electronics Society', 'PELS', 'Focusing on clean energy conversion, renewable power systems, electric vehicles, smart grid tech, and power semiconductor applications.', 2014, 110),
('IEEE Measurement & Instrumentation Society', 'IM', 'Advancing measurement science, precision sensors, automated testing, metrology, and industrial instrumentation systems.', 2016, 75),
('IEEE Computational Intelligence Society', 'CIS', 'Exploring neural networks, deep learning, fuzzy logic, evolutionary computation, and intelligent system design.', 2018, 90)
ON CONFLICT (name) DO UPDATE SET 
    short_code = EXCLUDED.short_code,
    description = EXCLUDED.description,
    established_year = EXCLUDED.established_year,
    member_count = EXCLUDED.member_count;
