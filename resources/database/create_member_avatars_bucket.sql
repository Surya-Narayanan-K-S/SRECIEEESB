-- ==============================================================================
-- IEEE SREC Student Branch - Member Avatars Storage Bucket Setup
-- Run this SQL in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Create public storage bucket for student member photos & ID avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-avatars', 'member-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Row Level Security (RLS) Policies
-- Allow anyone to view avatar photos (public access for digital ID cards & directory)
DROP POLICY IF EXISTS "Public Member Avatars Read" ON storage.objects;
CREATE POLICY "Public Member Avatars Read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'member-avatars');

-- Allow students to upload their member profile photo
DROP POLICY IF EXISTS "Public Member Avatars Upload" ON storage.objects;
CREATE POLICY "Public Member Avatars Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'member-avatars');

-- Allow students/admins to update their photo
DROP POLICY IF EXISTS "Public Member Avatars Update" ON storage.objects;
CREATE POLICY "Public Member Avatars Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'member-avatars');

-- Allow deletes
DROP POLICY IF EXISTS "Public Member Avatars Delete" ON storage.objects;
CREATE POLICY "Public Member Avatars Delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'member-avatars');
