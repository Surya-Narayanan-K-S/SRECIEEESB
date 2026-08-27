-- ==============================================================================
-- IEEE SREC - DEDICATED EVENT & ACTIVITY REPORTS TABLE & STORAGE BUCKET SCRIPT
-- ==============================================================================

-- 1. Create dedicated event_reports table
CREATE TABLE IF NOT EXISTS public.event_reports (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    venue TEXT NOT NULL,
    organized_by TEXT NOT NULL DEFAULT 'IEEE Madras Section',
    academic_year TEXT DEFAULT '2025-2026',
    society_code TEXT DEFAULT 'IEEE SB',
    category TEXT DEFAULT 'Hub Congress', -- 'Hub Congress', 'Technical Event', 'Seminar', 'Conference', 'Student Branch Drive'
    photo_url TEXT, -- Primary / Featured Event Photograph
    photo_urls TEXT, -- Comma-separated or JSON array of 3 to 4 event photos
    certificate_urls TEXT, -- Appreciation Certificate photos
    event_overview TEXT, -- Full narrative overview
    key_highlights TEXT, -- Bullet points of highlights and learnings
    conclusion_text TEXT, -- Concluding remarks / summary
    status TEXT DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.event_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all reports
DROP POLICY IF EXISTS "Allow Public Read Event Reports" ON public.event_reports;
CREATE POLICY "Allow Public Read Event Reports" 
ON public.event_reports FOR SELECT USING (true);

-- Allow full access for inserts, updates, deletes
DROP POLICY IF EXISTS "Allow Full Access Event Reports" ON public.event_reports;
CREATE POLICY "Allow Full Access Event Reports" 
ON public.event_reports FOR ALL USING (true) WITH CHECK (true);

-- 2. Create Storage Bucket for Report Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'reports' bucket
DROP POLICY IF EXISTS "Public View Report Images" ON storage.objects;
CREATE POLICY "Public View Report Images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'reports');

DROP POLICY IF EXISTS "Allow Upload Report Images" ON storage.objects;
CREATE POLICY "Allow Upload Report Images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Allow Update Report Images" ON storage.objects;
CREATE POLICY "Allow Update Report Images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'reports');

DROP POLICY IF EXISTS "Allow Delete Report Images" ON storage.objects;
CREATE POLICY "Allow Delete Report Images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'reports');
