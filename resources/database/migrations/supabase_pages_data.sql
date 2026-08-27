-- ==============================================================================
-- IEEE SREC - ALL GENERAL PAGES DATABASE SCRIPT (EXCLUDING SOCIETIES & OFFICE BEARERS)
-- ==============================================================================
-- Includes:
-- 1. Home / Landing Page Content
-- 2. About Us Page Content
-- 3. Contact Us Page Content
-- 4. Membership Registration Page Content
-- 5. Activities & Events Table & Content
-- 6. Annual Plans & Roadmap Table & Content
-- 7. Funding & Proposals Table & Content
-- 8. Awards & Honors Table & Content
-- 9. Senior Members & Mentors Table & Content
-- 10. Mobile App Page Content
-- 11. Student Database Roster Table & Data
-- ==============================================================================
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- ─── 1. CORE CMS TABLES ───
CREATE TABLE IF NOT EXISTS public.page_contents (
    id BIGSERIAL PRIMARY KEY,
    page_key TEXT NOT NULL,
    content_key TEXT NOT NULL UNIQUE,
    content_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_content (
    id BIGSERIAL PRIMARY KEY,
    page_key TEXT NOT NULL,
    content_key TEXT NOT NULL UNIQUE,
    content_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. ACTIVITIES & EVENTS TABLE ───
CREATE TABLE IF NOT EXISTS public.activities (
    id BIGSERIAL PRIMARY KEY,
    s_no INT,
    event TEXT NOT NULL,
    date DATE,
    chief_guest TEXT,
    participants TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. AWARDS & HONORS TABLE ───
CREATE TABLE IF NOT EXISTS public.awards (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    year INT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'IEEE Madras Section',
    amount TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. ANNUAL PLANS & ROADMAP TABLE ───
CREATE TABLE IF NOT EXISTS public.annual_plans (
    id BIGSERIAL PRIMARY KEY,
    s_no INT,
    event TEXT NOT NULL,
    sub_event TEXT,
    schedule TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. SENIOR MEMBERS & FACULTY TABLE ───
CREATE TABLE IF NOT EXISTS public.senior_members (
    id BIGSERIAL PRIMARY KEY,
    s_no INT,
    name TEXT NOT NULL,
    current_role TEXT,
    college TEXT DEFAULT 'Sri Ramakrishna Engineering College',
    linkedin_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. FUNDING PROPOSALS & GRANTS TABLE ───
CREATE TABLE IF NOT EXISTS public.funding_submissions (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    submission_type TEXT NOT NULL,
    description TEXT,
    budget_amount NUMERIC,
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. STUDENT MEMBERS ROSTER TABLE ───
CREATE TABLE IF NOT EXISTS public.student_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    ieee_id TEXT DEFAULT 'PENDING',
    security_pin TEXT DEFAULT '1234',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    gender TEXT DEFAULT 'Male',
    tshirt_size TEXT DEFAULT 'L',
    department TEXT NOT NULL,
    year_of_study TEXT DEFAULT '1st Year',
    applicant_type TEXT DEFAULT 'undergraduate',
    membership_status TEXT DEFAULT 'ACTIVE',
    target_societies TEXT[] DEFAULT ARRAY['IEEE Student Branch SREC'],
    bio_sop TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN (
            'page_contents', 'page_content', 'activities', 'awards', 
            'annual_plans', 'senior_members', 'funding_submissions', 'student_members'
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
-- 9. INSERT ALL CONTENT FOR GENERAL PAGES
-- ==============================================================================

-- ─── A. HOME / LANDING PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('landing', 'hero_badge', 'IEEE Student Branch • SREC Branch Code 32041'),
('landing', 'hero_title', 'Advancing Technology for Humanity at Sri Ramakrishna Engineering College'),
('landing', 'hero_subtitle', 'Empowering 500+ student engineers through world-class technical symposia, global IEEE hackathons, research publications, and industry mentorship.'),
('landing', 'hero_cta_primary', 'Explore Societies'),
('landing', 'hero_cta_secondary', 'Join IEEE SREC'),
('landing', 'stat_members', '500+ Active Members'),
('landing', 'stat_events', '50+ Annual Events'),
('landing', 'stat_awards', '20+ Section Honors'),
('landing', 'stat_societies', '8 Technical Societies'),
('landing', 'about_section_badge', 'Who We Are'),
('landing', 'about_section_title', 'Pioneering Innovation Since 2001'),
('landing', 'about_section_desc', 'IEEE SREC Student Branch provides students with professional leadership, research collaboration, and world-class technical competitions under IEEE Madras Section.'),
('landing', 'mission_title', 'Our Mission'),
('landing', 'mission_text', 'To foster technological innovation and excellence for the benefit of humanity, nurturing students to become future-ready engineering leaders.'),
('landing', 'vision_title', 'Our Vision'),
('landing', 'vision_text', 'To be an internationally recognized student branch hub that sets benchmarks in technical excellence, social responsibility, and engineering leadership.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── B. ABOUT US PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('about', 'about_hero_badge', '23+ Years of Technical Excellence'),
('about', 'about_hero_title', 'About IEEE Student Branch SREC'),
('about', 'about_hero_subtitle', 'Established on June 11th, 2001 under IEEE Madras Section (Region 10), IEEE SB SREC is one of the premier and most active student branches in India.'),
('about', 'about_counselor_name', 'Dr. K. Balamurugan'),
('about', 'about_counselor_role', 'Associate Professor / EEE & Student Branch Counsellor'),
('about', 'about_counselor_message', 'IEEE at SREC provides an unparalleled platform for students to transcend classroom boundaries, explore cutting-edge engineering domains, and build global networks that shape their careers.'),
('about', 'about_pillar_1_title', 'Technical Excellence'),
('about', 'about_pillar_1_desc', 'Organizing flagship international workshops, hackathons, and symposiums on AI, Power Electronics, VLSI, and IoT.'),
('about', 'about_pillar_2_title', 'Leadership Development'),
('about', 'about_pillar_2_desc', 'Giving complete student autonomy to manage multi-tiered teams, budgeting, marketing, and institutional outreach.'),
('about', 'about_pillar_3_title', 'Global Collaboration'),
('about', 'about_pillar_3_desc', 'Connecting directly with IEEE Headquarters New York, IEEE Madras Section, and international conferences.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── C. CONTACT US PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('contact', 'contact_hero_badge', 'Get in Touch'),
('contact', 'contact_hero_title', 'Contact IEEE SREC Student Branch'),
('contact', 'contact_hero_subtitle', 'Have questions about chapter memberships, symposiums, sponsorship, or technical collaborations? Reach out to us anytime.'),
('contact', 'contact_email', 'ieee@srec.ac.in'),
('contact', 'contact_phone', '+91 422 2460088 / +91 422 2461588'),
('contact', 'contact_address', 'IEEE Student Branch Room, Department of EEE, Sri Ramakrishna Engineering College, Vattamalaipalayam, NGGO Colony Post, Coimbatore - 641022, Tamil Nadu, India'),
('contact', 'contact_linkedin', 'https://www.linkedin.com/company/ieeesrec/'),
('contact', 'contact_instagram', 'https://www.instagram.com/srec_ieee/'),
('contact', 'contact_youtube', 'https://www.youtube.com/@srecieee'),
('contact', 'contact_office_hours', 'Monday - Friday: 9:00 AM - 5:00 PM IST')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── D. MEMBERSHIP REGISTRATION PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('membership', 'membership_badge', 'Annual IEEE Registration Portal'),
('membership', 'membership_title', 'IEEE SREC Student Membership Registration'),
('membership', 'membership_subtitle', 'Unlock IEEE digital libraries, discounted event passes, exclusive society grants, and resume-boosting credentials.'),
('membership', 'membership_fee_note', 'Annual IEEE Student Membership + Chosen Chapter Affiliations'),
('membership', 'membership_support_contact', 'Need help? Contact IEEE Secretary Vishnu Kaarthik / Treasurer Prithika at ieee@srec.ac.in')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── E. ACTIVITIES / EVENTS PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('activities', 'activities_hero_badge', 'Events & Initiatives'),
('activities', 'activities_hero_title', 'Flagship Activities & Technical Symposia'),
('activities', 'activities_hero_subtitle', 'Browse the timeline of hackathons, international workshops, paper presentations, and outreach programs conducted by IEEE SREC.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── F. AWARDS & ACHIEVEMENTS PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('awards', 'awards_hero_badge', 'Excellence Recognized'),
('awards', 'awards_hero_title', 'Honors & Global Recognition'),
('awards', 'awards_hero_subtitle', 'Celebrating awards from IEEE Headquarters USA, IEEE Region 10, and IEEE Madras Section for exemplary student branch performance.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── G. ANNUAL PLANS PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('annual_plans', 'plans_hero_badge', 'Strategic Roadmap'),
('annual_plans', 'plans_hero_title', 'Annual Event Calendar & Operational Plans'),
('annual_plans', 'plans_hero_subtitle', 'Comprehensive event schedules, national symposium deadlines, and chapter milestones for the academic year.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── H. FUNDINGS & PROPOSALS PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('funding', 'funding_hero_badge', 'Grants & Sponsorships'),
('funding', 'funding_hero_title', 'Funding Submissions & Project Grants'),
('funding', 'funding_hero_subtitle', 'Access guidelines and submit proposals for IEEE Madras Section student project funding, travel grants, and event sponsorship.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── I. SENIOR MEMBERS PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('senior_members', 'senior_hero_badge', 'Distinguished Faculty'),
('senior_members', 'senior_hero_title', 'IEEE Senior Members & Mentors'),
('senior_members', 'senior_hero_subtitle', 'Meet the esteemed IEEE Senior Members, faculty researchers, and industry veterans guiding IEEE SREC.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- ─── J. MOBILE APP PAGE ───
INSERT INTO public.page_contents (page_key, content_key, content_text) VALUES
('mobile_app', 'mobile_hero_badge', 'Android & iOS Companion'),
('mobile_app', 'mobile_hero_title', 'Download the Official IEEE SREC Mobile App'),
('mobile_app', 'mobile_hero_subtitle', 'Stay updated with real-time event notifications, student ID access, membership status tracking, and offline schedules.')
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();

-- SYNC TO ALIAS TABLE `page_content`
INSERT INTO public.page_content (page_key, content_key, content_text)
SELECT page_key, content_key, content_text FROM public.page_contents
ON CONFLICT (content_key) DO UPDATE SET content_text = EXCLUDED.content_text, updated_at = NOW();


-- ==============================================================================
-- 10. INSERT REAL DATA INTO TABLES
-- ==============================================================================

-- ─── 1. REAL ACTIVITIES & EVENTS ───
INSERT INTO public.activities (s_no, event, date, chief_guest, participants) VALUES
(1, 'IEEE Student Branch Drive 2024 for Engineering Students', '2023-09-08', 'Dr. K. Balamurugan, AsP/EEE', '180 Students'),
(2, 'IEEE Student Branch Inauguration on Advancing Technology for Humanity', '2023-09-01', 'Dr. N. R. Alamelu, Principal SREC', '250 Students'),
(3, 'IEEE Day 2023 Global Photo Contest & Technical Trivia', '2023-10-03', 'Office Bearers IEEE SREC', '120 Participants'),
(4, 'IEEE Day Celebration 2023 - Technical Project Showcase', '2023-10-04', 'Faculty Advisors IEEE SB', '160 Students'),
(5, 'VISION X 2025 National Level Technical Symposium', '2025-08-29', 'Distinguished Industry Delegates & IEEE Madras Section', '350+ Participants'),
(6, 'IEEE Xtreme 19.0 - 24-Hour International Competitive Programming', '2025-10-18', 'IEEE Headquarters Virtual Proctors', '60 Teams (180 Students)')
ON CONFLICT DO NOTHING;

-- ─── 2. REAL AWARDS & HONORS ───
INSERT INTO public.awards (title, year, description, category, amount) VALUES
('Exemplary Student Branch Award', 2024, 'Awarded to IEEE SB SREC for outstanding leadership, high event count, and continuous professional engagement.', 'IEEE Madras Section', 'Memento & Citation'),
('Outstanding WIE Affinity Group Award', 2023, 'Recognizing IEEE WIE SREC for impactful STEM initiatives, technical mentoring, and leadership conferences.', 'IEEE Madras Section', 'Cash Award & Trophy'),
('Continuous Activity Reporting Rebate', 2024, 'Annual rebate grant from IEEE Headquarters New York for timely activity documentation and membership retention.', 'IEEE Region 10 (Asia-Pacific)', '$500 USD'),
('Section Outstanding Student Volunteer Award', 2023, 'Awarded to core student leaders for exemplary service towards IEEE Madras Section outreach programs.', 'IEEE Madras Section', 'Citation & Gold Medal')
ON CONFLICT DO NOTHING;

-- ─── 3. REAL ANNUAL PLANS ───
INSERT INTO public.annual_plans (s_no, event, sub_event, schedule) VALUES
(1, 'Annual IEEE Student Membership Induction', 'Campus-wide Awareness Drive & Hands-on Portals', 'July - August 2025'),
(2, 'VISION X 2025 Flagship Symposium', 'Paper Presentations, Project Expo, Codeathons, Hardware Hack', 'August 2025'),
(3, 'IEEE Day Celebrations 2025', 'Tech Quiz, Coding Challenges & Cultural Networking', 'October 2025'),
(4, 'IEEE Xtreme 19.0 Hackathon', 'Global 24-Hour Non-stop Competitive Programming', 'October 2025'),
(5, 'WIE STAR Outreach Initiative', 'STEM Workshop & Science Kit Distribution for High School Girls', 'November 2025'),
(6, 'Industrial Substation Field Visit', 'High Voltage Grid & Power Converter Training', 'January 2026')
ON CONFLICT DO NOTHING;

-- ─── 4. REAL SENIOR MEMBERS ───
INSERT INTO public.senior_members (s_no, name, current_role, college, image_url) VALUES
(1, 'Dr. K. Balamurugan', 'Associate Professor / EEE & Student Branch Counsellor (Senior Member IEEE)', 'Sri Ramakrishna Engineering College', 'https://srec.ac.in/uploads/Faculty/imresizer4drkbalamurugan260715124354.jpg'),
(2, 'Dr. N. Devarajan', 'Professor / EEE (Senior Member IEEE)', 'Sri Ramakrishna Engineering College', NULL),
(3, 'Mrs. S. Jansi Rani', 'Assistant Professor (Sr.G) / IT & WIE Coordinator (Member IEEE)', 'Sri Ramakrishna Engineering College', NULL),
(4, 'Dr. K. Srinivasan', 'Professor / EIE (Senior Member IEEE)', 'Sri Ramakrishna Engineering College', NULL)
ON CONFLICT DO NOTHING;

-- ─── 5. REAL STUDENT MEMBERS DATABASE ROSTER ───
INSERT INTO public.student_members (roll_number, email, ieee_id, first_name, last_name, gender, tshirt_size, department, year_of_study, target_societies) VALUES
('71812503113', 'ranjithkumar.2403113@srec.ac.in', '102654094', 'RANJITHKUMAR', 'R', 'Male', 'XXL', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)']),
('71812403105', 'pabitrasantra.2403105@srec.ac.in', 'PENDING', 'Pabitra', 'Santra', 'Male', 'L', 'EEE', '3rd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)', 'IEEE Power Electronics Society (PELS)']),
('71812406029', 'lavanya.2406029@srec.ac.in', 'PENDING', 'Lavanya', 'S', 'Female', 'S', 'Other', '3rd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)']),
('71812503008', 'arya.2503008@srec.ac.in', 'PENDING', 'Arya', 'M S', 'Female', 'M', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)', 'IEEE Power Electronics Society (PELS)']),
('71812503024', 'ishani.2503024@srec.ac.in', '102654138', 'Ishani', 'S', 'Female', 'M', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)', 'IEEE Power Electronics Society (PELS)']),
('71812503030', 'kavipriya.2503030@srec.ac.in', '102657478', 'Kavipriya', 'K', 'Female', 'L', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)', 'IEEE Power Electronics Society (PELS)']),
('71812503138', 'vaibhavi.2503138@srec.ac.in', '102876325', 'Vaibhavi', 'Manoharan', 'Female', 'M', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)', 'IEEE Circuits and Systems Society (CAS)', 'IEEE Power Electronics Society (PELS)']),
('71812406057', 'swetha.2406057@srec.ac.in', 'PENDING', 'Swetha', 'V', 'Female', 'S', 'Other', '3rd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)']),
('71812503104', 'nithinannamalai.2503104@srec.ac.in', 'PENDING', 'Nithin Annamalai', 'R', 'Male', 'L', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)']),
('71812503133', 'swathi.2503133@srec.ac.in', '102875943', 'Swathi', 'P', 'Female', 'L', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Women in Engineering (WIE)', 'IEEE Circuits and Systems Society (CAS)', 'IEEE Power Electronics Society (PELS)']),
('71812503132', 'suryanarayanan.2503132@srec.ac.in', '102875940', 'K S Surya', 'Narayanan', 'Male', 'L', 'EEE', '2nd Year', ARRAY['IEEE Student Branch SREC', 'IEEE Computer Society (CS)', 'IEEE Circuits and Systems Society (CAS)'])
ON CONFLICT (roll_number) DO UPDATE 
SET ieee_id = EXCLUDED.ieee_id, target_societies = EXCLUDED.target_societies;
