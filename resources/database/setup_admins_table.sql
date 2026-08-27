-- =========================================
-- CREATE ADMINISTRATORS TABLE LOGIC
-- =========================================

-- Create a table to map authorized administrators
-- (Supabase handles authentication in auth.users, but we store their profile/role data here)
CREATE TABLE IF NOT EXISTS public.administrators (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    admin_secret_key_used TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================
-- SECURE ROW LEVEL SECURITY (RLS)
-- =========================================

ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;

-- Admins can only view the administrators table if they are authenticated
CREATE POLICY "Admins are viewable by authenticated users" 
ON public.administrators 
FOR SELECT 
TO authenticated 
USING (true);

-- =========================================
-- AUTOMATIC TRIGGER FOR NEW REGISTRATIONS
-- =========================================
-- This automatically creates an entry in your public.administrators table 
-- whenever a new admin registers via your /admin-login portal.

CREATE OR REPLACE FUNCTION public.handle_new_admin_registration() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.administrators (id, email, admin_secret_key_used, role)
    VALUES (new.id, new.email, 'MRBB', 'admin');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to the Supabase auth.users system table
CREATE TRIGGER on_auth_admin_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin_registration();
