import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read the .env file manually
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error("Could not read Supabase URL or Anon Key from .env");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseAnonKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSocieties() {
  const { data, error } = await supabase.from("societies").select("*").order("id", { ascending: true });
  if (error) {
    console.error("Error fetching societies:", error);
    process.exit(1);
  }
  console.log("Fetched societies count:", data.length);
  console.log(JSON.stringify(data, null, 2));
}

checkSocieties();
