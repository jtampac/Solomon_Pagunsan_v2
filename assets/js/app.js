/* ===================================================================
   SOLOMON PAGUNSAN — APP ORCHESTRATOR  (assets/js/app.js)
   Boots every public page: loads content, mounts shared header/footer,
   renders the page's sections, then wires interactions. Each page only
   sets <body data-page="..."> and includes the four scripts.
=================================================================== */
(function () {
  "use strict";

  const $  = function (s, c) { return (c || document).querySelector(s); };
  const $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ----------------------- LIGHTBOX ------------------------------ */
  function initLightbox() {
    const lb = $("#lightbox");
    const stage = $("#lightboxStage");
    if (!lb || !stage) return;
    function open() { lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); stage.innerHTML = ""; document.body.style.overflow = ""; }
    window.openImage = function (src) { stage.innerHTML = '<img src="' + src + '" alt="">'; open(); };
    window.openVideo = function (id) { stage.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>'; open(); };
    const closeBtn = $("#lightboxClose");
    if (closeBtn) closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* --- delegated clicks for lightbox images & video cards --- */
  function initMediaClicks(content) {
    document.addEventListener("click", function (e) {
      const imgEl = e.target.closest("[data-lightbox-img]");
      if (imgEl) { window.openImage(imgEl.getAttribute("data-lightbox-img")); return; }
      const vid = e.target.closest(".video-card");
      if (vid) {
        const id = vid.getAttribute("data-yt");
        if (id) { window.openVideo(id); }
        else {
          const fb = vid.getAttribute("data-fallback");
          if (fb) window.open(fb, "_blank", "noopener");
        }
      }
    });
  }

  /* ----------------------- STICKY NAV ---------------------------- */
  function initNav() {
    const nav = $("#nav");
    if (!nav) return;
    const page = (document.body && document.body.dataset.page) || "home";
    const isHome = page === "home";

    /* Home: transparent over the hero, solid after scrolling.
       Inner pages: always solid (cream) — readable, never overlaps. */
    const setSolid = function () {
      if (isHome) nav.classList.toggle("is-solid", window.scrollY > 80);
      else nav.classList.add("is-solid");
    };
    setSolid();
    if (isHome) window.addEventListener("scroll", setSolid, { passive: true });

    const toggle = $("#navToggle");
    const links = $("#navLinks");
    const closeMenu = function () {
      if (!links) return;
      links.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
      });
      $$("#navLinks a").forEach(function (a) { a.addEventListener("click", closeMenu); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    }
  }

  /* Inquiry form (Contact page) — builds a mailto message; no backend. */
  function initContactForm(content) {
    const form = $("#inquiryForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const get = function (n) { const f = form.querySelector('[name="' + n + '"]'); return f ? f.value.trim() : ""; };
      const name = get("name"), email = get("email"), subject = get("subject"), message = get("message");
      if (!name || !email || !message) { alert("Please fill in your name, email, and message."); return; }
      const to = (content.social && content.social.email) || "";
      const subj = encodeURIComponent(subject || ("Inquiry from " + name));
      const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      if (to) {
        window.location.href = "mailto:" + to + "?subject=" + subj + "&body=" + body;
      } else {
        const msgr = (content.social && content.social.messenger) || "";
        if (msgr) window.open(msgr, "_blank", "noopener");
      }
    });
  }

  /* Gallery category filters */
  function initGalleryFilters() {
    const bar = $("#galleryFilters");
    if (!bar) return;
    const cells = $$("#galleryMasonry .gallery__cell");
    $$(".gallery__filter", bar).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".gallery__filter", bar).forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        const f = btn.getAttribute("data-filter");
        cells.forEach(function (cell) {
          const show = f === "all" || cell.getAttribute("data-cat") === f;
          cell.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ----------------------- SCROLL REVEAL ------------------------- */
  function initReveal() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const els = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------- STAT COUNTERS -------------------------- */
  function initCounters() {
    const counters = $$(".stat__num");
    if (!counters.length) return;
    if (!("IntersectionObserver" in window)) return;
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 1400, start = performance.now();
        const step = function (now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* --------------------------- BOOT ------------------------------ */
  function boot() {
    const page = (document.body && document.body.dataset.page) || "home";
    SiteContent.load().then(function (content) {
      if (window.Components) Components.mount(content, page);
      if (window.Render) Render.renderPage(content, page);
      initNav();
      initLightbox();
      initMediaClicks(content);
      initContactForm(content);
      initGalleryFilters();
      initReveal();
      initCounters();
    }).catch(function (err) {
      console.error("Failed to load site content:", err);
      const main = document.getElementById("page");
      if (main) main.innerHTML = '<div class="load-error"><p>Content could not be loaded. ' +
        'If you are viewing this from your computer, run a local server (see README) or upload the site to your host.</p></div>';
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
