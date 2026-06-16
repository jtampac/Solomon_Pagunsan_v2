/* ===================================================================
   SOLOMON PAGUNSAN — RENDER ENGINE  (assets/js/render.js)
   Builds each page's sections from the content store. Markup mirrors
   the original design so the stylesheet applies; new sections (Captain,
   Products, categorized Gallery/Vlogs, contact form) add their own
   classes, styled in style.css.
=================================================================== */
(function () {
  "use strict";

  /* ---------------------------- helpers --------------------------- */
  function bgStyle(url, fallback) {
    if (url && url.trim()) return 'style="background-image:url(\'' + url + '\')"';
    if (fallback) return 'style="background-image:' + fallback + '"';
    return "";
  }
  function ytId(url) {
    if (!url) return "";
    var m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function socialFor(content, key) {
    var s = content.social || {};
    if (key === "email") return s.email ? "mailto:" + s.email : "#";
    return s[key] || "#";
  }
  function esc(s) { return String(s == null ? "" : s).replace(/"/g, "&quot;"); }
  function head(kicker, title, sub, light) {
    var l = light ? " kicker--light" : "", lt = light ? " section-title--light" : "", ls = light ? " section-sub--light" : "";
    return '<div class="section-head">' +
      (kicker ? '<p class="kicker' + l + ' reveal">' + kicker + '</p>' : "") +
      '<h2 class="section-title' + lt + ' reveal">' + (title || "") + '</h2>' +
      (sub ? '<p class="section-sub' + ls + ' reveal">' + sub + '</p>' : "") +
      '</div>';
  }
  /* a slim page banner for inner pages (solid header sits above it) */
  function pageBanner(kicker, title, sub) {
    return '<section class="page-banner">' +
      '<div class="page-banner__inner">' +
        '<p class="kicker reveal">' + (kicker || "") + '</p>' +
        '<h1 class="page-banner__title reveal">' + (title || "") + '</h1>' +
        (sub ? '<p class="page-banner__sub reveal">' + sub + '</p>' : "") +
      '</div></section>';
  }

  /* ============================ HERO (home) ====================== */
  function hero(content) {
    var h = content.hero || {};
    return '<section class="hero" id="hero">' +
      '<div class="hero__media" id="heroMedia" ' + bgStyle(h.image, null) + '></div>' +
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
      '</div></section>';
  }

  function stats(content) {
    var items = (content.stats || []).map(function (s) {
      return '<div class="stat reveal"><span class="stat__num" data-count="' + s.num + '">' + s.num + '</span>' +
        '<span class="stat__unit">' + s.unit + '</span><span class="stat__label">' + s.label + '</span></div>';
    }).join("");
    return '<section class="stats"><div class="stats__inner">' + items + '</div></section>';
  }

  function announcements(content) {
    var items = (content.announcements || []).filter(function (a) { return a.active !== false; });
    if (!items.length) return "";
    var cards = items.map(function (a) {
      return '<article class="announce reveal"><span class="announce__date">' + (a.date || "") + '</span>' +
        '<h3 class="announce__title">' + (a.title || "") + '</h3><p class="announce__body">' + (a.body || "") + '</p></article>';
    }).join("");
    return '<section class="announce-sec" id="announcements">' +
      '<div class="announce-sec__head"><p class="kicker reveal">Latest</p>' +
      '<h2 class="section-title reveal">Announcements</h2></div>' +
      '<div class="announce__grid">' + cards + '</div></section>';
  }

  function teasers(content) {
    var items = (content.homeTeasers || []).map(function (t, i) {
      return '<a class="teaser reveal" href="' + t.href + '"><span class="teaser__index">0' + (i + 1) + '</span>' +
        '<h3 class="teaser__title">' + t.title + '</h3><p class="teaser__text">' + t.text + '</p>' +
        '<span class="teaser__link">' + (t.linkLabel || "Explore") + ' &rarr;</span></a>';
    }).join("");
    return '<section class="teasers" id="explore"><div class="teasers__head"><p class="kicker reveal">Explore</p>' +
      '<h2 class="section-title reveal">Inside the farm</h2></div>' +
      '<div class="teasers__grid">' + items + '</div></section>';
  }

  /* ===================== SPONSORS MARQUEE ======================== */
  function sponsorsMarquee(content, compact) {
    return '<div class="sponsors__marquee reveal" id="sponsorsMarquee" aria-label="Partner and sponsor logos">' +
      '<div class="sponsors__track' + (compact ? " sponsors__track--compact" : "") + '" id="sponsorsTrack"></div></div>';
  }
  function fillSponsors(content) {
    var track = document.getElementById("sponsorsTrack");
    var sponsors = (content.partners && content.partners.sponsors) || [];
    if (!track || !sponsors.length) return;
    var buildItem = function (s) {
      var isLink = s.url && s.url.trim();
      var elx = document.createElement(isLink ? "a" : "div");
      elx.className = "sponsor";
      if (isLink) { elx.href = s.url; elx.target = "_blank"; elx.rel = "noopener"; }
      if (s.logo && s.logo.trim()) {
        elx.innerHTML = '<img src="' + s.logo + '" alt="' + esc(s.name) + '" loading="lazy" decoding="async" ' +
          "onerror=\"this.parentNode.classList.add('sponsor--ph');this.outerHTML='<span class=\\'sponsor__name\\'>" + esc(s.name) + "</span>'\">";
      } else { elx.classList.add("sponsor--ph"); elx.innerHTML = '<span class="sponsor__name">' + esc(s.name) + '</span>'; }
      return elx;
    };
    var sets = Math.max(2, Math.ceil((window.innerWidth * 2) / (sponsors.length * 220)) * 2);
    for (var r = 0; r < sets; r++) sponsors.forEach(function (s) { track.appendChild(buildItem(s)); });
    track.style.animationDuration = Math.max(24, sponsors.length * sets * 2.4) + "s";
  }
  function partnersStrip(content) {
    var sponsors = (content.partners && content.partners.sponsors) || [];
    if (!sponsors.length) return "";
    return '<section class="sponsors sponsors--strip" id="partners-strip">' +
      '<div class="sponsors__head sponsors__head--mini"><p class="kicker reveal">Partners &amp; Sponsors</p>' +
      '<h2 class="section-title reveal">Backed by good company</h2></div>' +
      sponsorsMarquee(content, true) +
      '<div class="sponsors__cta reveal"><a href="partners.html" class="btn btn--solid">Meet the partners</a></div></section>';
  }

  function contactCta(content) {
    return '<section class="cta-band reveal"><div class="cta-band__inner">' +
      '<p class="cta-band__text">Fellow farmer, buyer, student, or brand &mdash; reach out.</p>' +
      '<a href="contact.html" class="btn btn--gold">Get in touch</a></div></section>';
  }

  /* ============================ ABOUT ============================ */
  function aboutStory(content) {
    var a = content.about || {};
    var paras = (a.paragraphs || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    var timeline = (a.timeline || []).map(function (t) {
      return '<li class="timeline__item reveal"><span class="timeline__year">' + t.year + '</span>' +
        '<div class="timeline__card"><h3>' + t.heading + '</h3><p>' + t.text + '</p></div></li>';
    }).join("");
    var q = a.quote || {};
    var values = (a.values || []).map(function (v) {
      return '<article class="value-card reveal"><h3>' + v.title + '</h3><p>' + v.text + '</p></article>';
    }).join("");
    var philo = (a.philosophy || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    return pageBanner(a.kicker, a.title, "") +
      '<section class="about" id="about"><div class="about__body">' +
        '<div class="about__lead reveal">' + paras + '</div>' +
        '<ol class="timeline">' + timeline + '</ol>' +
        '<figure class="pullquote reveal"><blockquote>' + (q.text || "") + '</blockquote>' +
        '<figcaption>' + (q.attribution || "") + '</figcaption></figure>' +
      '</div></section>' +
      (values ? '<section class="values"><div class="values__head">' + head("What he stands by", "Values & philosophy", "") + '</div>' +
        '<div class="values__grid">' + values + '</div></section>' : "") +
      (philo ? '<section class="philosophy reveal"><div class="philosophy__inner">' +
        '<h2 class="section-title">' + (a.philosophyTitle || "") + '</h2>' + philo + '</div></section>' : "");
  }

  /* ===================== THE CAPTAIN OF NEGROS =================== */
  function captainPage(content) {
    var c = content.captain || {};
    var pillars = (c.pillars || []).map(function (p, i) {
      return '<article class="pillar reveal"><span class="pillar__index">0' + (i + 1) + '</span>' +
        '<h3>' + p.title + '</h3><p>' + p.text + '</p></article>';
    }).join("");
    var persona = c.persona || {};
    var tags = (persona.tags || []).map(function (t) { return "<li>" + t + "</li>"; }).join("");
    var q = c.quote || {};
    return '<section class="cap-hero" id="captain-hero">' +
        '<div class="cap-hero__media" ' + bgStyle(c.image, "linear-gradient(160deg,var(--green-800),var(--soil))") + '></div>' +
        '<div class="cap-hero__scrim"></div>' +
        '<div class="cap-hero__content">' +
          '<p class="kicker kicker--light reveal">' + (c.kicker || "") + '</p>' +
          '<h1 class="cap-hero__title reveal">' + (c.title || "") + '</h1>' +
          '<p class="cap-hero__lead reveal">' + (c.lead || "") + '</p>' +
        '</div></section>' +
      '<section class="cap-pillars">' + head("Why the name stuck", "A farmer people follow", "") +
        '<div class="cap-pillars__grid">' + pillars + '</div></section>' +
      (q.text ? '<section class="cap-quote reveal"><blockquote>' + q.text + '</blockquote><cite>' + (q.attribution || "") + '</cite></section>' : "") +
      /* persona / Captain Jack Sparrow block reuses the .captain styling */
      '<section class="captain" id="persona"><div class="captain__media" ' + bgStyle(persona.image, null) + '></div>' +
        '<div class="captain__scrim"></div><div class="captain__content"><div class="captain__left">' +
          '<p class="kicker kicker--light reveal">' + (persona.kicker || "") + '</p>' +
          '<h2 class="section-title section-title--light reveal">' + (persona.title || "") + '</h2>' +
          '<p class="captain__text reveal">' + (persona.text || "") + '</p>' +
          '<ul class="captain__list reveal">' + tags + '</ul>' +
          '<a href="contact.html" class="btn btn--gold reveal">' + (c.ctaLabel || "Book an appearance") + '</a>' +
        '</div>' +
        '<figure class="captain__photo reveal"><img src="' + (persona.image || "") + '" alt="Solomon Pagunsan as Captain Jack Sparrow" loading="lazy" decoding="async"></figure>' +
      '</div></section>';
  }

  /* ============================ THE FARM ========================= */
  function cropCards(items) {
    return (items || []).map(function (c, i) {
      return '<article class="farm-card reveal' + (c.wide ? " farm-card--wide" : "") + '">' +
        '<div class="farm-card__media" ' + bgStyle(c.img, "linear-gradient(155deg,var(--green-700),var(--cane))") + '></div>' +
        '<div class="farm-card__body"><span class="farm-card__index">0' + (i + 1) + '</span>' +
        '<h3>' + c.name + '</h3><p>' + c.text + '</p></div></article>';
    }).join("");
  }
  function animalCards(content, items) {
    var inquire = socialFor(content, "messenger") !== "#" ? socialFor(content, "messenger") : socialFor(content, "facebook");
    return (items || []).map(function (a) {
      return '<article class="animal reveal"><div class="animal__media" ' + bgStyle(a.img, "linear-gradient(160deg,var(--cane),var(--green-700))") + '></div>' +
        '<div class="animal__body"><h3>' + a.name + '</h3><p>' + a.text + '</p>' +
        '<a class="animal__inquire" href="' + inquire + '" target="_blank" rel="noopener">Inquire</a></div></article>';
    }).join("");
  }
  function farmPage(content) {
    var f = content.farm || {};
    var cr = f.crops || {}, lv = f.livestock || {};
    return pageBanner(f.kicker, f.title, f.sub) +
      '<section class="farm" id="farm">' + head(cr.kicker, cr.title, cr.sub) +
        '<div class="farm__grid" id="farmGrid">' + cropCards(cr.items) + '</div></section>' +
      '<section class="livestock" id="livestock">' + head(lv.kicker, lv.title, lv.sub) +
        '<div class="livestock__grid" id="livestockGrid">' + animalCards(content, lv.items) + '</div></section>';
  }

  /* ============================ WORKSHOP ========================= */
  function workshopPage(content) {
    var w = content.workshop || {};
    var cells = (w.items || []).map(function (inv) {
      var clickable = inv.img ? ' data-lightbox-img="' + inv.img + '"' : "";
      return '<div class="invent reveal' + (inv.tall ? " invent--tall" : "") + '"' + clickable + '>' +
        '<div class="invent__media" ' + bgStyle(inv.img, "linear-gradient(160deg,#5a4327,#2c2014)") + '></div>' +
        '<div class="invent__label"><h3>' + inv.name + '</h3><span>' + inv.note + '</span></div></div>';
    }).join("");
    return '<section class="workshop workshop--page" id="workshop">' +
      '<div class="workshop__intro">' + head(w.kicker, w.title, w.sub, true) + '</div>' +
      '<div class="workshop__gallery" id="workshopGallery">' + cells + '</div></section>';
  }

  /* ========================= FARM LEARNING ====================== */
  function farmLearningPage(content) {
    var v = content.farmLearning || {};
    var points = (v.points || []).map(function (p, i) {
      return '<article class="visit-card reveal"><span class="visit-card__index">0' + (i + 1) + '</span>' +
        '<h3>' + p.heading + '</h3><p>' + p.text + '</p></article>';
    }).join("");
    var modes = (v.modes || []).map(function (m) {
      return '<article class="mode-card reveal"><h3>' + m.title + '</h3><p>' + m.text + '</p></article>';
    }).join("");
    var gal = (v.gallery || []).filter(function (s) { return s && s.trim(); }).map(function (src, i) {
      return '<div class="learn-gallery__item reveal" data-lightbox-img="' + src + '">' +
        '<img src="' + src + '" alt="Student visit photo ' + (i + 1) + '" loading="lazy" decoding="async"></div>';
    }).join("");
    return '<section class="visits" id="student-visits"><div class="visits__top">' +
        '<div class="visits__intro reveal"><p class="kicker">' + (v.kicker || "Farm Learning") + '</p>' +
          '<h1 class="section-title">' + (v.title || "") + '</h1>' +
          '<p class="visits__lede">' + (v.intro || "") + '</p>' +
          '<a href="contact.html" class="btn btn--solid">' + (v.ctaLabel || "Arrange a student visit") + '</a></div>' +
        '<figure class="visits__photo reveal" ' + bgStyle(v.image, "linear-gradient(160deg,var(--green-700),var(--cane))") + '></figure>' +
      '</div>' +
      '<div class="visits__cards">' + points + '</div>' +
      (modes ? '<div class="learn-modes">' + head("How it works", "Ways students learn here", "") +
        '<div class="learn-modes__grid">' + modes + '</div></div>' : "") +
      (gal ? '<div class="learn-gallery">' + gal + '</div>' : "") +
      '</section>';
  }

  /* ============================ PRODUCTS ========================= */
  function productsPage(content) {
    var p = content.products || {};
    var cards = (p.items || []).map(function (it) {
      var inquire = socialFor(content, "messenger") !== "#" ? socialFor(content, "messenger") : "contact.html";
      return '<article class="product reveal">' +
        '<div class="product__media" ' + bgStyle(it.img, "linear-gradient(155deg,var(--green-700),var(--cane))") + '>' +
        (it.category ? '<span class="product__tag">' + it.category + '</span>' : "") + '</div>' +
        '<div class="product__body"><h3>' + it.name + '</h3><p>' + it.desc + '</p>' +
        '<a class="product__inquire" href="' + inquire + '" target="_blank" rel="noopener">' + (p.ctaLabel || "Inquire") + ' &rarr;</a></div></article>';
    }).join("");
    return pageBanner(p.kicker, p.title, p.intro) +
      '<section class="products" id="products">' +
        '<div class="products__note reveal"><p>' + (p.deliveryNote || "") + '</p></div>' +
        '<div class="products__grid">' + cards + '</div>' +
        '<p class="products__disclaim reveal">' + (p.note || "") + '</p>' +
        '<div class="products__cta reveal"><a href="contact.html" class="btn btn--solid">' + (p.ctaLabel || "Send an inquiry") + '</a></div>' +
      '</section>';
  }

  /* ============================ VLOGS =========================== */
  function vlogsPage(content) {
    var v = content.vlogs || {};
    var items = v.items || [];
    var cats = (v.categories && v.categories.length) ? v.categories : null;
    function card(item) {
      var id = ytId(item.url);
      var thumb = id ? "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg" : "";
      return '<article class="video-card reveal" data-yt="' + id + '" data-fallback="' + socialFor(content, "youtube") + '">' +
        '<div class="video-card__thumb" ' + (thumb ? "style=\"background-image:url('" + thumb + "')\"" : "") + '>' +
        '<div class="video-card__play"><i></i></div></div>' +
        '<div class="video-card__body"><h3>' + item.title + '</h3><p>' + item.desc + '</p></div></article>';
    }
    var body;
    if (cats) {
      body = cats.map(function (cat) {
        var inCat = items.filter(function (it) { return (it.category || "") === cat; });
        if (!inCat.length) return "";
        return '<div class="videos__cat"><h3 class="videos__cat-title reveal">' + cat + '</h3>' +
          '<div class="videos__grid">' + inCat.map(card).join("") + '</div></div>';
      }).join("");
    } else {
      body = '<div class="videos__grid">' + items.map(card).join("") + '</div>';
    }
    return pageBanner(v.kicker, v.title, v.sub) +
      '<section class="videos" id="videos">' + body +
      '<div class="videos__cta reveal"><a href="' + socialFor(content, "youtube") + '" class="btn btn--solid" target="_blank" rel="noopener">Subscribe to the channel</a></div></section>';
  }

  /* =========================== GALLERY ========================== */
  function galleryPage(content) {
    var g = content.gallery || {};
    var items = g.items || [];
    var cats = (g.categories && g.categories.length) ? g.categories : null;
    function tile(it, i) {
      var src = it.src || it;
      if (src && src.trim())
        return '<div class="gallery__item reveal" data-lightbox-img="' + src + '">' +
          '<img src="' + src + '" alt="' + esc(it.caption || ("Farm photo " + (i + 1))) + '" loading="lazy" decoding="async">' +
          (it.caption ? '<span class="gallery__cap">' + it.caption + '</span>' : "") + '</div>';
      return '<div class="gallery__item reveal"><div class="ph">Photo ' + (i + 1) + '</div></div>';
    }
    var filters = cats ? '<div class="gallery__filters" id="galleryFilters">' +
      '<button class="gallery__filter is-active" data-filter="all">All</button>' +
      cats.map(function (c) { return '<button class="gallery__filter" data-filter="' + esc(c) + '">' + c + '</button>'; }).join("") +
      '</div>' : "";
    var tiles = items.map(function (it, i) {
      var cat = it.category || "";
      return '<div class="gallery__cell" data-cat="' + esc(cat) + '">' + tile(it, i) + '</div>';
    }).join("");
    return pageBanner(g.kicker, g.title, "") +
      '<section class="gallery" id="gallery">' + filters +
      '<div class="gallery__masonry" id="galleryMasonry">' + tiles + '</div></section>';
  }

  /* ========================== PARTNERS ========================== */
  function partnersPage(content) {
    var p = content.partners || {};
    var supporters = (p.supporters || []).map(function (s) {
      return '<article class="supporter reveal"><h3>' + s.name + '</h3><p>' + s.text + '</p></article>';
    }).join("");
    return pageBanner(p.kicker, p.title, p.sub) +
      '<section class="sponsors" id="partners">' + sponsorsMarquee(content, false) +
        (supporters ? '<div class="supporters">' + head("Also in our corner", "Supporters & organizations", "") +
          '<div class="supporters__grid">' + supporters + '</div></div>' : "") +
        '<div class="sponsors__cta reveal"><p class="sponsors__cta-text">Interested in working with Solomon?</p>' +
        '<a href="contact.html" class="btn btn--solid">' + (p.ctaLabel || "Become a Partner") + '</a></div></section>';
  }

  /* ============================ PRESS =========================== */
  function pressPage(content) {
    var p = content.press || {};
    var items = (p.items || []).map(function (a) {
      return '<a class="press reveal" href="' + a.url + '" target="_blank" rel="noopener">' +
        '<span class="press__outlet">' + a.outlet + '</span><h3 class="press__title">' + a.title + '</h3>' +
        '<span class="press__meta">' + a.meta + '</span><span class="press__read">Read the feature &rarr;</span></a>';
    }).join("");
    var ach = (p.achievements || []).map(function (a) {
      return '<div class="achievement reveal"><h3>' + a.title + '</h3><p>' + a.text + '</p></div>';
    }).join("");
    return pageBanner(p.kicker, p.title, "") +
      '<section class="media" id="media"><div class="media__grid" id="mediaGrid">' + items + '</div>' +
      (ach ? '<div class="achievements">' + ach + '</div>' : "") + '</section>';
  }

  /* =========================== CONTACT ========================== */
  function contactPage(content) {
    var c = content.contact || {};
    var glyphs = { facebook: "f", messenger: "\u2709", youtube: "\u25B6", tiktok: "\u266A", instagram: "\u25C9", whatsapp: "\u260E", email: "@" };
    var channels = (c.channels || []).map(function (ch) {
      var href = socialFor(content, ch.key), external = ch.key !== "email";
      return '<a class="contact__channel" href="' + href + '"' + (external ? ' target="_blank" rel="noopener"' : "") + '>' +
        '<span class="contact__icon">' + (glyphs[ch.key] || "\u2022") + '</span>' +
        '<span class="contact__meta"><strong>' + ch.label + '</strong><em>' + ch.blurb + '</em></span>' +
        '<span class="contact__arrow">&rarr;</span></a>';
    }).join("");
    var loc = c.location || {};
    var locBlock = loc.text ? '<div class="contact__location"><span class="contact__icon">\u25C9</span>' +
      '<span class="contact__meta"><strong>' + (loc.label || "Location") + '</strong><em>' + loc.text + '</em></span></div>' : "";
    /* simple inquiry form — builds a mailto/messenger message, no backend */
    var form = '<form class="inquiry" id="inquiryForm" novalidate>' +
      '<div class="inquiry__row"><label>Name<input type="text" name="name" required></label>' +
      '<label>Email<input type="email" name="email" required></label></div>' +
      '<label>Subject<input type="text" name="subject"></label>' +
      '<label>Message<textarea name="message" rows="5" required></textarea></label>' +
      '<button type="submit" class="btn btn--solid">Send inquiry</button>' +
      '<p class="inquiry__note">' + (c.formNote || "") + '</p></form>';
    return pageBanner(c.kicker, c.title, "") +
      '<section class="contact contact--page" id="contact"><div class="contact__inner">' +
        '<div class="contact__left reveal"><p class="contact__text">' + (c.text || "") + '</p>' +
          '<div class="contact__channels">' + channels + locBlock + '</div></div>' +
        '<div class="contact__right reveal">' + form + '</div>' +
      '</div></section>';
  }

  /* ===================== PAGE COMPOSERS ========================= */
  var pages = {
    home: function (c) { return hero(c) + stats(c) + announcements(c) + teasers(c) + partnersStrip(c) + contactCta(c); },
    about: function (c) { return aboutStory(c); },
    captain: function (c) { return captainPage(c); },
    farm: function (c) { return farmPage(c); },
    workshop: function (c) { return workshopPage(c); },
    "farm-learning": function (c) { return farmLearningPage(c); },
    products: function (c) { return productsPage(c); },
    vlogs: function (c) { return vlogsPage(c); },
    gallery: function (c) { return galleryPage(c); },
    partners: function (c) { return partnersPage(c); },
    press: function (c) { return pressPage(c); },
    contact: function (c) { return contactPage(c); }
  };

  function renderPage(content, pageKey) {
    var main = document.getElementById("page");
    if (!main) return;
    var composer = pages[pageKey] || pages.home;
    main.innerHTML = composer(content);
    fillSponsors(content);
  }

  window.Render = { renderPage: renderPage, pages: pages };
})();
