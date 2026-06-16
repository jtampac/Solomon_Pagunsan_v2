/* ===================================================================
   SOLOMON PAGUNSAN — CONTENT LOADER  (assets/js/content.js)
   -------------------------------------------------------------------
   The website reads ALL of its content from one place so it can be
   edited without touching markup. Resolution order:

     1. Admin draft saved in this browser (localStorage) — lets the
        owner preview unsaved edits made in the Admin panel.
     2. data/content.json — the canonical, published content store.
        This is the file the Admin panel exports, and the one you would
        later replace with a Supabase / Firebase query (see README).
     3. EMBEDDED_FALLBACK below — an exact mirror of content.json so the
        site still renders if opened directly from disk (file://) where
        fetch() is blocked. Generated from content.json at build time;
        content.json remains the single source of truth.

   FUTURE BACKEND (Supabase / Firebase):
     Replace the fetch() in fetchPublished() with your query, e.g.
       const { data } = await supabase.from('content').select('*').single();
       return data.body;
     Nothing else on the public site needs to change.
=================================================================== */
(function () {
  "use strict";

  const DRAFT_KEY = "sp_content_draft";

  const EMBEDDED_FALLBACK = {
  "site": {
    "name": "Solomon Pagunsan",
    "shortMark": "SP",
    "location": "Bayawan City • Negros Oriental • Philippines",
    "footerBlurb": "Sugarcane farmer, inventor, and content creator from Bayawan City, Negros Oriental, Philippines."
  },
  "social": {
    "facebook": "https://www.facebook.com/solomon.pagunsan/",
    "messenger": "https://m.me/solomon.pagunsan",
    "youtube": "https://www.youtube.com/channel/UC9pCuD1xPVJnRhNmfoKoAug",
    "tiktok": "https://www.tiktok.com/@solomon.pagunsan",
    "instagram": "https://www.instagram.com/solomonpagunsan/",
    "whatsapp": "https://wa.me/63XXXXXXXXXX",
    "email": "hello@solomonpagunsan.com"
  },
  "hero": {
    "eyebrow": "Bayawan City • Negros Oriental • Philippines",
    "titleLine1": "Solomon",
    "titleLine2": "Pagunsan",
    "tagline": "Farmer • Inventor • Entrepreneur • Content Creator",
    "lede": "He left the province chasing opportunity in the city. He came home and built it from the soil — one harvest at a time.",
    "image": "images/sugarcane-field.jpg",
    "primaryCta": {
      "label": "Explore the Farm",
      "href": "farm.html"
    },
    "secondaryCta": {
      "label": "Watch the Vlogs",
      "href": "vlogs.html"
    }
  },
  "stats": [
    {
      "num": 20,
      "unit": "hectares",
      "label": "Land under cultivation"
    },
    {
      "num": 400,
      "unit": "tons",
      "label": "Sugarcane harvested yearly"
    },
    {
      "num": 32,
      "unit": "years",
      "label": "In the fields since age 7"
    },
    {
      "num": 10,
      "unit": "years",
      "label": "Working abroad before the farm"
    }
  ],
  "announcements": [
    {
      "title": "Farm visits open for agriculture students",
      "body": "Solomon regularly welcomes student groups to observe practical farming on the land. Message ahead to arrange a visit.",
      "date": "2026",
      "active": true
    },
    {
      "title": "New vlogs every week",
      "body": "Follow along on Facebook, YouTube, and TikTok for honest documentation of life on a Negros farm.",
      "date": "2026",
      "active": true
    }
  ],
  "homeTeasers": [
    {
      "title": "The Farm",
      "text": "Sugarcane, cassava, corn, carabao and livestock — a complete working agricultural ecosystem.",
      "href": "farm.html",
      "linkLabel": "See the land"
    },
    {
      "title": "The Captain of Negros",
      "text": "How a self-taught farmer became one of the province's most followed and respected voices in practical agriculture.",
      "href": "captain.html",
      "linkLabel": "Read the story"
    },
    {
      "title": "Workshop",
      "text": "Tools built and modified by hand to solve real problems in the field.",
      "href": "workshop.html",
      "linkLabel": "Into the workshop"
    },
    {
      "title": "Farm Learning",
      "text": "A working farm that became a classroom for agriculture students.",
      "href": "farm-learning.html",
      "linkLabel": "Learn on the farm"
    },
    {
      "title": "Planting Materials & Tools",
      "text": "Field-proven cuttings, setts and tools Solomon uses and supplies nationwide.",
      "href": "products.html",
      "linkLabel": "View materials"
    },
    {
      "title": "Vlogs",
      "text": "Honest documentation of life and work on a Negros farm.",
      "href": "vlogs.html",
      "linkLabel": "Watch now"
    }
  ],
  "about": {
    "kicker": "The Story",
    "title": "From the city streets,<br/>back to the soil.",
    "paragraphs": [
      "Solomon Pagunsan has belonged to the land since he was seven years old, learning to plant beside his mother, Editha — the lone farmer in their family. The instinct never left him. Even as a young man rushing home from school, his heart was already in the field.",
      "For a decade he worked far from home as a tourist assistant at the Department of Foreign Affairs, serving alongside embassies from Korea, Japan, Taiwan, and China. But through every shift in the city, one thought kept returning: a life built on his own ground, growing something real.",
      "So he came home to Negros. He started over — first as a farm worker, then as an owner — and turned discipline, patience, and stubborn hope into one of the region's quiet success stories. Today he farms, builds his own tools, raises livestock, and shares it all with thousands who follow his work online."
    ],
    "timeline": [
      {
        "year": "Age 7",
        "heading": "Born to the land",
        "text": "Learns to plant from his mother, Editha. Farming becomes his first love — and his compass for everything that follows."
      },
      {
        "year": "10 yrs",
        "heading": "A decade in the city",
        "text": "Works as a tourist assistant at the DFA, serving embassies across Asia. He saves carefully — biking to work, bringing his own food — while dreaming of the farm."
      },
      {
        "year": "2017",
        "heading": "The return to Negros",
        "text": "He comes home to Bayawan with modest savings. The first attempt humbles him — but he refuses to quit, working two years as a sugarcane farm hand to learn the crop from the ground up."
      },
      {
        "year": "Today",
        "heading": "His own ground",
        "text": "Roughly 20 hectares under cultivation — sugarcane, corn, cassava and more — supported by livestock and a growing audience who learn from every harvest he documents."
      }
    ],
    "values": [
      {
        "title": "Work, not shortcuts",
        "text": "Real results come from showing up in the field every day, season after season."
      },
      {
        "title": "Knowledge is meant to be shared",
        "text": "What the land has taught him, he passes on freely to anyone willing to learn."
      },
      {
        "title": "Family and land first",
        "text": "The farm feeds a household and a community before it is ever a business."
      },
      {
        "title": "Solve it with your hands",
        "text": "When a tool or method doesn't fit the work, he builds or changes it until it does."
      }
    ],
    "philosophyTitle": "Practical knowledge, earned in the field",
    "philosophy": [
      "Solomon never attended college. Everything he knows about the land was learned by doing — planting, failing, adjusting, and trying again across decades of seasons.",
      "That hard-won, hands-on knowledge is exactly what makes his farm a place others now come to study."
    ],
    "familyNote": "[Editable placeholder] Add verified details about Solomon's family background and upbringing here.",
    "quote": {
      "text": "I left home chasing an opportunity. I returned home to build it.",
      "attribution": "— Solomon Pagunsan"
    }
  },
  "captain": {
    "kicker": "The Captain of Negros",
    "title": "The Captain of Negros",
    "lead": "Solomon Pagunsan is known across Negros not for a title he asked for, but for one the community gave him — a farmer people listen to, learn from, and look up to.",
    "image": "images/Solomon_1.jpg",
    "pillars": [
      {
        "title": "A journey of his own",
        "text": "He left the province to work abroad, then chose to come home and build something lasting from the soil — proof that a future can be grown, not just chased."
      },
      {
        "title": "Influence on local farmers",
        "text": "Neighbouring growers and young farmers follow his methods, adapt his ideas, and bring him their problems — and he answers, plainly and without holding back."
      },
      {
        "title": "Community impact",
        "text": "From fiestas to farm visits, he shows up for his community, lending knowledge, tools, planting materials, and encouragement to those starting out."
      },
      {
        "title": "Social media reach",
        "text": "Through honest farm vlogs and a memorable on-camera presence, his audience has grown far beyond Negros — carrying practical farming to thousands online."
      },
      {
        "title": "Recognition & reputation",
        "text": "His work has been featured by national outlets and recognised within the agricultural community (see the Press page for features)."
      },
      {
        "title": "Leadership in practical agriculture",
        "text": "He leads the way most respected by farmers — by example, in the field, with results anyone can walk over and see for themselves."
      }
    ],
    "reach": {
      "facebookFollowers": "",
      "youtubeSubscribers": "",
      "tiktokFollowers": "",
      "monthlyReach": "",
      "note": "Audience figures available on request — see Contact."
    },
    "persona": {
      "kicker": "Off the Clock",
      "title": "The Captain of Negros",
      "text": "When the harvest is in, a different character takes the stage. Known across Negros for his spot-on Captain Jack Sparrow, Solomon brings the costume, the swagger, and the comedy to fiestas, events, and appearances — proof that a farmer can command a crowd as easily as a field.",
      "tags": [
        "Character impersonation & cosplay",
        "Town fiestas & community events",
        "Stage performances & meet-and-greets",
        "Public appearances & collaborations"
      ],
      "image": "images/Solomon_1.jpg"
    },
    "quote": {
      "text": "I returned home to grow something real — and to bring others up with me.",
      "attribution": "— Solomon Pagunsan"
    },
    "ctaLabel": "Book an appearance"
  },
  "farm": {
    "kicker": "The Farm",
    "title": "A complete working farm",
    "sub": "Twenty hectares run as one connected system — the cash crop that pays, the food crops that sustain, and the animals that carry the family through the long seasons between harvests.",
    "crops": {
      "kicker": "The Farm",
      "title": "What grows on the land",
      "sub": "A working farm built on diversity — the cash crop that pays, and the everyday crops and animals that carry the family through the long seasons between harvests.",
      "items": [
        {
          "name": "Sugarcane Farming",
          "img": "images/Montage_1.jpg",
          "wide": true,
          "text": "The heart of the operation. Roughly 18 hectares of rented cane, harvested once a year and milled at the local central — the crop that turned a dream into a livelihood."
        },
        {
          "name": "Cassava Farming",
          "img": "images/Cassava.jpg",
          "wide": false,
          "text": "Hardy, low-maintenance, and reliable — cassava was one of the first crops Solomon planted when he started his own land."
        },
        {
          "name": "Corn Farming",
          "img": "images/corn-harvest.jpg",
          "wide": false,
          "text": "A dependable rotation crop that helps keep the soil and the cash flow working between the long sugarcane seasons."
        },
        {
          "name": "Livestock Raising",
          "img": "images/livestock-04.jpg",
          "wide": false,
          "text": "Pigs and chickens that bridge the gap between harvests, providing steady monthly income for the family."
        },
        {
          "name": "Carabao Farming",
          "img": "images/Carabao_Montage_.jpg",
          "wide": true,
          "text": "The Filipino farmer's truest partner. Raised, worked, and cared for on the land — and sold when the season calls for it."
        }
      ]
    },
    "livestock": {
      "kicker": "The Animals",
      "title": "Livestock & the in-between",
      "sub": "Between the once-a-year sugarcane harvests, the animals keep the farm alive. Interested in a sale or a visit? Send a message — every inquiry goes straight to Solomon.",
      "items": [
        {
          "name": "Pigs",
          "img": "images/livestock-02.jpg",
          "text": "Raised for sale roughly every four months. Inquire for availability and pricing."
        },
        {
          "name": "Chickens",
          "img": "images/farm-02.jpg",
          "text": "Free-range farm chickens — a steady part of the farm's monthly cycle."
        },
        {
          "name": "Carabao",
          "img": "images/carabao-team.jpg",
          "text": "Working water buffalo, occasionally available. Message to ask."
        },
        {
          "name": "Farm Animals",
          "img": "images/livestock-04.jpg",
          "text": "Other livestock raised on the farm from season to season."
        }
      ]
    }
  },
  "workshop": {
    "kicker": "Solomon's Workshop",
    "title": "Built by hand,<br/>for the field",
    "sub": "When the right tool doesn't exist or doesn't fit the work, Solomon fabricates and modifies his own. The workshop is where farming meets engineering — practical inventions sharpened by real days in the soil.",
    "items": [
      {
        "name": "Modified Spading Tools",
        "note": "Field-tested ergonomics",
        "img": "images/modified-spading.jpg",
        "tall": true
      },
      {
        "name": "Sugarcane Hand Tools",
        "note": "Made for the cane rows",
        "img": "images/workshop-01.jpg",
        "tall": false
      },
      {
        "name": "Equipment Modifications",
        "note": "Repaired & re-engineered",
        "img": "",
        "tall": false
      },
      {
        "name": "Fabrication Projects",
        "note": "Welding & metalwork",
        "img": "",
        "tall": false
      },
      {
        "name": "Agricultural Innovations",
        "note": "Practical farm solutions",
        "img": "",
        "tall": true
      }
    ]
  },
  "farmLearning": {
    "kicker": "Farm Learning",
    "title": "A farm that became a classroom",
    "intro": "Although Solomon Pagunsan did not attend college, his real-world farming experience has become a valuable learning resource for agriculture students. Many students visit his farm to observe practical farming techniques, gain field experience, and learn directly from his years of hands-on knowledge.",
    "points": [
      {
        "heading": "Practical techniques",
        "text": "Students watch real methods in action — land preparation, planting, crop care, and harvest — the way they actually happen on a working farm."
      },
      {
        "heading": "Field experience",
        "text": "Time on the land, not just in a lecture hall. Visitors see the full rhythm of the seasons and the day-to-day decisions a farmer makes."
      },
      {
        "heading": "Learning from experience",
        "text": "Decades of hands-on knowledge, shared directly. Solomon answers questions from the perspective of someone who built the operation himself."
      }
    ],
    "image": "images/farm-03.jpg",
    "modes": [
      {
        "title": "Educational tours",
        "text": "Guided walks through a real, working farm — not a demonstration plot."
      },
      {
        "title": "Practical demonstrations",
        "text": "Planting, tool use, and crop care shown the way they're actually done."
      },
      {
        "title": "Hands-on learning",
        "text": "Students work the methods themselves, with Solomon correcting in real time."
      },
      {
        "title": "Real-world experience",
        "text": "Field knowledge that textbooks can describe but rarely teach."
      }
    ],
    "gallery": [
      "images/farm-03.jpg",
      "images/farm-04.jpg",
      "images/farm-01.jpg"
    ],
    "ctaLabel": "Arrange a student visit"
  },
  "products": {
    "kicker": "Planting Materials & Tools",
    "title": "Planting Materials & Tools",
    "intro": "Solomon supplies selected planting materials and practical farming tools that are actively used in his own farm operations. Many farmers and customers have already purchased from him.",
    "deliveryNote": "Nationwide delivery available. Ordering is inquiry-based — message to confirm current availability, quantities, and shipping.",
    "items": [
      {
        "name": "Cassava Cuttings",
        "desc": "Healthy, field-proven cassava stem cuttings selected from the farm's own stand — ready for replanting.",
        "img": "images/Cassava.jpg",
        "category": "Planting Material"
      },
      {
        "name": "Napier Grass Cuttings",
        "desc": "Fast-growing Napier (elephant) grass planting material — a reliable, high-yield forage for livestock feed.",
        "img": "",
        "category": "Planting Material"
      },
      {
        "name": "Sugarcane Setts / Cuttings",
        "desc": "Quality sugarcane setts cut from mature, productive cane for establishing a strong new stand.",
        "img": "images/sugarcane-field.jpg",
        "category": "Planting Material"
      },
      {
        "name": "Modified Spading Tools",
        "desc": "Solomon's hand-modified spading tools — built, tested, and used on his own farm to last and to fit the work.",
        "img": "images/modified-spading.jpg",
        "category": "Tool"
      }
    ],
    "note": "Availability and pricing on request. This is an inquiry-based listing — there is no online checkout.",
    "ctaLabel": "Inquire about availability"
  },
  "vlogs": {
    "kicker": "Farmer Vlogger",
    "title": "Watch the farm work",
    "sub": "Honest documentation of life on a Negros farm — planting, harvesting, building, and raising animals. No filters, just the real work.",
    "categories": [
      "Featured",
      "Educational",
      "Farming Demonstrations",
      "Community"
    ],
    "items": [
      {
        "url": "https://www.youtube.com/watch?v=_8NPoL9fJNA",
        "title": "Sugarcane Harvest Season",
        "desc": "From standing cane to the milling central.",
        "category": "Featured"
      },
      {
        "url": "https://www.youtube.com/watch?v=X3Bd-vqOao0",
        "title": "A Day on the Farm",
        "desc": "Sunrise to sundown with the carabao.",
        "category": "Educational"
      },
      {
        "url": "https://www.youtube.com/watch?v=fU5zsyld4i8",
        "title": "Building Farm Tools",
        "desc": "Inside Solomon's workshop.",
        "category": "Educational"
      },
      {
        "url": "https://www.youtube.com/watch?v=RbGfI8n5xH8",
        "title": "Raising Pigs & Chickens",
        "desc": "How the in-between seasons get funded.",
        "category": "Farming Demonstrations"
      },
      {
        "url": "https://www.youtube.com/watch?v=PuO14QqvHOU",
        "title": "Planting Day",
        "desc": "Preparing the field for the next crop.",
        "category": "Farming Demonstrations"
      },
      {
        "url": "https://www.youtube.com/watch?v=Y5BuLfg6qJs",
        "title": "The Captain Appears",
        "desc": "A little fun after the harvest.",
        "category": "Community"
      }
    ]
  },
  "gallery": {
    "kicker": "Gallery",
    "title": "Life on the farm",
    "categories": [
      "Farm Life",
      "Crops",
      "Livestock",
      "Workshop",
      "Student Visits",
      "Community Activities"
    ],
    "items": [
      {
        "src": "images/hero-collage_1.jpg",
        "category": "Farm Life",
        "caption": ""
      },
      {
        "src": "images/hero-collage_2.jpg",
        "category": "Farm Life",
        "caption": ""
      },
      {
        "src": "images/hero-collage_3.jpg",
        "category": "Farm Life",
        "caption": ""
      },
      {
        "src": "images/hero-collage_4.jpg",
        "category": "Farm Life",
        "caption": ""
      },
      {
        "src": "images/hero-collage_5.jpg",
        "category": "Farm Life",
        "caption": ""
      },
      {
        "src": "images/Montage_1.jpg",
        "category": "Farm Life",
        "caption": ""
      },
      {
        "src": "images/sugarcane-field.jpg",
        "category": "Crops",
        "caption": ""
      },
      {
        "src": "images/Cassava.jpg",
        "category": "Crops",
        "caption": ""
      },
      {
        "src": "images/corn-harvest.jpg",
        "category": "Crops",
        "caption": ""
      },
      {
        "src": "images/farm-01.jpg",
        "category": "Crops",
        "caption": ""
      },
      {
        "src": "images/farm-02.jpg",
        "category": "Crops",
        "caption": ""
      },
      {
        "src": "images/livestock-01.jpg",
        "category": "Livestock",
        "caption": ""
      },
      {
        "src": "images/livestock-02.jpg",
        "category": "Livestock",
        "caption": ""
      },
      {
        "src": "images/livestock-03.jpg",
        "category": "Livestock",
        "caption": ""
      },
      {
        "src": "images/livestock-04.jpg",
        "category": "Livestock",
        "caption": ""
      },
      {
        "src": "images/carabao-team.jpg",
        "category": "Livestock",
        "caption": ""
      },
      {
        "src": "images/Carabao_Montage_.jpg",
        "category": "Livestock",
        "caption": ""
      },
      {
        "src": "images/workshop-01.jpg",
        "category": "Workshop",
        "caption": ""
      },
      {
        "src": "images/modified-spading.jpg",
        "category": "Workshop",
        "caption": ""
      },
      {
        "src": "images/farm-03.jpg",
        "category": "Student Visits",
        "caption": ""
      },
      {
        "src": "images/farm-04.jpg",
        "category": "Student Visits",
        "caption": ""
      },
      {
        "src": "images/farm-05.jpg",
        "category": "Community Activities",
        "caption": ""
      }
    ]
  },
  "partners": {
    "kicker": "Partnerships & Sponsors",
    "title": "Partners & Sponsors",
    "sub": "Brands, organizations, and businesses that support, supply, or collaborate with Solomon's farm and channel.",
    "sponsors": [
      {
        "name": "JI Telecom",
        "logo": "images/sponsors/JI_Telecom.png",
        "url": "https://www.jitelecom.ph/"
      },
      {
        "name": "Sponsor 2",
        "logo": "",
        "url": ""
      },
      {
        "name": "Sponsor 3",
        "logo": "",
        "url": ""
      },
      {
        "name": "Sponsor 4",
        "logo": "",
        "url": ""
      },
      {
        "name": "Sponsor 5",
        "logo": "",
        "url": ""
      },
      {
        "name": "Sponsor 6",
        "logo": "",
        "url": ""
      }
    ],
    "supporters": [
      {
        "name": "Local agricultural suppliers",
        "text": "Seed stock, feed, and inputs that keep the farm running."
      },
      {
        "name": "Community & cooperative partners",
        "text": "Local groups Solomon works with and supports."
      }
    ],
    "ctaLabel": "Become a Partner"
  },
  "press": {
    "kicker": "Press & Recognition",
    "title": "In the news",
    "items": [
      {
        "outlet": "Manila Bulletin",
        "title": "Sweet Success: High school graduate earns ₱1M a year as a sugarcane farmer",
        "meta": "Spotlight Features · 2026",
        "url": "https://mb.com.ph/2026/04/08/sweet-success-high-school-graduate-earns-1m-a-year-as-a-sugarcane-farmer"
      },
      {
        "outlet": "Agriculture Magazine",
        "title": "He left for the city, came back a farmer — and now earns a million yearly from sugarcane",
        "meta": "Feature · 2026",
        "url": "https://agriculture.com.ph/2026/03/20/he-left-for-the-city-came-back-a-farmer-and-now-earns-a-million-yearly-from-sugarcane/"
      }
    ],
    "achievements": [
      {
        "title": "₱1M+ a year",
        "text": "Gross income from sugarcane in a strong season — reaching close to ₱2M when prices surge."
      },
      {
        "title": "Featured nationally",
        "text": "Profiled by national agriculture media as a model for the return-to-farming generation."
      },
      {
        "title": "A growing audience",
        "text": "Tens of thousands follow his farming content across Facebook, TikTok, YouTube & Instagram."
      },
      {
        "title": "Self-made farmer",
        "text": "A high-school graduate who built a 20-hectare operation from the ground up."
      }
    ]
  },
  "contact": {
    "kicker": "Get in touch",
    "title": "Let's talk farming,<br/>livestock, or bookings.",
    "text": "Whether you're a fellow farmer, a buyer, an event organizer, or just curious about the work — Solomon would love to hear from you. The fastest way to reach him is a message on Facebook or Messenger.",
    "channels": [
      {
        "key": "facebook",
        "label": "Facebook",
        "blurb": "Follow the daily vlogs"
      },
      {
        "key": "messenger",
        "label": "Messenger",
        "blurb": "Send a direct message"
      },
      {
        "key": "youtube",
        "label": "YouTube",
        "blurb": "Watch the long-form videos"
      },
      {
        "key": "tiktok",
        "label": "TikTok",
        "blurb": "Quick clips from the field"
      },
      {
        "key": "whatsapp",
        "label": "WhatsApp",
        "blurb": "Inquiries & bookings"
      },
      {
        "key": "email",
        "label": "Email",
        "blurb": "For media & partnerships"
      }
    ],
    "location": {
      "label": "Location",
      "text": "Bayawan City, Negros Oriental, Philippines"
    },
    "formNote": "Send an inquiry and Solomon will get back to you. Fields marked are required."
  }
};

    function dataPath() {
    return location.pathname.includes("/admin/")
      ? "../data/content.json"
      : "data/content.json";
  }

  function readDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  async function fetchPublished() {
    try {
      const res = await fetch(dataPath(), { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (e) { /* file:// or offline — fall through */ }
    return null;
  }

  async function fetchFromSupabase() {
    try {
      if (window.SupabaseCMS && window.SupabaseCMS.enabled) {
        const body = await window.SupabaseCMS.getContent();
        if (body) return body;
      }
    } catch (e) { /* offline / not seeded yet — fall through */ }
    return null;
  }

  // Resolution order:
  //   • In the admin panel only: a local draft (unsaved preview), if any.
  //   • Supabase (live CMS), when configured.
  //   • data/content.json (static publish), then the embedded fallback.
  async function load() {
    const inAdmin = location.pathname.includes("/admin/");
    if (inAdmin) {
      const draft = readDraft();
      if (draft) return draft;
    }
    return (
      (await fetchFromSupabase()) ||
      (await fetchPublished()) ||
      EMBEDDED_FALLBACK
    );
  }

  window.SiteContent = { load, DRAFT_KEY, FALLBACK: EMBEDDED_FALLBACK };
})();
