-- ===================================================================
-- SOLOMON PAGUNSAN — CONTENT SEED  (supabase/seed_content.sql)
-- Run AFTER schema.sql. Loads the current website content into the
-- single `content` row. Safe to re-run — it overwrites row id = 1.
-- (Re-running resets content to this file; once you start editing in
--  the admin, your live edits are the source of truth — re-seed only
--  if you want to reset.)
-- ===================================================================
insert into public.content (id, body, updated_at)
values (1, $content${
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
      "label": "Watch the Vlogs",
      "href": "vlogs.html"
    },
    "secondaryCta": {
      "label": "Contact Solomon",
      "href": "contact.html"
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
      "title": "The Story",
      "text": "From the city streets back to the soil — how a Negros farmer built a livelihood from the ground up.",
      "href": "about.html",
      "linkLabel": "Read his story"
    },
    {
      "title": "Farm Learning",
      "text": "Practical farming methods, hand-built tools, and the student visits that make the farm a classroom.",
      "href": "farm-learning.html",
      "linkLabel": "See the farm"
    },
    {
      "title": "Vlogs",
      "text": "Planting, harvesting, building, and raising animals — no filters, just the real work.",
      "href": "vlogs.html",
      "linkLabel": "Watch the vlogs"
    },
    {
      "title": "Gallery",
      "text": "Life on the farm in pictures — the land, the crops, the animals, and the people.",
      "href": "gallery.html",
      "linkLabel": "Browse the gallery"
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
    "quote": {
      "text": "I left home chasing an opportunity. I returned home to build it.",
      "attribution": "— Solomon Pagunsan"
    },
    "captain": {
      "kicker": "Off the Clock",
      "title": "The Captain of Negros",
      "text": "When the harvest is in, a different character takes the stage. Known across Negros for his spot-on Captain Jack Sparrow, Solomon brings the costume, the swagger, and the comedy to fiestas, events, and appearances — proof that a farmer can command a crowd as easily as a field.",
      "tags": [
        "Character impersonation & cosplay",
        "Town fiestas & community events",
        "Stage performances & meet-and-greets",
        "Public appearances & collaborations"
      ],
      "image": "images/Solomon_1.jpg",
      "ctaLabel": "Book an appearance"
    }
  },
  "farmLearning": {
    "studentVisits": {
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
      "ctaLabel": "Arrange a student visit"
    },
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
  "vlogs": {
    "kicker": "Farmer Vlogger",
    "title": "Watch the farm work",
    "sub": "Honest documentation of life on a Negros farm — planting, harvesting, building, and raising animals. No filters, just the real work.",
    "items": [
      {
        "url": "https://www.youtube.com/watch?v=_8NPoL9fJNA",
        "title": "Sugarcane Harvest Season",
        "desc": "From standing cane to the milling central."
      },
      {
        "url": "https://www.youtube.com/watch?v=X3Bd-vqOao0",
        "title": "A Day on the Farm",
        "desc": "Sunrise to sundown with the carabao."
      },
      {
        "url": "https://www.youtube.com/watch?v=fU5zsyld4i8",
        "title": "Building Farm Tools",
        "desc": "Inside Solomon's workshop."
      },
      {
        "url": "https://www.youtube.com/watch?v=RbGfI8n5xH8",
        "title": "Raising Pigs & Chickens",
        "desc": "How the in-between seasons get funded."
      },
      {
        "url": "https://www.youtube.com/watch?v=PuO14QqvHOU",
        "title": "Planting Day",
        "desc": "Preparing the field for the next crop."
      },
      {
        "url": "https://www.youtube.com/watch?v=Y5BuLfg6qJs",
        "title": "The Captain Appears",
        "desc": "A little fun after the harvest."
      }
    ]
  },
  "gallery": {
    "kicker": "Gallery",
    "title": "Life on the farm",
    "images": [
      "images/farm-01.jpg",
      "images/hero-collage_5.jpg",
      "images/farm-03.jpg",
      "images/hero-collage_4.jpg",
      "images/hero-collage_1.jpg",
      "images/hero-collage_2.jpg",
      "images/hero-collage_3.jpg",
      "images/sugarcane-field.jpg",
      "images/farm-05.jpg"
    ]
  },
  "partners": {
    "intro": {
      "kicker": "Partnerships & Sponsors",
      "title": "Partnerships & Sponsors",
      "sub": "Brands, organizations and businesses that support, collaborate and work with Solomon Pagunsan."
    },
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
    "services": {
      "kicker": "Work With Solomon",
      "title": "More than a farmer.<br/>A partner brands can grow with.",
      "sub": "Farmer, inventor, entrepreneur, content creator, community personality, and brand partner — Solomon connects companies with the real audience of Philippine agriculture. Here's how to work together.",
      "items": [
        {
          "name": "Product Endorsements",
          "text": "Authentic, field-tested endorsements of agricultural products, tools, and equipment — shown working on a real Negros farm."
        },
        {
          "name": "Sponsored Videos",
          "text": "Dedicated or integrated brand features across YouTube, Facebook, and TikTok, produced in Solomon's honest documentary style."
        },
        {
          "name": "Farm Visits",
          "text": "Hosted visits to the farm for brands, media, schools, and organizations — see the operation and the story up close."
        },
        {
          "name": "Event Guesting",
          "text": "Speaking engagements, guest appearances, and 'The Captain' performances for fiestas, expos, and corporate events."
        },
        {
          "name": "Brand Collaborations",
          "text": "Long-term ambassadorships and campaigns with brands that share a genuine commitment to Filipino farmers."
        },
        {
          "name": "Community Events",
          "text": "Partnerships on community programs, farmer meet-ups, and outreach activities across Negros and beyond."
        },
        {
          "name": "Agricultural Promotions",
          "text": "Campaigns that promote crops, livestock, farm technology, and agri-services to an engaged farming audience."
        }
      ]
    },
    "mediaKit": {
      "kicker": "Media Kit",
      "title": "The audience at a glance",
      "sub": "A quick snapshot for brands, agencies, and organizations evaluating a collaboration. Full media kit and rate card available on request.",
      "facebookFollowers": "",
      "youtubeSubscribers": "",
      "tiktokFollowers": "",
      "monthlyReach": "",
      "location": "Philippines"
    }
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
    ]
  }
}$content$::jsonb, now())
on conflict (id) do update
  set body = excluded.body,
      updated_at = now();
