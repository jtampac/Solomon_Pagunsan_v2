/* ===================================================================
   SUPABASE CLIENT  (assets/js/supabase-client.js)
   -------------------------------------------------------------------
   Thin wrapper around supabase-js. Loads AFTER:
     1. the supabase-js UMD bundle (CDN <script>)   → window.supabase
     2. assets/js/config.js                          → window.SUPABASE_CONFIG

   Exposes window.SupabaseCMS used by both the public site (read) and the
   admin panel (auth + write + image upload).

   If config is still placeholder values, `enabled` is false and the rest
   of the app falls back to the static-file behaviour automatically.
=================================================================== */
(function () {
  "use strict";

  var cfg = window.SUPABASE_CONFIG || {};
  var configured =
    !!cfg.url && !!cfg.anonKey &&
    cfg.url.indexOf("YOUR_") === -1 &&
    cfg.anonKey.indexOf("YOUR_") === -1;

  var sdkLoaded = !!(window.supabase && window.supabase.createClient);
  var client = null;

  if (configured && sdkLoaded) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
  }

  var CONTENT_ID = 1;          // single content row
  var BUCKET = "site-images";  // public storage bucket

  /* ---------------------- CONTENT (read/write) ------------------- */
  async function getContent() {
    if (!client) return null;
    var res = await client.from("content").select("body").eq("id", CONTENT_ID).single();
    if (res.error) throw res.error;
    return res.data ? res.data.body : null;
  }

  async function saveContent(body) {
    if (!client) throw new Error("Supabase is not configured.");
    var res = await client
      .from("content")
      .upsert({ id: CONTENT_ID, body: body, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (res.error) throw res.error;
    return res.data;
  }

  /* --------------------------- STORAGE --------------------------- */
  async function uploadImage(file) {
    if (!client) throw new Error("Supabase is not configured.");
    var ext = (file.name && file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    var path = "uploads/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + (ext || "jpg");
    var up = await client.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
    if (up.error) throw up.error;
    var pub = client.storage.from(BUCKET).getPublicUrl(path);
    return pub.data.publicUrl;
  }

  /* ---------------------------- AUTH ----------------------------- */
  async function signIn(email, password) {
    if (!client) throw new Error("Supabase is not configured.");
    var res = await client.auth.signInWithPassword({ email: email, password: password });
    if (res.error) throw res.error;
    return res.data;
  }

  async function signOut() {
    if (client) { try { await client.auth.signOut(); } catch (e) {} }
  }

  async function getSession() {
    if (!client) return null;
    var res = await client.auth.getSession();
    return res.data ? res.data.session : null;
  }

  // Confirms the signed-in user has the 'admin' role in public.profiles.
  async function isAdmin() {
    if (!client) return false;
    var session = await getSession();
    if (!session) return false;
    var res = await client.from("profiles").select("role").eq("id", session.user.id).single();
    if (res.error) return false;
    return !!res.data && res.data.role === "admin";
  }

  function onAuthChange(cb) {
    if (client) client.auth.onAuthStateChange(function (_e, session) { cb(session); });
  }

  window.SupabaseCMS = {
    enabled: !!client,
    configured: configured,
    sdkLoaded: sdkLoaded,
    client: client,
    getContent: getContent,
    saveContent: saveContent,
    uploadImage: uploadImage,
    signIn: signIn,
    signOut: signOut,
    getSession: getSession,
    isAdmin: isAdmin,
    onAuthChange: onAuthChange
  };
})();
