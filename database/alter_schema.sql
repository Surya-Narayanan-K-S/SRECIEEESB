-- Required tables for Funding and Senior Members

-- 1. Create funding_submissions table
CREATE TABLE IF NOT EXISTS funding_submissions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    submission_type TEXT NOT NULL,
    description TEXT,
    budget_amount NUMERIC,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE funding_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read funding_submissions" ON funding_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert funding_submissions" ON funding_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update funding_submissions" ON funding_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete funding_submissions" ON funding_submissions FOR DELETE USING (true);


-- 2. Create senior_members table
CREATE TABLE IF NOT EXISTS senior_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    s_no INT,
    "current_role" TEXT,
    college TEXT,
    linkedin_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE senior_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read senior_members" ON senior_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert senior_members" ON senior_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update senior_members" ON senior_members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete senior_members" ON senior_members FOR DELETE USING (true);

-- Policies for awards table
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read awards" ON awards FOR SELECT USING (true);
CREATE POLICY "Allow public insert awards" ON awards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update awards" ON awards FOR UPDATE USING (true);
CREATE POLICY "Allow public delete awards" ON awards FOR DELETE USING (true);

-- Policies for office_bearers table
ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read office_bearers" ON office_bearers FOR SELECT USING (true);
CREATE POLICY "Allow public insert office_bearers" ON office_bearers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update office_bearers" ON office_bearers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete office_bearers" ON office_bearers FOR DELETE USING (true);

-- Policies for activities table
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert activities" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update activities" ON activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete activities" ON activities FOR DELETE USING (true);

-- Policies for member_counts table
ALTER TABLE member_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read member_counts" ON member_counts FOR SELECT USING (true);
CREATE POLICY "Allow public insert member_counts" ON member_counts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update member_counts" ON member_counts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete member_counts" ON member_counts FOR DELETE USING (true);

-- Policies for annual_plan table
ALTER TABLE annual_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read annual_plan" ON annual_plan FOR SELECT USING (true);
CREATE POLICY "Allow public insert annual_plan" ON annual_plan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update annual_plan" ON annual_plan FOR UPDATE USING (true);
CREATE POLICY "Allow public delete annual_plan" ON annual_plan FOR DELETE USING (true);

-- Policies for events_gallery table
ALTER TABLE events_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read events_gallery" ON events_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert events_gallery" ON events_gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update events_gallery" ON events_gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete events_gallery" ON events_gallery FOR DELETE USING (true);

