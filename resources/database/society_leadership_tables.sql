-- ==============================================================================
-- IEEE SREC - SOCIETY LEADERSHIP & OFFICE BEARERS TABLES & STORAGE BUCKET SCRIPT
-- ==============================================================================

-- 1. Create society_office_bearers Table
CREATE TABLE IF NOT EXISTS public.society_office_bearers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    academic_year TEXT DEFAULT '2024-2025',
    society_code TEXT NOT NULL, -- e.g. 'cs', 'cis', 'comsoc', 'embs', 'im', 'pels', 'cas', 'wie'
    group_name TEXT,
    image_url TEXT,
    photo TEXT,
    photo_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create society_executive_members Table
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

-- 3. Enable RLS (Row Level Security) with Permissive Policies
ALTER TABLE public.society_office_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_executive_members ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read society leadership data
DROP POLICY IF EXISTS "Allow Public Read Society Office Bearers" ON public.society_office_bearers;
CREATE POLICY "Allow Public Read Society Office Bearers" 
ON public.society_office_bearers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Full Access Society Office Bearers" ON public.society_office_bearers;
CREATE POLICY "Allow Full Access Society Office Bearers" 
ON public.society_office_bearers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Public Read Society Executives" ON public.society_executive_members;
CREATE POLICY "Allow Public Read Society Executives" 
ON public.society_executive_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Full Access Society Executives" ON public.society_executive_members;
CREATE POLICY "Allow Full Access Society Executives" 
ON public.society_executive_members FOR ALL USING (true) WITH CHECK (true);

-- 4. Storage Bucket Setup (Storage: office_bearers and member-avatars)
-- Insert storage bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('office_bearers', 'office_bearers', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('member-avatars', 'member-avatars', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for Office Bearers bucket
DROP POLICY IF EXISTS "Public View Office Bearer Images" ON storage.objects;
CREATE POLICY "Public View Office Bearer Images" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('office_bearers', 'member-avatars'));

DROP POLICY IF EXISTS "Allow Upload Office Bearer Images" ON storage.objects;
CREATE POLICY "Allow Upload Office Bearer Images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id IN ('office_bearers', 'member-avatars'));

DROP POLICY IF EXISTS "Allow Update Office Bearer Images" ON storage.objects;
CREATE POLICY "Allow Update Office Bearer Images" 
ON storage.objects FOR UPDATE 
USING (bucket_id IN ('office_bearers', 'member-avatars'));

DROP POLICY IF EXISTS "Allow Delete Office Bearer Images" ON storage.objects;
CREATE POLICY "Allow Delete Office Bearer Images" 
ON storage.objects FOR DELETE 
USING (bucket_id IN ('office_bearers', 'member-avatars'));

-- 5. Seed Dr. Praveen Kumar as Program Coordinator for IEEE PELS
INSERT INTO public.society_office_bearers (name, role, department, academic_year, society_code, group_name)
VALUES ('Dr. Praveen Kumar', 'Program Coordinator', 'EEE', '2026-2027', 'pels', 'pels')
ON CONFLICT DO NOTHING;



