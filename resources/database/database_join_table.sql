-- 1. Create the `applications` table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    target_society TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    statement_of_purpose TEXT NOT NULL
);

-- 2. Optional: Set up Row Level Security (RLS) policies
-- If you want anyone (even non-logged-in users) to submit an application, you MUST allow anonymous inserts.
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT into applications
CREATE POLICY "Allow anonymous inserts" ON applications
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow authenticated ADMIN users to list applications (if you have admins)
CREATE POLICY "Allow admins to read applications" ON applications
    FOR SELECT 
    TO authenticated
    USING (true);
