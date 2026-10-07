-- ==============================================================================
-- IEEE SREC STUDENT BRANCH - AI AUTONOMOUS BACKEND AGENT SCHEMA & AUDIT LOGS
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create AI Backend Audit & Operations Table
CREATE TABLE IF NOT EXISTS public.ai_backend_logs (
    id BIGSERIAL PRIMARY KEY,
    job_type TEXT NOT NULL, -- 'APPLICATION_REVIEW', 'EVENT_SUMMARIZATION', 'FUNDING_TRIAGE', 'HEALTH_AUDIT', 'FULL_AUTOPILOT'
    status TEXT NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS', 'FLAGGED', 'WARNING', 'FAILED'
    summary TEXT NOT NULL,
    items_processed INT DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for chronological queries
CREATE INDEX IF NOT EXISTS idx_ai_backend_logs_created_at ON public.ai_backend_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_backend_logs_job_type ON public.ai_backend_logs (job_type);

-- 2. Extend Applications Table with AI Review Columns
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS ai_review_status TEXT DEFAULT 'PENDING'; -- 'APPROVED', 'FLAGGED', 'MANUAL_REVIEW', 'PENDING'
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS ai_confidence_score NUMERIC DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS ai_notes TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS ai_reviewed_at TIMESTAMPTZ;

-- 3. Extend Event Reports Table with AI Enhancement Columns
ALTER TABLE public.event_reports ADD COLUMN IF NOT EXISTS ai_enhanced BOOLEAN DEFAULT false;
ALTER TABLE public.event_reports ADD COLUMN IF NOT EXISTS ai_tags TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.event_reports ADD COLUMN IF NOT EXISTS ai_enhanced_at TIMESTAMPTZ;

-- 4. Extend Funding Submissions Table with AI Triaging Columns
ALTER TABLE public.funding_submissions ADD COLUMN IF NOT EXISTS ai_priority TEXT DEFAULT 'NORMAL'; -- 'URGENT', 'HIGH', 'NORMAL', 'LOW'
ALTER TABLE public.funding_submissions ADD COLUMN IF NOT EXISTS ai_feasibility_score NUMERIC DEFAULT 0;
ALTER TABLE public.funding_submissions ADD COLUMN IF NOT EXISTS ai_analysis TEXT;
ALTER TABLE public.funding_submissions ADD COLUMN IF NOT EXISTS ai_triaged_at TIMESTAMPTZ;

-- 5. Enable Row Level Security (RLS) for AI Logs
ALTER TABLE public.ai_backend_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read ai_backend_logs" ON public.ai_backend_logs;
CREATE POLICY "Allow public read ai_backend_logs" ON public.ai_backend_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access ai_backend_logs" ON public.ai_backend_logs;
CREATE POLICY "Allow full access ai_backend_logs" ON public.ai_backend_logs FOR ALL USING (true) WITH CHECK (true);

-- Insert initial bootstrap log
INSERT INTO public.ai_backend_logs (job_type, status, summary, items_processed, details)
VALUES (
    'HEALTH_AUDIT',
    'SUCCESS',
    'AI Autonomous Backend Agent system initialized successfully. Monitoring active.',
    0,
    '{"service": "IEEE SREC AI Autopilot", "version": "1.0.0", "engine": "Gemini 2.5 Flash"}'::jsonb
);
