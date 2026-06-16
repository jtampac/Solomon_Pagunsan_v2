/* ===================================================================
   SOLOMON PAGUNSAN — ADMIN PANEL  (admin/admin.js)
   -------------------------------------------------------------------
   A dependency-free, schema-driven editor for data/content.json.

   HOW IT WORKS
     • Loads content from Supabase (live) or, if Supabase isn't configured,
       from data/content.json via the shared loader (window.SiteContent).
     • You edit an in-memory working copy.
     • "Save"        → LIVE: writes to the Supabase `content` table (instant).
                       DEMO: writes a localStorage draft for local preview.
     • "Export JSON" → downloads content.json as a backup / static publish.
     • "Revert"      → reloads the saved content, dropping unsaved edits.

   AUTH
     • LIVE: Supabase email/password sign-in, restricted to users whose
       profiles.role = 'admin'. Logout calls supabase.auth.signOut().
     • DEMO: a local password gate (no security) used only when Supabase
       is not configured, so the panel still works offline.md.

   ADD A NEW EDITABLE FIELD
     Add it to content.json AND to the SCHEMA below. The form builds
     itself from the schema — no other code changes needed.
=================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------
     CONFIG
  ---------------------------------------------------------------- */
  // Demo fallback gate — only used when Supabase is NOT configured.
  var DEMO_PASSWORD = "solomon-admin";
  var AUTH_KEY = "sp_admin_authed";

  // True when Supabase is configured + reachable → live CMS mode.
  function CMS() { return !!(window.SupabaseCMS && window.SupabaseCMS.enabled); }

  /* ----------------------------------------------------------------
     SCHEMA  — describes every editable area.
     Field types: text | url | email | textarea | image | checkbox
                  | stringlist | imagelist
                  | object  (nested fields[])
                  | list    (array of objects; item shape = itemFields[])
  ---------------------------------------------------------------- */
  var SCHEMA = [
    { id: "dashboard", group: "Overview", label: "Dashboard", type: "dashboard" },

    /* ---------- HOME ---------- */
    {
      id: "hero", group: "Home", label: "Hero", type: "object", path: "hero",
      intro: "The home-page hero (the only page with a transparent-over-image header).",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "titleLine1", label: "Title — line 1", type: "text" },
        { key: "titleLine2", label: "Title — line 2", type: "text" },
        { key: "tagline", label: "Tagline", type: "text" },
        { key: "lede", label: "Intro paragraph", type: "textarea" },
        { key: "image", label: "Background image", type: "image" },
        { key: "primaryCta", label: "Primary button", type: "object", fields: [
          { key: "label", label: "Label", type: "text" }, { key: "href", label: "Link", type: "text" } ] },
        { key: "secondaryCta", label: "Secondary button", type: "object", fields: [
          { key: "label", label: "Label", type: "text" }, { key: "href", label: "Link", type: "text" } ] }
      ]
    },
    {
      id: "announcements", group: "Home", label: "Announcements", type: "list", path: "announcements",
      intro: "Notices on the home page. Untick Active to hide without deleting.", itemLabel: "title",
      itemFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Message", type: "textarea" },
        { key: "date", label: "Date label", type: "text" },
        { key: "active", label: "Active (show on site)", type: "checkbox" }
      ]
    },
    {
      id: "homeTeasers", group: "Home", label: "Home Teasers", type: "list", path: "homeTeasers",
      intro: "The “Inside the farm” cards linking to key pages.", itemLabel: "title",
      itemFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "href", label: "Links to (page)", type: "text" },
        { key: "linkLabel", label: "Link label", type: "text" }
      ]
    },

    /* ---------- ABOUT ---------- */
    {
      id: "about", group: "About", label: "About Solomon", type: "object", path: "about",
      intro: "Personal story, journey, values, and philosophy.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "paragraphs", label: "Story paragraphs", type: "stringlist", multiline: true },
        { key: "timeline", label: "Journey timeline", type: "list", itemLabel: "year", itemFields: [
          { key: "year", label: "Year", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] },
        { key: "values", label: "Values", type: "list", itemLabel: "title", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] },
        { key: "philosophyTitle", label: "Philosophy heading", type: "text" },
        { key: "philosophy", label: "Philosophy paragraphs", type: "stringlist", multiline: true },
        { key: "familyNote", label: "Family background note", type: "textarea", hint: "Placeholder — replace with verified family details." },
        { key: "quote", label: "Pull quote", type: "object", fields: [
          { key: "text", label: "Quote", type: "textarea" },
          { key: "attribution", label: "Attribution", type: "text" } ] }
      ]
    },

    /* ---------- THE CAPTAIN OF NEGROS ---------- */
    {
      id: "captain", group: "The Captain", label: "The Captain of Negros", type: "object", path: "captain",
      intro: "Dedicated page: journey, influence, community, reach, recognition, leadership.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "lead", label: "Lead paragraph", type: "textarea" },
        { key: "image", label: "Banner image", type: "image" },
        { key: "pillars", label: "Pillars", type: "list", itemLabel: "title", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] },
        { key: "reach", label: "Social reach", type: "object", fields: [
          { key: "facebookFollowers", label: "Facebook followers", type: "text" },
          { key: "youtubeSubscribers", label: "YouTube subscribers", type: "text" },
          { key: "tiktokFollowers", label: "TikTok followers", type: "text" },
          { key: "monthlyReach", label: "Monthly reach", type: "text" },
          { key: "note", label: "Note", type: "text" } ] },
        { key: "persona", label: "“Captain Jack Sparrow” block", type: "object", fields: [
          { key: "kicker", label: "Kicker", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea" },
          { key: "tags", label: "Tags", type: "stringlist" },
          { key: "image", label: "Image", type: "image" } ] },
        { key: "quote", label: "Pull quote", type: "object", fields: [
          { key: "text", label: "Quote", type: "textarea" },
          { key: "attribution", label: "Attribution", type: "text" } ] },
        { key: "ctaLabel", label: "Button label", type: "text" }
      ]
    },

    /* ---------- THE FARM ---------- */
    {
      id: "farm", group: "The Farm", label: "The Farm", type: "object", path: "farm",
      intro: "Crops + livestock as one working ecosystem.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "sub", label: "Intro", type: "textarea" },
        { key: "crops", label: "Crops", type: "object", fields: [
          { key: "kicker", label: "Kicker", type: "text" },
          { key: "title", label: "Title (HTML ok)", type: "text" },
          { key: "sub", label: "Subtitle", type: "textarea" },
          { key: "items", label: "Crops", type: "list", itemLabel: "name", itemFields: [
            { key: "name", label: "Name", type: "text" },
            { key: "text", label: "Description", type: "textarea" },
            { key: "img", label: "Image", type: "image" },
            { key: "wide", label: "Wide tile", type: "checkbox" } ] } ] },
        { key: "livestock", label: "Livestock", type: "object", fields: [
          { key: "kicker", label: "Kicker", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "sub", label: "Subtitle", type: "textarea" },
          { key: "items", label: "Animals", type: "list", itemLabel: "name", itemFields: [
            { key: "name", label: "Name", type: "text" },
            { key: "text", label: "Description", type: "textarea" },
            { key: "img", label: "Image", type: "image" } ] } ] }
      ]
    },

    /* ---------- WORKSHOP ---------- */
    {
      id: "workshop", group: "Workshop", label: "Workshop", type: "object", path: "workshop",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title (HTML ok)", type: "text" },
        { key: "sub", label: "Subtitle", type: "textarea" },
        { key: "items", label: "Tools / innovations", type: "list", itemLabel: "name", itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "note", label: "Note", type: "textarea" },
          { key: "img", label: "Image", type: "image" },
          { key: "tall", label: "Tall tile", type: "checkbox" } ] }
      ]
    },

    /* ---------- FARM LEARNING ---------- */
    {
      id: "farmLearning", group: "Farm Learning", label: "Farm Learning", type: "object", path: "farmLearning",
      intro: "Student visits and hands-on learning (kept separate from The Farm).",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "intro", label: "Intro paragraph", type: "textarea" },
        { key: "points", label: "Highlights", type: "list", itemLabel: "heading", itemFields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] },
        { key: "image", label: "Feature image", type: "image" },
        { key: "modes", label: "Ways students learn", type: "list", itemLabel: "title", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] },
        { key: "gallery", label: "Visit photos", type: "imagelist" },
        { key: "ctaLabel", label: "Button label", type: "text" }
      ]
    },

    /* ---------- PRODUCTS ---------- */
    {
      id: "products", group: "Products", label: "Planting Materials & Tools", type: "object", path: "products",
      intro: "Inquiry-based listing — no shopping cart. Cassava cuttings, Napier grass, sugarcane setts, modified tools.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        { key: "deliveryNote", label: "Delivery note", type: "textarea" },
        { key: "items", label: "Items", type: "list", itemLabel: "name", itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
          { key: "img", label: "Image", type: "image" },
          { key: "category", label: "Tag (e.g. Planting Material / Tool)", type: "text" } ] },
        { key: "note", label: "Disclaimer", type: "textarea" },
        { key: "ctaLabel", label: "Inquiry button label", type: "text" }
      ]
    },

    /* ---------- VLOGS ---------- */
    {
      id: "vlogs", group: "Content", label: "Vlogs", type: "object", path: "vlogs",
      intro: "Videos grouped by category. Paste the full YouTube watch URL.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "sub", label: "Subtitle", type: "textarea" },
        { key: "categories", label: "Categories (order shown)", type: "stringlist" },
        { key: "items", label: "Videos", type: "list", itemLabel: "title", itemFields: [
          { key: "url", label: "YouTube URL", type: "url" },
          { key: "title", label: "Title", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
          { key: "category", label: "Category", type: "text" } ] }
      ]
    },

    /* ---------- GALLERY ---------- */
    {
      id: "gallery", group: "Content", label: "Gallery", type: "object", path: "gallery",
      intro: "Photos with a category each (used by the filter tabs).",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "categories", label: "Categories (filter order)", type: "stringlist" },
        { key: "items", label: "Photos", type: "list", itemLabel: "category", itemFields: [
          { key: "src", label: "Image", type: "image" },
          { key: "category", label: "Category", type: "text" },
          { key: "caption", label: "Caption (optional)", type: "text" } ] }
      ]
    },

    /* ---------- PARTNERS ---------- */
    {
      id: "partners", group: "Partners", label: "Partners & Sponsors", type: "object", path: "partners",
      intro: "Logo slider + supporters. Use clean, similar-height logos.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "sub", label: "Subtitle", type: "textarea" },
        { key: "sponsors", label: "Sponsors / logos", type: "list", itemLabel: "name", itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "logo", label: "Logo", type: "image" },
          { key: "url", label: "Website", type: "url" } ] },
        { key: "supporters", label: "Supporters / organizations", type: "list", itemLabel: "name", itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] },
        { key: "ctaLabel", label: "Button label", type: "text" }
      ]
    },

    /* ---------- PRESS ---------- */
    {
      id: "press", group: "Press", label: "Press & Recognition", type: "object", path: "press",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "items", label: "Articles", type: "list", itemLabel: "outlet", itemFields: [
          { key: "outlet", label: "Outlet", type: "text" },
          { key: "title", label: "Headline", type: "text" },
          { key: "meta", label: "Meta", type: "text" },
          { key: "url", label: "URL", type: "url" } ] },
        { key: "achievements", label: "Achievements", type: "list", itemLabel: "title", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea" } ] }
      ]
    },

    /* ---------- CONTACT ---------- */
    {
      id: "contact", group: "Contact", label: "Contact", type: "object", path: "contact",
      intro: "Contact copy, channels, location. Links live under Social & Links.",
      fields: [
        { key: "kicker", label: "Kicker", type: "text" },
        { key: "title", label: "Title (HTML ok)", type: "text" },
        { key: "text", label: "Intro text", type: "textarea" },
        { key: "channels", label: "Channels", type: "list", itemLabel: "label", itemFields: [
          { key: "key", label: "Type (email/whatsapp/facebook/messenger/youtube/tiktok/instagram)", type: "text" },
          { key: "label", label: "Label", type: "text" },
          { key: "blurb", label: "Blurb", type: "text" } ] },
        { key: "location", label: "Location", type: "object", fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "text", label: "Address text", type: "text" } ] },
        { key: "formNote", label: "Form note", type: "text" }
      ]
    },
    {
      id: "social", group: "Contact", label: "Social & Links", type: "object", path: "social",
      intro: "Powers every social icon, contact channels, and footer. Fill the WhatsApp and email placeholders before launch.",
      fields: [
        { key: "email", label: "Email", type: "email" },
        { key: "whatsapp", label: "WhatsApp link", type: "url" },
        { key: "facebook", label: "Facebook", type: "url" },
        { key: "messenger", label: "Messenger", type: "url" },
        { key: "youtube", label: "YouTube", type: "url" },
        { key: "tiktok", label: "TikTok", type: "url" },
        { key: "instagram", label: "Instagram", type: "url" }
      ]
    },

    /* ---------- SETTINGS ---------- */
    {
      id: "site", group: "Settings", label: "Site & Footer", type: "object", path: "site",
      fields: [
        { key: "name", label: "Site name", type: "text" },
        { key: "shortMark", label: "Logo monogram", type: "text" },
        { key: "location", label: "Location line", type: "text" },
        { key: "footerBlurb", label: "Footer blurb", type: "textarea" }
      ]
    }
  ];

  /* ----------------------------------------------------------------
     STATE
  ---------------------------------------------------------------- */
  var CONTENT = null;     // working copy (edited in place)
  var dirty = false;
  var activeId = "dashboard";

  /* ----------------------------------------------------------------
     SMALL HELPERS
  ---------------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return (o == null ? undefined : o[k]); }, obj);
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function markDirty(isDirty) {
    dirty = isDirty;
    var s = $("#savestate");
    if (isDirty) { s.textContent = "Unsaved changes"; s.classList.add("is-dirty"); }
    else { s.textContent = "All changes saved"; s.classList.remove("is-dirty"); }
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 2600);
  }

  /* ----------------------------------------------------------------
     FIELD RENDERERS
     Each renderer mutates `parent[key]` in place and calls markDirty.
  ---------------------------------------------------------------- */
  function onEdit() { markDirty(true); }

  function fieldText(field, parent) {
    var type = field.type === "url" ? "url" : field.type === "email" ? "email" : "text";
    var input = el("input", {
      type: type, value: parent[field.key] == null ? "" : parent[field.key],
      oninput: function () { parent[field.key] = input.value; onEdit(); }
    });
    return wrapField(field, input);
  }

  function fieldTextarea(field, parent) {
    var ta = el("textarea", {
      oninput: function () { parent[field.key] = ta.value; onEdit(); }
    });
    ta.value = parent[field.key] == null ? "" : parent[field.key];
    return wrapField(field, ta);
  }

  function fieldCheckbox(field, parent) {
    var id = "chk_" + Math.random().toString(36).slice(2);
    var input = el("input", {
      type: "checkbox", id: id,
      onchange: function () { parent[field.key] = input.checked; onEdit(); }
    });
    input.checked = !!parent[field.key];
    return el("div", { class: "field field--check" }, [input, el("label", { for: id, text: field.label })]);
  }

  function fieldImage(field, parent) {
    return el("div", { class: "field" }, [
      el("label", { text: field.label }),
      imagePicker(parent[field.key] || "", function (val) { parent[field.key] = val; onEdit(); })
    ]);
  }

  // Reusable image control: URL text + upload-to-dataURL, with live preview.
  function imagePicker(value, onChange) {
    var preview = el("div", { class: "imgpick__preview" });
    function paint(v) {
      if (v) { preview.style.backgroundImage = "url('" + cssUrl(v) + "')"; preview.textContent = ""; }
      else { preview.style.backgroundImage = "none"; preview.textContent = "No image"; }
    }
    var urlInput = el("input", {
      type: "text", value: value, placeholder: "images/your-photo.jpg",
      oninput: function () { onChange(urlInput.value); paint(urlInput.value); }
    });
    var file = el("input", { type: "file", accept: "image/*", style: "display:none" });
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      if (CMS()) {
        // Live mode: upload to Supabase Storage, store the public URL.
        toast("Uploading image…");
        uploadBtn.disabled = true;
        window.SupabaseCMS.uploadImage(f).then(function (publicUrl) {
          urlInput.value = publicUrl; onChange(publicUrl); paint(publicUrl);
          toast("Image uploaded to Supabase Storage.");
        }).catch(function (err) {
          toast("Upload failed: " + (err.message || err));
        }).then(function () { uploadBtn.disabled = false; file.value = ""; });
      } else {
        // Demo mode: embed a data URL for local preview only.
        var reader = new FileReader();
        reader.onload = function () {
          var data = reader.result;
          urlInput.value = data; onChange(data); paint(data);
          toast("Image embedded in draft. Connect Supabase to upload real files.");
        };
        reader.readAsDataURL(f);
      }
    });
    var uploadBtn = el("button", { class: "btn btn--ghost btn--sm", type: "button",
      onclick: function () { file.click(); } }, ["Upload…"]);
    var clearBtn = el("button", { class: "btn btn--ghost btn--sm", type: "button",
      onclick: function () { urlInput.value = ""; onChange(""); paint(""); } }, ["Clear"]);

    paint(value);
    return el("div", { class: "imgpick" }, [
      preview,
      el("div", { class: "imgpick__controls" }, [
        urlInput,
        el("div", { class: "imgpick__row" }, [uploadBtn, clearBtn, file]),
        el("div", { class: "field__hint", text: "Paste an image path/URL, or upload to preview. Uploaded files embed into the draft only — for the published site, place the file in images/ and reference it by path." })
      ])
    ]);
  }
  function cssUrl(v) { return String(v).replace(/'/g, "%27"); }

  function fieldStringList(field, parent) {
    if (!Array.isArray(parent[field.key])) parent[field.key] = [];
    var arr = parent[field.key];
    var list = el("div", {});
    function redraw() {
      list.innerHTML = "";
      if (!arr.length) list.appendChild(el("div", { class: "list__empty", text: "Nothing yet." }));
      arr.forEach(function (val, i) {
        var input = field.multiline
          ? el("textarea", { oninput: function () { arr[i] = input.value; onEdit(); } })
          : el("input", { type: "text", value: val, oninput: function () { arr[i] = input.value; onEdit(); } });
        if (field.multiline) input.value = val;
        var row = el("div", { class: "listrow" }, [
          input,
          listBtns(arr, i, redraw)
        ]);
        list.appendChild(row);
      });
    }
    redraw();
    var add = el("button", { class: "btn btn--ghost btn--sm", type: "button",
      onclick: function () { arr.push(""); onEdit(); redraw(); } }, ["+ Add"]);
    return el("div", { class: "field" }, [el("label", { text: field.label }), list, add]);
  }

  function fieldImageList(field, parent) {
    if (!Array.isArray(parent[field.key])) parent[field.key] = [];
    var arr = parent[field.key];
    var list = el("div", {});
    function redraw() {
      list.innerHTML = "";
      if (!arr.length) list.appendChild(el("div", { class: "list__empty", text: "No images yet." }));
      arr.forEach(function (val, i) {
        var pick = imagePicker(val, function (v) { arr[i] = v; onEdit(); });
        var card = el("div", { class: "card" }, [
          el("div", { class: "card__head" }, [
            el("h3", { text: "Image " + (i + 1) }),
            el("div", { class: "card__tools" }, [listBtns(arr, i, redraw)])
          ]),
          pick
        ]);
        list.appendChild(card);
      });
    }
    redraw();
    var add = el("button", { class: "btn btn--ghost btn--sm", type: "button",
      onclick: function () { arr.push(""); onEdit(); redraw(); } }, ["+ Add image"]);
    return el("div", { class: "field" }, [el("label", { text: field.label }), list, add]);
  }

  // up / down / delete controls for any array item
  function listBtns(arr, i, redraw) {
    function move(d) {
      var j = i + d;
      if (j < 0 || j >= arr.length) return;
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; onEdit(); redraw();
    }
    return el("div", { class: "card__tools" }, [
      el("button", { class: "btn btn--ghost btn--sm", type: "button", title: "Move up",
        onclick: function () { move(-1); } }, ["↑"]),
      el("button", { class: "btn btn--ghost btn--sm", type: "button", title: "Move down",
        onclick: function () { move(1); } }, ["↓"]),
      el("button", { class: "btn btn--danger btn--sm", type: "button", title: "Delete",
        onclick: function () {
          if (confirm("Delete this item?")) { arr.splice(i, 1); onEdit(); redraw(); }
        } }, ["Delete"])
    ]);
  }

  function fieldObject(field, parent) {
    if (parent[field.key] == null || typeof parent[field.key] !== "object") parent[field.key] = {};
    var obj = parent[field.key];
    var fs = el("fieldset", { class: "fieldset" }, [el("legend", { text: field.label })]);
    field.fields.forEach(function (f) { fs.appendChild(renderField(f, obj)); });
    return fs;
  }

  function fieldList(field, parent) {
    if (!Array.isArray(parent[field.key])) parent[field.key] = [];
    var arr = parent[field.key];
    var holder = el("div", {});
    function blankItem() {
      var o = {};
      field.itemFields.forEach(function (f) {
        o[f.key] = f.type === "checkbox" ? false
          : (f.type === "stringlist" || f.type === "imagelist" || f.type === "list") ? []
          : f.type === "object" ? {} : "";
      });
      return o;
    }
    function redraw() {
      holder.innerHTML = "";
      if (!arr.length) holder.appendChild(el("div", { class: "list__empty", text: "Nothing yet — add the first one below." }));
      arr.forEach(function (item, i) {
        var labelVal = (field.itemLabel && item[field.itemLabel]) ? String(item[field.itemLabel]) : "";
        var head = el("div", { class: "card__head" }, [
          el("h3", { text: (labelVal || ("Item " + (i + 1))) }),
          el("div", { class: "card__tools" }, [listBtns(arr, i, redraw)])
        ]);
        var card = el("div", { class: "card" }, [head]);
        field.itemFields.forEach(function (f) { card.appendChild(renderField(f, item)); });
        holder.appendChild(card);
      });
    }
    redraw();
    var add = el("button", { class: "btn btn--solid btn--sm", type: "button",
      onclick: function () { arr.push(blankItem()); onEdit(); redraw(); } }, ["+ Add " + singular(field.label)]);
    return el("div", { class: "field" }, [
      el("label", { text: field.label }), holder, add
    ]);
  }
  function singular(label) {
    var s = String(label).toLowerCase();
    if (s.length > 3 && s.slice(-1) === "s") s = s.slice(0, -1);
    return s;
  }

  // wrap a simple control with a label + optional hint
  function wrapField(field, control) {
    var kids = [el("label", { text: field.label }), control];
    if (field.hint) kids.push(el("div", { class: "field__hint", text: field.hint }));
    return el("div", { class: "field" }, kids);
  }

  // dispatcher
  function renderField(field, parent) {
    switch (field.type) {
      case "textarea":   return fieldTextarea(field, parent);
      case "checkbox":   return fieldCheckbox(field, parent);
      case "image":      return fieldImage(field, parent);
      case "stringlist": return fieldStringList(field, parent);
      case "imagelist":  return fieldImageList(field, parent);
      case "object":     return fieldObject(field, parent);
      case "list":       return fieldList(field, parent);
      default:           return fieldText(field, parent);
    }
  }

  /* ----------------------------------------------------------------
     SECTION RENDERING
  ---------------------------------------------------------------- */
  function renderSection(section) {
    var mount = $("#admin-content");
    mount.innerHTML = "";
    $("#admin-title").textContent = section.label;

    mount.appendChild(el("div", { class: "banner", html:
      CMS()
        ? "<strong>Connected to Supabase.</strong> Edits save straight to your database " +
          "with <strong>Save</strong> and go live on the website immediately. " +
          "Image uploads go to Supabase Storage. <strong>Export JSON</strong> makes a backup."
        : "<strong>Preview / demo mode.</strong> Supabase is not configured, so edits are stored " +
          "in this browser only. Use <strong>Save draft</strong> to preview and <strong>Export JSON</strong> " +
          "to download <code>content.json</code>. Add your Supabase keys in " +
          "<code>assets/js/config.js</code> (see README) to enable the live CMS." }));

    if (section.type === "dashboard") { renderDashboard(mount); return; }

    if (section.intro) {
      mount.appendChild(el("div", { class: "editor__intro" }, [el("p", { html: section.intro })]));
    }

    if (section.type === "object") {
      // resolve parent + key so renderField can mutate in place
      var parts = section.path.split(".");
      var key = parts.pop();
      var parent = parts.length ? getPath(CONTENT, parts.join(".")) : CONTENT;
      if (parent[key] == null) parent[key] = {};
      var obj = parent[key];
      var card = el("div", { class: "card" }, []);
      section.fields.forEach(function (f) { card.appendChild(renderField(f, obj)); });
      mount.appendChild(card);
    } else if (section.type === "list") {
      var parts2 = section.path.split(".");
      var key2 = parts2.pop();
      var parent2 = parts2.length ? getPath(CONTENT, parts2.join(".")) : CONTENT;
      mount.appendChild(fieldList({
        key: key2, label: section.label, type: "list",
        itemLabel: section.itemLabel, itemFields: section.itemFields
      }, parent2));
    }
    mount.scrollIntoView ? window.scrollTo(0, 0) : null;
  }

  function count(path) {
    var v = getPath(CONTENT, path);
    return Array.isArray(v) ? v.length : 0;
  }

  function renderDashboard(mount) {
    mount.appendChild(el("div", { class: "editor__intro" }, [
      el("p", { html: CMS()
        ? "Welcome. Edit any section from the sidebar, then <strong>Save</strong> — changes write to your Supabase database and go live immediately. <strong>Export JSON</strong> downloads a backup."
        : "Welcome. Edit any section from the sidebar, <strong>Save draft</strong> to preview your changes on the live site in this browser, then <strong>Export JSON</strong> to download <code>content.json</code>." })
    ]));

    var stats = [
      ["Announcements", count("announcements")],
      ["Timeline entries", count("about.timeline")],
      ["Crops", count("farm.crops.items")],
      ["Livestock", count("farm.livestock.items")],
      ["Workshop tools", count("workshop.items")],
      ["Products", count("products.items")],
      ["Vlogs", count("vlogs.items")],
      ["Gallery photos", count("gallery.items")],
      ["Sponsors", count("partners.sponsors")],
      ["Press articles", count("press.items")]
    ];
    var grid = el("div", { class: "dash__grid" });
    stats.forEach(function (s) {
      grid.appendChild(el("div", { class: "dash-card" }, [
        el("div", { class: "dash-card__num", text: String(s[1]) }),
        el("div", { class: "dash-card__label", text: s[0] })
      ]));
    });
    mount.appendChild(grid);

    // quick links
    var quick = ["hero", "about", "captain", "farm", "farmLearning", "products", "gallery", "social"];
    var links = el("div", { class: "dash__links" });
    quick.forEach(function (id) {
      var sec = SCHEMA.filter(function (s) { return s.id === id; })[0];
      if (!sec) return;
      links.appendChild(el("button", { class: "dash__link", type: "button",
        onclick: function () { go(id); } }, [
        el("h4", { text: sec.label }),
        el("p", { text: "Edit " + sec.label.toLowerCase() })
      ]));
    });
    mount.appendChild(el("h3", { text: "Jump to", style: "margin:.4rem 0 .8rem;color:var(--green-800);" }));
    mount.appendChild(links);
  }

  /* ----------------------------------------------------------------
     SIDEBAR NAV
  ---------------------------------------------------------------- */
  function buildNav() {
    var nav = $("#admin-nav");
    nav.innerHTML = "";
    var groups = [];
    SCHEMA.forEach(function (s) { if (groups.indexOf(s.group) < 0) groups.push(s.group); });
    groups.forEach(function (g) {
      nav.appendChild(el("div", { class: "sidebar__group", text: g }));
      SCHEMA.filter(function (s) { return s.group === g; }).forEach(function (s) {
        var btn = el("button", { class: "navitem", type: "button", "data-id": s.id,
          onclick: function () { go(s.id); } }, [
          el("span", { class: "navitem__dot" }),
          el("span", { text: s.label })
        ]);
        nav.appendChild(btn);
      });
    });
    highlightNav();
  }
  function highlightNav() {
    Array.prototype.forEach.call(document.querySelectorAll(".navitem"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-id") === activeId);
    });
  }
  function go(id) {
    activeId = id;
    var sec = SCHEMA.filter(function (s) { return s.id === id; })[0] || SCHEMA[0];
    highlightNav();
    renderSection(sec);
    closeMenu();
  }

  /* ----------------------------------------------------------------
     SAVE / EXPORT / REVERT
  ---------------------------------------------------------------- */
  // Primary save: Supabase DB when live, else a local draft.
  async function save() {
    if (CMS()) {
      var btn = $("#save-btn");
      btn.disabled = true;
      toast("Saving to database…");
      try {
        await window.SupabaseCMS.saveContent(CONTENT);
        try { localStorage.removeItem(window.SiteContent.DRAFT_KEY); } catch (e) {}
        markDirty(false);
        toast("Saved. Changes are live on the website.");
      } catch (e) {
        toast("Save failed: " + (e.message || e));
      } finally {
        btn.disabled = false;
      }
    } else {
      try {
        localStorage.setItem(window.SiteContent.DRAFT_KEY, JSON.stringify(CONTENT));
        markDirty(false);
        toast("Draft saved. Open the live site in this browser to preview.");
      } catch (e) {
        toast("Could not save draft: " + e.message);
      }
    }
  }

  // Export the working content as a content.json backup file.
  function exportJson() {
    var blob = new Blob([JSON.stringify(CONTENT, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = el("a", { href: url, download: "content.json" });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast("content.json downloaded (backup).");
  }

  // Revert unsaved edits back to the stored source.
  function revert() {
    var msg = CMS()
      ? "Discard unsaved edits and reload the saved content from the database?"
      : "Discard the local draft and reload the published content?";
    if (!confirm(msg)) return;
    if (!CMS()) { try { localStorage.removeItem(window.SiteContent.DRAFT_KEY); } catch (e) {} }
    boot();
    toast("Reverted to saved content.");
  }

  /* ----------------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------------- */
  function openMenu() { $("#sidebar").classList.add("is-open"); $("#scrim").classList.add("is-open"); }
  function closeMenu() { $("#sidebar").classList.remove("is-open"); $("#scrim").classList.remove("is-open"); }

  /* ----------------------------------------------------------------
     AUTH
     • Live mode  → Supabase email/password + 'admin' role check.
     • Demo mode  → local password gate (no Supabase configured).
  ---------------------------------------------------------------- */
  function showApp() {
    $("#login").style.display = "none";
    $("#app").hidden = false;
  }
  function showLogin(message) {
    $("#app").hidden = true;
    $("#login").style.display = "";
    if (message) $("#login-error").textContent = message;
  }

  function setLoginNote() {
    var note = $("#login-note");
    var emailField = $("#login-email").parentNode;
    if (CMS()) {
      emailField.style.display = "";
      note.innerHTML = "Sign in with your Supabase admin account. " +
        "Access is restricted to users with the <strong>admin</strong> role.";
    } else if (window.SupabaseCMS && window.SupabaseCMS.configured && !window.SupabaseCMS.sdkLoaded) {
      emailField.style.display = "none";
      note.innerHTML = "<strong>Supabase SDK could not load.</strong> Check your network/CDN, " +
        "then reload. Falling back to demo mode for now (password <code>solomon-admin</code>).";
    } else {
      emailField.style.display = "none";
      note.innerHTML = "<strong>Demo mode.</strong> Supabase is not configured, so this is a " +
        "local preview gate (password <code>solomon-admin</code>) with <em>no real security</em>. " +
        "Add your keys in <code>assets/js/config.js</code> to enable secure login. See README.";
    }
  }

  function wireLogin() {
    $("#login-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      $("#login-error").textContent = "";
      var btn = $("#login-btn");

      if (CMS()) {
        var email = $("#login-email").value.trim();
        var pass = $("#login-pass").value;
        if (!email || !pass) { $("#login-error").textContent = "Enter your email and password."; return; }
        btn.disabled = true;
        try {
          await window.SupabaseCMS.signIn(email, pass);
          var admin = await window.SupabaseCMS.isAdmin();
          if (!admin) {
            await window.SupabaseCMS.signOut();
            $("#login-error").textContent = "This account is not an admin.";
            return;
          }
          await startApp();
        } catch (err) {
          $("#login-error").textContent = err.message || "Sign in failed.";
        } finally {
          btn.disabled = false;
        }
      } else {
        // demo fallback
        if ($("#login-pass").value === DEMO_PASSWORD) {
          try { sessionStorage.setItem(AUTH_KEY, "yes"); } catch (err) {}
          await startApp();
        } else {
          $("#login-error").textContent = "Incorrect password.";
        }
      }
    });
  }

  async function logout() {
    if (CMS()) { await window.SupabaseCMS.signOut(); }
    try { sessionStorage.removeItem(AUTH_KEY); } catch (e) {}
    location.reload();
  }

  /* ----------------------------------------------------------------
     BOOT
  ---------------------------------------------------------------- */
  async function loadContent() {
    if (CMS()) {
      try {
        var body = await window.SupabaseCMS.getContent();
        if (body) return body;
      } catch (e) { /* not seeded yet — fall back below */ }
    }
    return await window.SiteContent.load();
  }

  async function boot() {
    CONTENT = clone(await loadContent());
    markDirty(false);
    go(activeId);
  }

  function applyModeUI() {
    var save = $("#save-btn").querySelector("span");
    var dl = $("#download-btn").querySelector("span");
    var dc = $("#discard-btn").querySelector("span");
    if (save) save.textContent = CMS() ? "Save" : "Save draft";
    if (dl) dl.textContent = "Export JSON";
    if (dc) dc.textContent = CMS() ? "Revert" : "Discard draft";
  }

  async function startApp() {
    showApp();
    applyModeUI();
    buildNav();
    await boot();
    if (CMS()) {
      // sign-out elsewhere / expiry → back to login
      window.SupabaseCMS.onAuthChange(function (session) {
        if (!session) location.reload();
      });
    }
  }

  function wireChrome() {
    $("#save-btn").addEventListener("click", save);
    $("#download-btn").addEventListener("click", exportJson);
    $("#discard-btn").addEventListener("click", revert);
    $("#logout-btn").addEventListener("click", logout);
    $("#menu-btn").addEventListener("click", openMenu);
    $("#scrim").addEventListener("click", closeMenu);
    window.addEventListener("beforeunload", function (e) {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    });
  }

  async function init() {
    wireLogin();
    wireChrome();
    setLoginNote();
    if (CMS()) {
      // Already signed in as admin? Skip the login screen.
      try {
        var session = await window.SupabaseCMS.getSession();
        if (session && (await window.SupabaseCMS.isAdmin())) { await startApp(); return; }
      } catch (e) {}
      showLogin();
    } else {
      var authed = false;
      try { authed = sessionStorage.getItem(AUTH_KEY) === "yes"; } catch (e) {}
      if (authed) await startApp();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
