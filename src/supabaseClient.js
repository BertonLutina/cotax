import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL="https://ihsxjbmvrvbjfhobamvq.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloc3hqYm12cnZiamZob2JhbXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDk5NTEsImV4cCI6MjA3MjgyNTk1MX0.9PzcH6HwOUNUgtG7MOwp9l-llXj7L4juMGosqTrZhDM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);