-- ==============================================================================
-- IEEE SREC - HOME PAGE & MAIN GALLERY DATABASE TABLE SCRIPT
-- ==============================================================================
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- ─── 1. CREATE GALLERY ITEMS TABLE ───
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Student Activities',
    year INT NOT NULL DEFAULT 2024,
    date TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE ALIAS TABLE `home_gallery` FOR DIRECT HOME PAGE CONSUMPTION
CREATE TABLE IF NOT EXISTS public.home_gallery (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT DEFAULT 'Featured',
    image_url TEXT NOT NULL,
    year INT DEFAULT 2025,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. ENABLE ROW LEVEL SECURITY & PUBLIC POLICIES ───
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Gallery Items" ON public.gallery_items;
CREATE POLICY "Public Read Gallery Items" ON public.gallery_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth All Gallery Items" ON public.gallery_items;
CREATE POLICY "Auth All Gallery Items" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.home_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Home Gallery" ON public.home_gallery;
CREATE POLICY "Public Read Home Gallery" ON public.home_gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth All Home Gallery" ON public.home_gallery;
CREATE POLICY "Auth All Home Gallery" ON public.home_gallery FOR ALL USING (true) WITH CHECK (true);

-- ─── 3. STORAGE BUCKET CONFIGURATION (FOR UPLOADING GALLERY PHOTOS) ───
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Gallery Storage" ON storage.objects;
CREATE POLICY "Public Read Gallery Storage" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Auth Upload Gallery Storage" ON storage.objects;
CREATE POLICY "Auth Upload Gallery Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');


-- ==============================================================================
-- 4. INSERT REAL HOME PAGE & EVENT GALLERY ITEMS
-- ==============================================================================

-- ─── FULL GALLERY ITEMS ───
INSERT INTO public.gallery_items (title, category, year, date, description, image_url, featured, sort_order) VALUES
(
    'VISION X 2025 National Level Technical Symposium',
    'Competitions',
    2025,
    'August 29, 2025',
    'Grand group photo of 350+ delegates, faculty coordinators, and student leaders at the flagship Vision X symposium.',
    'VISION X GROUP PHOTO 29.08.2025-ENHANCED.png',
    true,
    1
),
(
    'IEEE Day 2023 Celebration',
    'IEEE Day',
    2023,
    'October 3, 2023',
    'Group photo of student members and officers celebrating annual IEEE Day with technical games and networking.',
    '1.IEEE Day 2023 Event group photo.jpg',
    true,
    2
),
(
    'IEEE SREC Student Branch Inauguration',
    'Student Activities',
    2023,
    'September 1, 2023',
    'Grand launch event with department heads, principal, and core student branch office bearers.',
    '3. IEEE Student Branch Inaguration on Advancing Technology for Humanity - group photo on 01.09.2023.jpg',
    true,
    3
),
(
    'IEEE Xtreme 19.0 Global 24-Hour Hackathon',
    'Hackathons',
    2025,
    'October 18, 2025',
    'Non-stop competitive programming teams solving complex algorithmic challenges at SREC campus.',
    'IEEE Xtreme 19.0.jpg',
    true,
    4
),
(
    'IEEE Student Branch Awareness Drive',
    'Student Activities',
    2024,
    'January 2024',
    'Orientation program welcoming second and third year engineering students into IEEE chapters.',
    'IEEE SB Drive Jan 2024.jpg',
    false,
    5
),
(
    'Soft Skills for Every Engineer Seminar',
    'Workshops',
    2023,
    'September 22, 2023',
    'Guest lecture and interactive training on leadership, presentation, and workplace communications.',
    '2.Soft Skills for Every Engineer seminar conducted on 22.09.2023.jpg',
    false,
    6
),
(
    'IEEE Region 10 Chapter Symposium Delegation',
    'Conferences',
    2023,
    'December 2023',
    'SREC IEEE student delegates representing Madras Section at Region 10 International Chapter Symposium.',
    '5.Attended IEEE Region 10 Section Chapter Symposium on Dec 2023.jpg',
    false,
    7
),
(
    'Hardware AI & VLSI Prototyping Showcase',
    'Technical Talks',
    2024,
    'March 2024',
    'Demonstration of custom embedded circuit prototypes, microcontroller firmware, and sensor integration.',
    'IMG_2494.JPG',
    false,
    8
),
(
    'National Coding Challenge Winners Ceremony',
    'Awards',
    2025,
    'December 2025',
    'Awarding top student teams for exemplary algorithmic performance in international contests.',
    'IMG20251212100452.jpg',
    false,
    9
),
(
    'IEEE Day Photography Contest Showcase',
    'Competitions',
    2023,
    'October 3, 2023',
    'Winning creative entries submitted by engineering students for the IEEE Day photo contest.',
    '1a.IEEE Day 2023 Photo Contest on 3rd October 2023.jpg',
    false,
    10
)
ON CONFLICT DO NOTHING;


-- ─── HOME PAGE FEATURED GALLERY HIGHLIGHTS ───
INSERT INTO public.home_gallery (title, subtitle, category, image_url, year, sort_order) VALUES
('Best Student Branch Award', 'IEEE Madras Section 2024', 'Awards', 'v24.jpg', 2024, 1),
('50+ Annual Technical Events', 'Conducted across 9 active chapters', 'Activities', 'IEEE SB Inaugural Function 24-25.jpg', 2024, 2),
('Winning Hackathon Teams', '12 national & global competition wins', 'Hackathons', 'IMG_2121.JPG', 2024, 3),
('500+ Active Student Volunteers', 'Building engineering leadership at SREC', 'Community', '3a.IEEE SB SREC Photo 1.JPG', 2024, 4),
('Distinguished Speaker Series', '20+ IEEE Fellows and industry experts hosted', 'Conferences', 'IMG_2243.JPG', 2024, 5),
('Executive Committee Leadership', 'The student leaders behind the initiatives', 'Leadership', 'IEEE SB Drive Jan 2024.jpg', 2024, 6)
ON CONFLICT DO NOTHING;
