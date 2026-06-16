# Solomon Pagunsan — Website + Supabase CMS

A multi-page website for Solomon Pagunsan (sugarcane farmer, inventor, entrepreneur,
content creator — Bayawan City, Negros Oriental, Philippines), with a real
**Supabase-backed CMS**: secure admin login, content stored in a Postgres database,
image uploads to Supabase Storage, and a public site that loads its content from the
database.

The site is **static** (plain HTML/CSS/JS — no build step) and talks to Supabase from
the browser, so it still deploys to GitHub Pages / Netlify / Vercel for free.

> **Graceful fallback:** until you add your Supabase keys, everything runs in local
> **demo mode** (content from `data/content.json`; admin saves a local draft). The
> moment you fill in `assets/js/config.js` and run the SQL, it becomes a live CMS —
> no code changes required.

---

## 1. Folder structure

```
solomon-pagunsan/
├── index.html        Home
├── about.html        About Solomon
├── farm.html         The Farm (crops + livestock)
├── captain.html      The Captain of Negros
├── workshop.html     Workshop & innovations
├── farm-learning.html Farm Learning (student visits)
├── products.html     Planting Materials & Tools (inquiry-based)
├── vlogs.html        Vlogs (categorized)
├── gallery.html      Gallery (categorized + filters)
├── partners.html     Partners & Sponsors
├── press.html        Press & Recognition
├── contact.html      Contact (info + inquiry form)
├── CNAME                         Custom domain (solomonpagunsan.com)
│
├── data/content.json             Seed/fallback content (single source for demo mode)
│
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── config.js             ← PUT YOUR SUPABASE URL + ANON KEY HERE
│       ├── supabase-client.js    Supabase wrapper (auth, content, storage)
│       ├── content.js            Loader: Supabase → content.json → fallback
│       ├── components.js         Shared header (nav) + footer
│       ├── render.js             Builds each page from the content
│       └── app.js                Boots a page, wires nav/lightbox/animations
│
├── admin/
│   ├── index.html                Admin login + dashboard
│   ├── admin.css
│   └── admin.js                  Schema-driven editor (live DB save + upload)
│
├── supabase/
│   ├── schema.sql                Run once: tables, RLS, roles, storage
│   └── seed_content.sql          Run once: loads the content into the DB
│
└── images/  (+ images/sponsors/)
```

---

## 2. How content flows

**Public pages** load content in this order (`assets/js/content.js`):
1. **Supabase** `content` table — when configured (the live source of truth).
2. `data/content.json` — static fallback.
3. Built-in embedded copy — last-resort fallback for `file://` previews.

**Admin** reads the same content, you edit it, and **Save** writes straight back to
the Supabase `content` table — so the public site reflects changes immediately.

The nav has eight items — Home, About, Farm Learning, Vlogs, Gallery, Partners, Press,
Contact — all styled identically (Contact is a normal menu item, not a button).

---

## 3. Supabase setup (one-time, ~10 minutes)

### Step 1 — Create the project
1. Sign up at <https://supabase.com> (the **Free tier** is enough).
2. **New project** → pick a name, a strong database password, and a region close to
   your audience. Wait for it to finish provisioning.

### Step 2 — Run the database setup
1. In the dashboard: **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this project, paste it in, and click **Run**.
   This creates the `profiles` and `content` tables, the `is_admin()` security
   function, Row Level Security policies, and the `site-images` storage bucket.
3. New query again → paste `supabase/seed_content.sql` → **Run**. This loads the
   website content into the database.

### Step 3 — Create your admin user
1. **Authentication → Providers → Email**: ensure Email is enabled.
2. **Authentication → Providers** (or **Settings → Auth**): turn **OFF**
   "Allow new users to sign up" (you create users yourself — this keeps the admin
   role from being handed out publicly).
3. **Authentication → Users → Add user → Create new user**: enter the admin email and
   a strong password, and tick **Auto Confirm User**.
   - The schema's trigger automatically gives this user the `admin` role.
   - To verify: **Table editor → profiles** should show one row with `role = admin`.
   - (To make an *existing* user admin manually:
     `update public.profiles set role='admin' where id='<user-uuid>';`)

### Step 4 — Connect the site to Supabase
1. **Project Settings → API**. Copy **Project URL** and the **anon / public** key.
2. Open `assets/js/config.js` and paste them in:
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://YOUR-PROJECT.supabase.co",
     anonKey: "eyJhbGciOi...your-anon-key..."
   };
   ```
   > The **anon key is meant to be public** — your data is protected by the RLS
   > policies, not by hiding the key. **Never** put the `service_role` key in any file
   > that is sent to browsers.

### Step 5 — Allow your domain (CORS / redirects)
**Authentication → URL Configuration**: add your site's URL(s) to **Site URL** and
**Redirect URLs** (e.g. `https://solomonpagunsan.com`, and `http://localhost:8000`
for local testing).

That's it — open `admin/index.html`, sign in with your admin email/password, edit,
and **Save**. Changes are live on the public site immediately.

---

## 4. Using the admin panel

Open **`/admin/`** and sign in.

- **Sidebar** — every editable section: Hero, Announcements, Home Teasers, About,
  The Captain of Negros, The Farm (crops + livestock), Workshop, Farm Learning,
  Planting Materials & Tools, Vlogs, Gallery, Partners & Sponsors, Press, Contact,
  Social & Links, Site/Footer.
- **Add / edit / delete** list items; reorder with **↑ / ↓**.
- **Images** — paste a path/URL, or click **Upload…** to send the file to Supabase
  Storage; the public URL is saved automatically.
