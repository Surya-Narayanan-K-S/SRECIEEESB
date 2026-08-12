import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

async function cleanDuplicates() {
  console.log("Fetching societies...");
  const { data: societies, error } = await supabase.from("societies").select("*").order("id", { ascending: true });
  if (error) {
    console.error("Error fetching societies:", error);
    process.exit(1);
  }

  const seen = new Set();
  const duplicates = [];

  for (const s of societies) {
    const cleanName = s.name.trim().toLowerCase();
    if (seen.has(cleanName)) {
      duplicates.push(s);
    } else {
      seen.add(cleanName);
    }
  }

  if (duplicates.length === 0) {
    console.log("No duplicate societies found.");
    return;
  }

  console.log(`Found ${duplicates.length} duplicate societies. Cleaning up...`);
  for (const dup of duplicates) {
    console.log(`Deleting duplicate society: "${dup.name}" (ID: ${dup.id})`);
    const { error: delError } = await supabase.from("societies").delete().eq("id", dup.id);
    if (delError) {
      console.error(`Error deleting ID ${dup.id}:`, delError);
    } else {
      console.log(`Deleted ID ${dup.id} successfully.`);
    }
  }
}

cleanDuplicates();
