/* ===================================================================
   SUPABASE CONFIG  (assets/js/config.js)
   -------------------------------------------------------------------
   Fill these two values in from your Supabase project:
     Supabase dashboard → Project Settings → API
       • Project URL   →  url
       • anon public   →  anonKey   (the "anon"/"public" key — NOT service_role)

   The anon key is SAFE to expose in client code. Your data is protected
   by Row Level Security policies (see supabase/schema.sql), not by hiding
   this key. NEVER put the service_role key in any file served to browsers.

   While these remain the "YOUR_…" placeholders, the site runs in local
   demo mode (content from data/content.json; admin saves a local draft).
   As soon as you set real values AND run the SQL in supabase/schema.sql,
   the site becomes a live CMS backed by Supabase.
=================================================================== */
window.SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_PROJECT_URL",
  anonKey: "YOUR_SUPABASE_ANON_KEY"
};
