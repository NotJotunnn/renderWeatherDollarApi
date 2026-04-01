import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables", {
    url: supabaseUrl ? "✓ Present" : "✗ Missing",
    key: supabaseAnonKey ? "✓ Present" : "✗ Missing",
  });
  throw new Error("Missing Supabase environment variables");
}

// Validate URL format
if (!supabaseUrl.startsWith("https://")) {
  console.error("Invalid Supabase URL format:", supabaseUrl);
  throw new Error("Invalid Supabase URL format");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    // Enhanced error handling for token issues
    debug: false, // Set to true only in development if needed
    // Custom storage implementation with error handling could go here
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
  },
  // Add request interceptor for better error handling
  // This will be handled by our global error handlers instead
});
