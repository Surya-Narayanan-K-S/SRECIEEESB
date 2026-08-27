-- ==============================================================================
-- SUPABASE STORAGE BUCKET: ieee-cards
-- Run this script in the Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Create the public storage bucket for IEEE membership cards
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ieee-cards',
  'ieee-cards',
  true,
  10485760, -- 10 MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf'];

-- 2. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Public Read Access on ieee-cards" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access on ieee-cards" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access on ieee-cards" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access on ieee-cards" ON storage.objects;

-- 3. Allow public read access to all uploaded IEEE card PDFs
CREATE POLICY "Public Read Access on ieee-cards"
ON storage.objects FOR SELECT
USING (bucket_id = 'ieee-cards');

-- 4. Allow insert / upload access to the ieee-cards bucket
CREATE POLICY "Public Insert Access on ieee-cards"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ieee-cards');

-- 5. Allow update access to the ieee-cards bucket
CREATE POLICY "Public Update Access on ieee-cards"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ieee-cards');

-- 6. Allow delete access to the ieee-cards bucket
CREATE POLICY "Public Delete Access on ieee-cards"
ON storage.objects FOR DELETE
USING (bucket_id = 'ieee-cards');