- **Save** — writes to the database (live immediately).
- **Export JSON** — downloads a `content.json` backup any time.
- **Revert** — reloads the saved content, dropping unsaved edits.
- **Sign out** — ends the Supabase session.

**Route protection & roles:** the admin checks for a valid Supabase session *and* the
`admin` role on load; non-admins are signed out. Writes are blocked server-side too by
RLS — even a crafted request can't change content or upload images without an admin
session. If the session ends (logout/expiry), the panel returns to the login screen.

---

## 5. Deploying (production)

The site is static, so any static host works. Example — **GitHub Pages**:
1. Push this folder to a GitHub repo.
2. **Settings → Pages →** deploy from your branch (root).
3. The included `CNAME` points Pages at `solomonpagunsan.com`; set that domain's DNS to
   GitHub Pages, or remove `CNAME` to use the default `*.github.io` URL.
4. Make sure `assets/js/config.js` has your real keys, and that your deployed URL is in
   Supabase's **URL Configuration** (Step 5 above).

Netlify/Vercel: drag-and-drop or connect the repo; no build command, publish directory
is the project root.

Because auth, content, and uploads all run against Supabase, **the admin can be
deployed with the site** — it's protected by real authentication and RLS. (If you
prefer, host `admin/` separately or behind your host's access control for defence in
depth.)

---

## 6. Security notes

- Data is protected by **Row Level Security**: public read, admin-only writes, enforced
  in the database regardless of client code.
- Keep **public sign-ups disabled**; create admin users yourself.
- The **anon key** in `config.js` is safe to ship. The **service_role** key must never
  appear in client code or the repo.
- Sessions are handled by Supabase Auth (JWT, auto-refresh) and stored by the SDK.

---

## 7. Demo mode (no Supabase)

If `config.js` still has the `YOUR_…` placeholders, the panel runs in demo mode:
- Login uses a local password (`solomon-admin`) — a preview gate with **no security**.
- **Save draft** stores edits in your browser; open the site in the same browser to
  preview. **Export JSON** downloads `content.json` to publish statically.
- This mode exists so the project works offline and before Supabase is wired. Don't
  rely on it for a public admin.

---

## 8. Local preview

Browsers block `fetch()` on `file://`, so run a tiny server:
```bash
# from inside solomon-pagunsan/
python3 -m http.server 8000
# site  → http://localhost:8000/
# admin → http://localhost:8000/admin/
```
Add `http://localhost:8000` to Supabase **URL Configuration** to test live login locally.

---

## 9. Image optimisation (already done)

Three oversized PNGs were converted to progressive JPEG and large JPEGs recompressed
(max edge 1600px), cutting `images/` from ~17 MB to ~8 MB with no visible quality loss.
Images use `loading="lazy"`. Originals remain in your uploaded ZIP.

---

## 10. Owner to-do before launch

All editable in the admin (Contact → *Social & Links*, Partners → *Media Kit*, etc.):
- **WhatsApp number** (`social.whatsapp` is a placeholder `wa.me/63XXXXXXXXXX`).
- **Email** (`social.email` placeholder).
- **Real photos** for hero/gallery/sections (upload via the admin).
- **Media-kit numbers** (blank by default).
- **Verify** tool/invention names and individual vlog titles/URLs.
- **Review** the home-page stat strip for current accuracy.

---

## 11. Extending the CMS

The admin form is **schema-driven**. To add a new editable field: add it to the content
(in `seed_content.sql` / the DB) and to the `SCHEMA` array in `admin/admin.js`. The form
rebuilds itself — no other code changes needed.

To change the content shape or add tables, edit `supabase/schema.sql` and the
`getContent`/`saveContent` helpers in `assets/js/supabase-client.js`.

---

## 12. v2 restructure notes (what changed)

This version reorganizes the site into **12 dedicated pages** with clearer content
separation and a consistent header.

- **New pages:** The Farm, The Captain of Negros, Workshop, and Planting Materials &
  Tools (Products). Farm Learning is now its **own** page, fully separate from The Farm.
- **Header behavior (fixed):** the header is solid cream on **every inner page** (always
  visible, never overlapping content); it is transparent **only** over the home-page hero
  and turns solid on scroll. Active page is highlighted. The mobile menu is a solid panel
  (no transparency/blur), readable on all pages.
- **Uniform nav:** Contact is a normal menu item — no special button. All 12 items share
  one style.
- **Products is inquiry-based only** — no cart, no checkout. Each item links to Messenger
  / the contact form. "Seeds" is intentionally avoided; the page is "Planting Materials
  & Tools."
- **Gallery** is categorized (Farm Life, Crops, Livestock, Workshop, Student Visits,
  Community) with filter tabs. **Vlogs** are grouped by category (Featured, Educational,
  Demonstrations, Community).
- **Contact** adds a simple inquiry form (opens the visitor's mail app with the message
  pre-filled — no backend needed) plus channels and location.
- **Removed from Partners:** the old "Work With Solomon" services grid and the Media Kit
  section, to match the new spec (Partners now = sponsors + supporters). Their data was
  retired from `content.json`; tell me if you'd like either restored as its own page.
- **Editable placeholders to verify before launch:** About → *family background note*;
  The Captain → *social reach* numbers; Products → *Napier grass* image; plus the
  existing WhatsApp/email placeholders. All editable in the admin.

The content model in `content.json` was reorganized to match (top-level `about`,
`captain`, `farm`, `workshop`, `farmLearning`, `products`, `vlogs`, `gallery`,
`partners`, `press`, `contact`). The admin schema and Supabase seed were updated to
match, so re-running `supabase/seed_content.sql` loads the new structure.
