import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://homymzdujoeemdxxowut.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXltemR1am9lZW1keHhvd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1Mjc2MDUsImV4cCI6MjEwMjEwMzYwNX0.4f20aCllO8oEmMXKp-3duhkZiblUxXisrEfmyz7dLV4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
