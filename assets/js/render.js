/* ===================================================================
   SOLOMON PAGUNSAN — RENDER ENGINE  (assets/js/render.js)
   Builds each page's sections from the content store. Markup mirrors
   the original design exactly so the stylesheet applies unchanged.
   Repeating content (cards, videos, logos) is data-driven from
   data/content.json via SiteContent.load().
=================================================================== */
(function () {
  "use strict";

  /* ---------------------------- helpers --------------------------- */
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function bgStyle(url, fallback) {
    if (url && url.trim()) return 'style="background-image:url(\'' + url + '\')"';
    if (fallback) return 'style="background-image:' + fallback + '"';
    return "";
  }
  function ytId(url) {
    if (!url) return "";
    const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function socialFor(content, key) {
    const s = content.social || {};
    if (key === "email") return s.email ? "mailto:" + s.email : "#";
    return s[key] || "#";
  }

  /* ============================ HERO ============================== */
  function hero(content) {
    const h = content.hero || {};
    const media = bgStyle(h.image, null);
    return '' +
      '<section class="hero" id="hero">' +
        '<div class="hero__media" id="heroMedia" ' + media + '></div>' +
        '<div class="hero__scrim"></div>' +
        '<div class="hero__content">' +
          '<p class="hero__eyebrow reveal">' + (h.eyebrow || "") + '</p>' +
          '<h1 class="hero__title reveal">' + (h.titleLine1 || "") + '<br/>' + (h.titleLine2 || "") + '</h1>' +
          '<p class="hero__tagline reveal">' + (h.tagline || "") + '</p>' +
          '<p class="hero__lede reveal">' + (h.lede || "") + '</p>' +
          '<div class="hero__actions reveal">' +
            '<a href="' + (h.primaryCta ? h.primaryCta.href : "#") + '" class="btn btn--solid">' + (h.primaryCta ? h.primaryCta.label : "") + '</a>' +
            '<a href="' + (h.secondaryCta ? h.secondaryCta.href : "#") + '" class="btn btn--ghost">' + (h.secondaryCta ? h.secondaryCta.label : "") + '</a>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  /* ============================ STATS ============================= */
  function stats(content) {
    const items = (content.stats || []).map(function (s) {
      return '<div class="stat reveal">' +
        '<span class="stat__num" data-count="' + s.num + '">' + s.num + '</span>' +
        '<span class="stat__unit">' + s.unit + '</span>' +
        '<span class="stat__label">' + s.label + '</span></div>';
    }).join("");
    return '<section class="stats"><div class="stats__inner">' + items + '</div></section>';
  }

  /* ======================== ANNOUNCEMENTS ========================= */
  function announcements(content) {
    const items = (content.announcements || []).filter(function (a) { return a.active !== false; });
    if (!items.length) return "";
    const cards = items.map(function (a) {
      return '<article class="announce reveal">' +
        '<span class="announce__date">' + (a.date || "") + '</span>' +
        '<h3 class="announce__title">' + (a.title || "") + '</h3>' +
        '<p class="announce__body">' + (a.body || "") + '</p>' +
        '</article>';
    }).join("");
    return '<section class="announce-sec" id="announcements">' +
      '<div class="announce-sec__head"><p class="kicker reveal">Latest</p>' +
      '<h2 class="section-title reveal">Announcements</h2></div>' +
      '<div class="announce__grid">' + cards + '</div></section>';
  }

  /* ========================= HOME TEASERS ========================= */
  function teasers(content) {
    const items = (content.homeTeasers || []).map(function (t, i) {
      return '<a class="teaser reveal" href="' + t.href + '">' +
        '<span class="teaser__index">0' + (i + 1) + '</span>' +
        '<h3 class="teaser__title">' + t.title + '</h3>' +
        '<p class="teaser__text">' + t.text + '</p>' +
        '<span class="teaser__link">' + (t.linkLabel || "Explore") + ' &rarr;</span></a>';
    }).join("");
    return '<section class="teasers" id="explore">' +
      '<div class="teasers__head"><p class="kicker reveal">Explore</p>' +
      '<h2 class="section-title reveal">Inside the farm</h2></div>' +
      '<div class="teasers__grid">' + items + '</div></section>';
  }

  /* ===================== SPONSORS MARQUEE ========================= */
  function sponsorsMarquee(content, compact) {
    return '<div class="sponsors__marquee reveal" id="sponsorsMarquee" aria-label="Partner and sponsor logos">' +
      '<div class="sponsors__track' + (compact ? " sponsors__track--compact" : "") + '" id="sponsorsTrack"></div></div>';
  }
  function fillSponsors(content) {
    const track = document.getElementById("sponsorsTrack");
    const sponsors = (content.partners && content.partners.sponsors) || [];
    if (!track || !sponsors.length) return;
    const buildItem = function (s) {
      const isLink = s.url && s.url.trim();
      const tag = isLink ? "a" : "div";
      const elx = document.createElement(tag);
      elx.className = "sponsor";
      if (isLink) { elx.href = s.url; elx.target = "_blank"; elx.rel = "noopener"; }
      if (s.logo && s.logo.trim()) {
        elx.innerHTML = '<img src="' + s.logo + '" alt="' + s.name + '" loading="lazy" decoding="async" ' +
          "onerror=\"this.parentNode.classList.add('sponsor--ph');this.outerHTML='<span class=\\'sponsor__name\\'>" + s.name + "</span>'\">";
      } else {
        elx.classList.add("sponsor--ph");
        elx.innerHTML = '<span class="sponsor__name">' + s.name + '</span>';
      }
      return elx;
    };
    /* duplicate the set so the -50% loop is seamless regardless of count */
    const sets = Math.max(2, Math.ceil((window.innerWidth * 2) / (sponsors.length * 220)) * 2);
    for (let r = 0; r < sets; r++) {
      sponsors.forEach(function (s) { track.appendChild(buildItem(s)); });
    }
    track.style.animationDuration = Math.max(24, sponsors.length * sets * 2.4) + "s";
  }

  /* ===================== CONTACT CTA (home) ======================= */
  function contactCta(content) {
    return '<section class="cta-band reveal">' +
      '<div class="cta-band__inner">' +
        '<p class="cta-band__text">Fellow farmer, buyer, student, or brand &mdash; reach out.</p>' +
        '<a href="contact.html" class="btn btn--gold">Get in touch</a>' +
      '</div></section>';
  }

  /* ============================ ABOUT ============================= */
  function aboutStory(content) {
    const a = content.about || {};
    const paras = (a.paragraphs || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    const timeline = (a.timeline || []).map(function (t) {
      return '<li class="timeline__item reveal">' +
        '<span class="timeline__year">' + t.year + '</span>' +
        '<div class="timeline__card"><h3>' + t.heading + '</h3><p>' + t.text + '</p></div></li>';
    }).join("");
    const q = a.quote || {};
    return '<section class="about" id="about">' +
      '<div class="about__head"><p class="kicker reveal">' + (a.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (a.title || "") + '</h2></div>' +
      '<div class="about__body">' +
        '<div class="about__lead reveal">' + paras + '</div>' +
        '<ol class="timeline">' + timeline + '</ol>' +
        '<figure class="pullquote reveal"><blockquote>' + (q.text || "") + '</blockquote>' +
        '<figcaption>' + (q.attribution || "") + '</figcaption></figure>' +
      '</div></section>';
  }
  function captain(content) {
    const c = (content.about && content.about.captain) || {};
    const tags = (c.tags || []).map(function (t) { return "<li>" + t + "</li>"; }).join("");
    return '<section class="captain" id="captain">' +
      '<div class="captain__media" id="captainMedia" ' + bgStyle(c.bgImage, null) + '></div>' +
      '<div class="captain__scrim"></div>' +
      '<div class="captain__content"><div class="captain__left">' +
        '<p class="kicker kicker--light reveal">' + (c.kicker || "") + '</p>' +
        '<h2 class="section-title section-title--light reveal">' + (c.title || "") + '</h2>' +
        '<p class="captain__text reveal">' + (c.text || "") + '</p>' +
        '<ul class="captain__list reveal">' + tags + '</ul>' +
        '<a href="contact.html" class="btn btn--gold reveal">' + (c.ctaLabel || "Book an appearance") + '</a>' +
      '</div>' +
      '<figure class="captain__photo reveal"><img src="' + (c.image || "") + '" alt="Solomon Pagunsan as Captain Jack Sparrow" loading="lazy" decoding="async"></figure>' +
      '</div></section>';
  }

  /* ===================== FARM LEARNING ============================ */
  function studentVisits(content) {
    const v = (content.farmLearning && content.farmLearning.studentVisits) || {};
    const points = (v.points || []).map(function (p, i) {
      return '<article class="visit-card reveal">' +
        '<span class="visit-card__index">0' + (i + 1) + '</span>' +
        '<h3>' + p.heading + '</h3><p>' + p.text + '</p></article>';
    }).join("");
    return '<section class="visits" id="student-visits">' +
      '<div class="visits__top">' +
        '<div class="visits__intro reveal">' +
          '<p class="kicker">' + (v.kicker || "Farm Learning") + '</p>' +
          '<h2 class="section-title">' + (v.title || "") + '</h2>' +
          '<p class="visits__lede">' + (v.intro || "") + '</p>' +
          '<a href="contact.html" class="btn btn--solid">' + (v.ctaLabel || "Arrange a student visit") + '</a>' +
        '</div>' +
        '<figure class="visits__photo reveal" ' + bgStyle(v.image, "linear-gradient(160deg,var(--green-700),var(--cane))") + '></figure>' +
      '</div>' +
      '<div class="visits__cards">' + points + '</div></section>';
  }
  function crops(content) {
    const f = (content.farmLearning && content.farmLearning.crops) || {};
    const cards = (f.items || []).map(function (c, i) {
      return '<article class="farm-card reveal' + (c.wide ? " farm-card--wide" : "") + '">' +
        '<div class="farm-card__media" ' + bgStyle(c.img, "linear-gradient(155deg,var(--green-700),var(--cane))") + '></div>' +
        '<div class="farm-card__body"><span class="farm-card__index">0' + (i + 1) + '</span>' +
        '<h3>' + c.name + '</h3><p>' + c.text + '</p>' +
        '<a class="farm-card__link" href="contact.html">Learn more &rarr;</a></div></article>';
    }).join("");
    return '<section class="farm" id="farm">' +
      '<div class="farm__head"><p class="kicker reveal">' + (f.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (f.title || "") + '</h2>' +
      '<p class="section-sub reveal">' + (f.sub || "") + '</p></div>' +
      '<div class="farm__grid" id="farmGrid">' + cards + '</div></section>';
  }
  function workshop(content) {
    const w = (content.farmLearning && content.farmLearning.workshop) || {};
    const cells = (w.items || []).map(function (inv) {
      const clickable = inv.img ? ' data-lightbox-img="' + inv.img + '"' : "";
      return '<div class="invent reveal' + (inv.tall ? " invent--tall" : "") + '"' + clickable + '>' +
        '<div class="invent__media" ' + bgStyle(inv.img, "linear-gradient(160deg,#5a4327,#2c2014)") + '></div>' +
        '<div class="invent__label"><h3>' + inv.name + '</h3><span>' + inv.note + '</span></div></div>';
    }).join("");
    return '<section class="workshop" id="workshop">' +
      '<div class="workshop__intro"><p class="kicker kicker--light reveal">' + (w.kicker || "") + '</p>' +
      '<h2 class="section-title section-title--light reveal">' + (w.title || "") + '</h2>' +
      '<p class="section-sub section-sub--light reveal">' + (w.sub || "") + '</p></div>' +
      '<div class="workshop__gallery" id="workshopGallery">' + cells + '</div></section>';
  }
  function livestock(content) {
    const l = (content.farmLearning && content.farmLearning.livestock) || {};
    const inquire = socialFor(content, "messenger") !== "#" ? socialFor(content, "messenger") : socialFor(content, "facebook");
    const cards = (l.items || []).map(function (a) {
      return '<article class="animal reveal">' +
        '<div class="animal__media" ' + bgStyle(a.img, "linear-gradient(160deg,var(--cane),var(--green-700))") + '></div>' +
        '<div class="animal__body"><h3>' + a.name + '</h3><p>' + a.text + '</p>' +
        '<a class="animal__inquire" href="' + inquire + '" target="_blank" rel="noopener">Inquire</a></div></article>';
    }).join("");
    return '<section class="livestock" id="livestock">' +
      '<div class="livestock__head"><p class="kicker reveal">' + (l.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (l.title || "") + '</h2>' +
      '<p class="section-sub reveal">' + (l.sub || "") + '</p></div>' +
      '<div class="livestock__grid" id="livestockGrid">' + cards + '</div></section>';
  }

  /* ============================ VLOGS ============================= */
  function vlogs(content) {
    const v = content.vlogs || {};
    const cards = (v.items || []).map(function (item) {
      const id = ytId(item.url);
      const thumb = id ? "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg" : "";
      return '<article class="video-card reveal" data-yt="' + id + '" data-fallback="' + socialFor(content, "youtube") + '">' +
        '<div class="video-card__thumb" ' + (thumb ? "style=\"background-image:url('" + thumb + "')\"" : "") + '>' +
        '<div class="video-card__play"><i></i></div></div>' +
        '<div class="video-card__body"><h3>' + item.title + '</h3><p>' + item.desc + '</p></div></article>';
    }).join("");
    return '<section class="videos" id="videos">' +
      '<div class="videos__head"><p class="kicker reveal">' + (v.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (v.title || "") + '</h2>' +
      '<p class="section-sub reveal">' + (v.sub || "") + '</p></div>' +
      '<div class="videos__grid" id="videosGrid">' + cards + '</div>' +
      '<div class="videos__cta reveal"><a href="' + socialFor(content, "youtube") + '" class="btn btn--solid" target="_blank" rel="noopener">Subscribe to the channel</a></div>' +
      '</section>';
  }

  /* =========================== GALLERY ============================ */
  function gallery(content) {
    const g = content.gallery || {};
    const photos = (g.images && g.images.length) ? g.images : [];
    const items = photos.map(function (src, i) {
      if (src && src.trim()) {
        return '<div class="gallery__item reveal" data-lightbox-img="' + src + '">' +
          '<img src="' + src + '" alt="Solomon Pagunsan farm photo ' + (i + 1) + '" loading="lazy" decoding="async"></div>';
      }
      return '<div class="gallery__item reveal"><div class="ph">Farm Photo ' + (i + 1) + '</div></div>';
    }).join("");
    return '<section class="gallery" id="gallery">' +
      '<div class="gallery__head"><p class="kicker reveal">' + (g.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (g.title || "") + '</h2></div>' +
      '<div class="gallery__masonry" id="galleryMasonry">' + items + '</div></section>';
  }

  /* ========================== PARTNERS =========================== */
  function partnersIntro(content) {
    const p = (content.partners && content.partners.intro) || {};
    return '<section class="sponsors" id="partners">' +
      '<div class="sponsors__head"><p class="kicker reveal">' + (p.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (p.title || "") + '</h2>' +
      '<p class="section-sub reveal">' + (p.sub || "") + '</p></div>' +
      sponsorsMarquee(content, false) +
      '<div class="sponsors__cta reveal"><p class="sponsors__cta-text">Interested in working with Solomon?</p>' +
      '<a href="contact.html" class="btn btn--solid">Become a Partner</a></div></section>';
  }
  function services(content) {
    const s = (content.partners && content.partners.services) || {};
    const cards = (s.items || []).map(function (item, i) {
      return '<article class="service reveal"><span class="service__index">0' + (i + 1) + '</span>' +
        '<h3 class="service__title">' + item.name + '</h3>' +
        '<p class="service__text">' + item.text + '</p>' +
        '<a class="service__link" href="contact.html">Inquire &rarr;</a></article>';
    }).join("");
    return '<section class="services" id="work">' +
      '<div class="services__head"><p class="kicker reveal">' + (s.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (s.title || "") + '</h2>' +
      '<p class="section-sub reveal">' + (s.sub || "") + '</p></div>' +
      '<div class="services__grid" id="servicesGrid">' + cards + '</div>' +
      '<div class="services__cta reveal"><a href="contact.html" class="btn btn--solid">Let\'s Work Together</a></div></section>';
  }
  function mediaKit(content) {
    const mk = (content.partners && content.partners.mediaKit) || {};
    const stat = function (v) { return (v && String(v).trim()) ? v : "On request"; };
    const items = [
      { label: "Facebook Audience", value: stat(mk.facebookFollowers),  note: "Followers on the main page" },
      { label: "YouTube Audience",  value: stat(mk.youtubeSubscribers), note: "Channel subscribers" },
      { label: "TikTok Audience",   value: stat(mk.tiktokFollowers),    note: "Followers on TikTok" },
      { label: "Monthly Reach",     value: stat(mk.monthlyReach),       note: "Combined views across platforms" },
      { label: "Location",          value: stat(mk.location),           note: "Bayawan City, Negros Oriental" }
    ];
    const cards = items.map(function (k) {
      return '<div class="kit-card reveal' + (k.value === "On request" ? " kit-card--pending" : "") + '">' +
        '<span class="kit-card__label">' + k.label + '</span>' +
        '<span class="kit-card__value">' + k.value + '</span>' +
        '<span class="kit-card__note">' + k.note + '</span></div>';
    }).join("");
    return '<section class="mediakit" id="mediakit">' +
      '<div class="mediakit__head"><p class="kicker reveal">' + (mk.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (mk.title || "") + '</h2>' +
      '<p class="section-sub reveal">' + (mk.sub || "") + '</p></div>' +
      '<div class="mediakit__grid" id="mediaKitGrid">' + cards + '</div>' +
      '<p class="mediakit__note reveal">Figures are updated periodically. For verified, up-to-date analytics, screenshots, and audience demographics, <a href="contact.html">request the full media kit</a>.</p></section>';
  }

  /* ============================ PRESS ============================= */
  function press(content) {
    const p = content.press || {};
    const items = (p.items || []).map(function (a) {
      return '<a class="press reveal" href="' + a.url + '" target="_blank" rel="noopener">' +
        '<span class="press__outlet">' + a.outlet + '</span>' +
        '<h3 class="press__title">' + a.title + '</h3>' +
        '<span class="press__meta">' + a.meta + '</span>' +
        '<span class="press__read">Read the feature &rarr;</span></a>';
    }).join("");
    const ach = (p.achievements || []).map(function (a) {
      return '<div class="achievement reveal"><h3>' + a.title + '</h3><p>' + a.text + '</p></div>';
    }).join("");
    return '<section class="media" id="media">' +
      '<div class="media__head"><p class="kicker reveal">' + (p.kicker || "") + '</p>' +
      '<h2 class="section-title reveal">' + (p.title || "") + '</h2></div>' +
      '<div class="media__grid" id="mediaGrid">' + items + '</div>' +
      '<div class="achievements">' + ach + '</div></section>';
  }

  /* =========================== CONTACT ============================ */
  function contact(content) {
    const c = content.contact || {};
    const glyphs = { facebook: "f", messenger: "\u2709", youtube: "\u25B6", tiktok: "\u266A", whatsapp: "\u260E", email: "@" };
    const channels = (c.channels || []).map(function (ch) {
      const href = socialFor(content, ch.key);
      const external = ch.key !== "email";
      return '<a class="contact__channel" href="' + href + '"' + (external ? ' target="_blank" rel="noopener"' : "") + '>' +
        '<span class="contact__icon">' + (glyphs[ch.key] || "\u2022") + '</span>' +
        '<span class="contact__meta"><strong>' + ch.label + '</strong><em>' + ch.blurb + '</em></span>' +
        '<span class="contact__arrow">&rarr;</span></a>';
    }).join("");
    return '<section class="contact" id="contact"><div class="contact__inner">' +
      '<div class="contact__left reveal"><p class="kicker kicker--light">' + (c.kicker || "") + '</p>' +
      '<h2 class="section-title section-title--light">' + (c.title || "") + '</h2>' +
      '<p class="contact__text">' + (c.text || "") + '</p></div>' +
      '<div class="contact__right reveal">' + channels + '</div></div></section>';
  }

  /* ===================== PAGE COMPOSERS =========================== */
  const pages = {
    home: function (c) {
      return hero(c) + stats(c) + announcements(c) + teasers(c) +
        partnersStrip(c) + contactCta(c);
    },
    about: function (c) { return aboutStory(c) + captain(c); },
    "farm-learning": function (c) {
      return studentVisits(c) + crops(c) + workshop(c) + livestock(c);
    },
    vlogs: function (c) { return vlogs(c); },
    gallery: function (c) { return gallery(c); },
    partners: function (c) { return partnersIntro(c) + services(c) + mediaKit(c); },
    press: function (c) { return press(c); },
    contact: function (c) { return contact(c); }
  };

  /* compact partners strip used on the home page */
  function partnersStrip(content) {
    const sponsors = (content.partners && content.partners.sponsors) || [];
    if (!sponsors.length) return "";
    return '<section class="sponsors sponsors--strip" id="partners-strip">' +
      '<div class="sponsors__head sponsors__head--mini"><p class="kicker reveal">Partners & Sponsors</p>' +
      '<h2 class="section-title reveal">Backed by good company</h2></div>' +
      sponsorsMarquee(content, true) +
      '<div class="sponsors__cta reveal"><a href="partners.html" class="btn btn--solid">Meet the partners</a></div></section>';
  }

  function renderPage(content, pageKey) {
    const main = document.getElementById("page");
    if (!main) return;
    const composer = pages[pageKey] || pages.home;
    main.innerHTML = composer(content);
    /* post-render wiring that needs the DOM in place */
    fillSponsors(content);
  }

  window.Render = { renderPage: renderPage, pages: pages };
})();
