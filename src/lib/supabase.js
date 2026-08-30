import { createClient } from "@supabase/supabase-js";

// Production defaults so client-side and server-side builds always connect seamlessly
const DEFAULT_SUPABASE_URL = "https://wlbgdlolgjccvbuvutiw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_MTFbAqD0o2TyKdXFZn_8lg_4e7KLKrG";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
