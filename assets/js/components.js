/* ===================================================================
   SOLOMON PAGUNSAN — SHARED COMPONENTS  (assets/js/components.js)
   Header (nav) + footer are injected into every page so navigation is
   edited in one place. All nav items use identical styling (Contact is
   a normal link — no special button).
=================================================================== */
(function () {
  "use strict";

  const NAV = [
    { label: "Home",                 href: "index.html",         key: "home" },
    { label: "About",                href: "about.html",         key: "about" },
    { label: "The Farm",             href: "farm.html",          key: "farm" },
    { label: "The Captain of Negros",href: "captain.html",       key: "captain" },
    { label: "Workshop",             href: "workshop.html",      key: "workshop" },
    { label: "Farm Learning",        href: "farm-learning.html", key: "farm-learning" },
    { label: "Products",             href: "products.html",      key: "products" },
    { label: "Vlogs",                href: "vlogs.html",          key: "vlogs" },
    { label: "Gallery",              href: "gallery.html",        key: "gallery" },
    { label: "Partners",             href: "partners.html",       key: "partners" },
    { label: "Press",                href: "press.html",          key: "press" },
    { label: "Contact",              href: "contact.html",        key: "contact" }
  ];

  const FOOTER_NAV = [
    { key: "about",         href: "about.html",         label: "About" },
    { key: "farm",          href: "farm.html",          label: "The Farm" },
    { key: "captain",       href: "captain.html",       label: "The Captain" },
    { key: "workshop",      href: "workshop.html",      label: "Workshop" },
    { key: "farm-learning", href: "farm-learning.html", label: "Farm Learning" },
    { key: "products",      href: "products.html",      label: "Products" },
    { key: "vlogs",         href: "vlogs.html",         label: "Vlogs" },
    { key: "gallery",       href: "gallery.html",       label: "Gallery" },
    { key: "partners",      href: "partners.html",      label: "Partners" },
    { key: "press",         href: "press.html",         label: "Press" },
    { key: "contact",       href: "contact.html",       label: "Contact" }
  ];

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
        '<nav class="nav__links" id="navLinks" aria-label="Primary">' + links + '</nav>' +
        '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>';
  }

  function footerHTML(content) {
    const navLinks = FOOTER_NAV.map(function (n) {
      return '<a href="' + n.href + '">' + n.label + "</a>";
    }).join("");
    const blurb = (content && content.site && content.site.footerBlurb) || "";
    return '' +
      '<div class="footer__inner">' +
        '<div class="footer__brand"><span class="footer__mark">Solomon Pagunsan</span><p>' + blurb + '</p></div>' +
        '<div class="footer__nav">' + navLinks + '</div>' +
        '<div class="footer__social" id="footerSocial"></div>' +
      '</div>' +
      '<div class="footer__base">' +
        "<span>&copy; <span id=\"year\"></span> Solomon Pagunsan. All rights reserved.</span>" +
        "<span>Made on the farm.</span>" +
      '</div>';
  }

  function mountFooterSocial(content) {
    const fs = document.getElementById("footerSocial");
    if (!fs || !content.social) return;
    const social = content.social;
    const mailto = social.email ? "mailto:" + social.email : "";
    const icons = [["facebook","f"],["youtube","\u25B6"],["tiktok","\u266B"],["instagram","\u25C9"],["messenger","\u2709"],["email","@"]];
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

  function mount(content, activeKey) {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (header) { header.className = "nav"; header.id = "nav"; header.innerHTML = headerHTML(activeKey); }
    if (footer) { footer.className = "footer"; footer.innerHTML = footerHTML(content); }
    mountFooterSocial(content);
  }

  window.Components = { mount: mount, NAV: NAV };
})();
