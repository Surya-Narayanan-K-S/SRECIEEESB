-- ==============================================================================
-- IEEE SREC - OFFICE BEARERS MEMBERSHIP ID & ORIGINAL ID CARDS SCHEMA SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- This adds 'ieee_id', 'membership_id', 'roll_number', 'card_pdf_url', 'email', 'phone'
-- columns to all office bearer and executive member tables across all 9 technical societies.
-- ==============================================================================

-- 1. Main Student Branch
ALTER TABLE IF EXISTS public.srec_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.srec_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.new_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.new_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. CS (Computer Society)
ALTER TABLE IF EXISTS public.cs_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.cs_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. CIS (Computational Intelligence Society)
ALTER TABLE IF EXISTS public.cis_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.cis_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 4. ComSoc (Communications Society)
ALTER TABLE IF EXISTS public.comsoc_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.comsoc_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 5. EMBS (Engineering in Medicine & Biology)
ALTER TABLE IF EXISTS public.embs_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.embs_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 6. IMS (Instrumentation & Measurement)
ALTER TABLE IF EXISTS public.im_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.im_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.ims_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.ims_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 7. PELS (Power Electronics Society)
ALTER TABLE IF EXISTS public.pels_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.pels_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 8. CAS / CASS (Circuits and Systems Society)
ALTER TABLE IF EXISTS public.cas_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.cas_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.cass_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.cass_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 9. WIE (Women in Engineering)
ALTER TABLE IF EXISTS public.wie_office_bearers 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS public.wie_executive_members 
ADD COLUMN IF NOT EXISTS ieee_id TEXT,
ADD COLUMN IF NOT EXISTS membership_id TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 10. Student Members
ALTER TABLE IF EXISTS public.student_members
ADD COLUMN IF NOT EXISTS card_pdf_url TEXT;

-- 11. Create storage bucket if not already existing
INSERT INTO storage.buckets (id, name, public)
VALUES ('ieee-cards', 'ieee-cards', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('office_bearers', 'office_bearers', true)
ON CONFLICT (id) DO UPDATE SET public = true;
