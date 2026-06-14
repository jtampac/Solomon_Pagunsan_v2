/* ===================================================================
   SOLOMON PAGUNSAN — SHARED COMPONENTS  (assets/js/components.js)
   Header (nav) + footer are built here once and injected into every
   page, so the navigation only ever needs to be edited in one file.
   Contact is a normal nav link — same styling as every other item.
=================================================================== */
(function () {
  "use strict";

  /* The single navigation definition used site-wide. */
  const NAV = [
    { label: "Home",          href: "index.html",         key: "home" },
    { label: "About",         href: "about.html",         key: "about" },
    { label: "Farm Learning", href: "farm-learning.html", key: "farm-learning" },
    { label: "Vlogs",         href: "vlogs.html",         key: "vlogs" },
    { label: "Gallery",       href: "gallery.html",       key: "gallery" },
    { label: "Partners",      href: "partners.html",      key: "partners" },
    { label: "Press",         href: "press.html",         key: "press" },
    { label: "Contact",       href: "contact.html",       key: "contact" }
  ];

  /* Footer quick links (a trimmed subset). */
  const FOOTER_NAV = ["about", "farm-learning", "vlogs", "gallery", "partners", "press", "contact"];

  function headerHTML(active) {
    const links = NAV.map(function (n) {
      const cur = n.key === active ? ' aria-current="page" class="is-active"' : "";
      return '<a href="' + n.href + '"' + cur + ">" + n.label + "</a>";
    }).join("\n      ");

    return '' +
      '<div class="nav__inner">' +
        '<a href="index.html" class="nav__brand">' +
          '<span class="nav__mark">SP</span>' +
          '<span class="nav__name">Solomon&nbsp;Pagunsan</span>' +
        '</a>' +
        '<nav class="nav__links" id="navLinks" aria-label="Primary">' +
          links +
        '</nav>' +
        '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>';
  }

  function footerHTML(content) {
    const labels = {
      "about": "Story", "farm-learning": "Farm Learning", "vlogs": "Vlogs",
      "gallery": "Gallery", "partners": "Partners", "press": "Press", "contact": "Contact"
    };
    const map = {
      "about": "about.html", "farm-learning": "farm-learning.html", "vlogs": "vlogs.html",
      "gallery": "gallery.html", "partners": "partners.html", "press": "press.html", "contact": "contact.html"
    };
    const navLinks = FOOTER_NAV.map(function (k) {
      return '<a href="' + map[k] + '">' + labels[k] + "</a>";
    }).join("");

    const blurb = (content && content.site && content.site.footerBlurb) || "";

    return '' +
      '<div class="footer__inner">' +
        '<div class="footer__brand">' +
          '<span class="footer__mark">Solomon Pagunsan</span>' +
          "<p>" + blurb + "</p>" +
        '</div>' +
        '<div class="footer__nav">' + navLinks + '</div>' +
        '<div class="footer__social" id="footerSocial"></div>' +
      '</div>' +
      '<div class="footer__base">' +
        "<span>&copy; <span id=\"year\"></span> Solomon Pagunsan. All rights reserved.</span>" +
        "<span>Made on the farm.</span>" +
      '</div>';
  }

  /* Wire footer social icons from content.social. */
  function mountFooterSocial(content) {
    const fs = document.getElementById("footerSocial");
    if (!fs || !content.social) return;
    const social = content.social;
    const mailto = social.email ? "mailto:" + social.email : "";
    const icons = [
      ["facebook", "f"], ["youtube", "\u25B6"], ["tiktok", "\u266B"],
      ["instagram", "\u25C9"], ["messenger", "\u2709"], ["email", "@"]
    ];
    icons.forEach(function (pair) {
      const key = pair[0], glyph = pair[1];
      let url = key === "email" ? mailto : social[key];
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      if (key !== "email") { a.target = "_blank"; a.rel = "noopener"; }
      a.setAttribute("aria-label", key);
      a.textContent = glyph;
      fs.appendChild(a);
    });
    const yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* Inject header + footer into their placeholders. */
  function mount(content, activeKey) {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (header) {
      header.className = "nav";
      header.id = "nav";
      header.innerHTML = headerHTML(activeKey);
    }
    if (footer) {
      footer.className = "footer";
      footer.innerHTML = footerHTML(content);
    }
    mountFooterSocial(content);
  }

  window.Components = { mount: mount, NAV: NAV };
})();
