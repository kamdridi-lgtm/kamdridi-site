export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
};

export type TourDate = {
  city: string;
  venue: string;
  date: string;
  ticketLink: string;
  vip: string;
  status: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
  sizes?: string[];
  limited?: boolean;
};

export type Member = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

export type AlbumEntry = {
  year: string;
  title: string;
  type: string;
  art: string;
  description: string;
};

export const siteMeta = {
  bandName: "KAMDRIDI",
  albumName: "Echoes Unearthed",
  tagline: "Heavy, cinematic, and unearthed from dust, steel, and long-form atmosphere.",
  description:
    "Official cinematic artist website for KAMDRIDI featuring news, tour dates, music and video media, merchandise, fan club access, and contact tools.",
  heroVideo:
    "https://cdn.coverr.co/videos/coverr-stage-lights-1565701223930?download=1080p",
  email: "management@kamdridi.com",
  domain: "https://kamdridi.com",
  keywords: [
    "KAMDRIDI",
    "Echoes Unearthed",
    "cinematic metal",
    "artist website",
    "music merch store",
    "tour dates",
    "fan club"
  ]
};

export const socialLinks = [
  { label: "YouTube", href: "https://youtube.com/@kamdridi", handle: "@kamdridi" },
  { label: "Instagram", href: "https://instagram.com/kamdridi", handle: "@kamdridi" },
  { label: "TikTok", href: "https://tiktok.com/@kamdridi", handle: "@kamdridi" },
  { label: "Spotify", href: "https://open.spotify.com", handle: "KAMDRIDI" },
  { label: "Apple Music", href: "https://music.apple.com", handle: "KAMDRIDI" },
  { label: "Facebook", href: "https://facebook.com/kamdridi", handle: "KAMDRIDI" },
  { label: "Twitter", href: "https://x.com/kamdridi", handle: "@kamdridi" }
];

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "News",
    href: "/news",
    children: [
      { label: "Latest Headlines", href: "/news#latest-headlines" },
      { label: "Announcements", href: "/news#latest-headlines" }
    ]
  },
  {
    label: "Band",
    href: "/band",
    children: [
      { label: "Biography", href: "/band#biography" },
      { label: "Members", href: "/band#members" },
      { label: "Timeline", href: "/band#timeline" }
    ]
  },
  {
    label: "Tour",
    href: "/tour",
    children: [
      { label: "Tour Dates", href: "/tour#dates" },
      { label: "VIP", href: "/tour#vip" }
    ]
  },
  {
    label: "Media",
    href: "/media",
    children: [
      { label: "Videos", href: "/media#videos" },
      { label: "Gallery", href: "/media#gallery" },
      { label: "Discography", href: "/media#discography" }
    ]
  },
  {
    label: "Store",
    href: "/store",
    children: [
      { label: "Featured Merch", href: "/store#featured" },
      { label: "Cart", href: "/store#cart" }
    ]
  },
  {
    label: "Fan Club",
    href: "/fan-club",
    children: [
      { label: "Membership", href: "/fan-club#membership" },
      { label: "Exclusive Vault", href: "/fan-club#vault" }
    ]
  },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Contact Form", href: "/contact#form" },
      { label: "Management", href: "/contact#management" }
    ]
  }
];

export const newsPosts: NewsPost[] = [
  {
    slug: "echoes-unearthed-announcement",
    title: "KAMDRIDI unveils the cinematic album 'Echoes Unearthed'",
    date: "2026-03-08",
    image: "/assets/images/releases/echoes-unearthed-cover.jpg",
    excerpt:
      "A new era of heavy atmosphere, long-form songwriting, and dust-covered visual storytelling begins now.",
    content: [
      "Echoes Unearthed is the new statement release from KAMDRIDI, built around crushing riffs, melodic tension, and the physical feeling of digging forgotten sound out of the earth.",
      "The album rollout includes official videos, collector merch, premium fan experiences, and a live show designed around cinematic pacing rather than generic band-site filler.",
      "This website is structured to support the full campaign, from tour announcements and media premieres to merchandise drops and direct fan-club access."
    ]
  },
  {
    slug: "war-machines-out-now",
    title: "War Machines is out now with the radio edit and the full album version",
    date: "2026-02-19",
    image: "/assets/images/releases/war-machines-cover.jpg",
    excerpt:
      "The lead single opens the Echoes Unearthed campaign with metallic weight, widescreen atmosphere, and a long-form album cut.",
    content: [
      "War Machines bridges the heavy and cinematic halves of the project with giant hooks, textured production, and an uncompromising sense of scale.",
      "Fans can stream the single, watch the official visual world expand, and secure collector formats through the store."
    ]
  },
  {
    slug: "tour-prep-update",
    title: "Live campaign production expands for the next wave of headline dates",
    date: "2026-01-29",
    image: "/assets/images/band/live_stage.jpg",
    excerpt:
      "The next run of shows adds stronger visual storytelling, deeper fan experiences, and premium VIP access.",
    content: [
      "KAMDRIDI's live presentation continues to evolve with panoramic stage visuals, darker transitions, and a set designed to feel like a continuous cinematic arc.",
      "VIP upgrades will include early entry, exclusive merch bundles, and members-only access windows through the fan club."
    ]
  }
];

export const bandBio = [
  "KAMDRIDI is a cinematic heavy music project shaped by massive riffs, worn-vinyl texture, and a visual language built from dust, machinery, and unearthed memory.",
  "Rather than chasing disposable singles, the project focuses on atmosphere, scale, and long-form storytelling that makes the music feel inhabited, not just consumed.",
  "With Echoes Unearthed, KAMDRIDI becomes a complete artist platform: music, visuals, merch, live rollout, and fan-community access under one coherent dark-metal identity."
];

export const members: Member[] = [
  {
    name: "KAMDRIDI",
    role: "Artist, guitar, composition, production",
    image: "/assets/images/gallery/p04_portrait_leather.jpg",
    bio: "The creative core behind the project, shaping its sound, visual direction, and long-form cinematic identity."
  },
  {
    name: "Live Drums",
    role: "Percussion, impact design",
    image: "/assets/images/band/live2.jpg",
    bio: "A live-performance role built around pulse, scale, and the physical force needed to translate the material on stage."
  },
  {
    name: "Lead Guitar",
    role: "Melodic textures, solos",
    image: "/assets/images/gallery/p03_portrait_mic.jpg",
    bio: "Carries the melodic arc and lead detail that push the project from heavy into cinematic."
  },
  {
    name: "Low End / Backing Textures",
    role: "Bass, atmosphere",
    image: "/assets/images/band/live1.jpg",
    bio: "Supports the size of the arrangements with movement, weight, and vocal texture."
  }
];

export const albumTimeline: AlbumEntry[] = [
  {
    year: "2021",
    title: "Origins in Dust",
    type: "EP",
    art: "/assets/images/releases/inline-release-2.png",
    description: "The earliest public chapter of the project, defining the worn-metal and cinematic mood."
  },
  {
    year: "2023",
    title: "Fragments of Earth",
    type: "Single Series",
    art: "/assets/images/releases/echoes-unearthed-cover.png",
    description: "A set of releases that expanded the visual identity and sharpened the heavy atmospheric direction."
  },
  {
    year: "2026",
    title: "Echoes Unearthed",
    type: "Album",
    art: "/assets/images/releases/echoes-unearthed-cover.jpg",
    description: "The defining campaign release: cinematic, tactile, and built for immersion."
  },
  {
    year: "2026",
    title: "War Machines",
    type: "Lead Single",
    art: "/assets/images/releases/war-machines-cover.jpg",
    description: "A metallic centerpiece of the album world, available in both radio and extended versions."
  }
];

export const tourDates: TourDate[] = [
  {
    city: "Toronto, ON",
    venue: "The Danforth Music Hall",
    date: "2026-05-08",
    ticketLink: "https://example.com/kamdridi/toronto",
    vip: "Early entry + signed poster",
    status: "On Sale"
  },
  {
    city: "Montreal, QC",
    venue: "MTELUS",
    date: "2026-05-14",
    ticketLink: "https://example.com/kamdridi/montreal",
    vip: "Q&A + exclusive merch pack",
    status: "On Sale"
  },
  {
    city: "Los Angeles, CA",
    venue: "The Fonda Theatre",
    date: "2026-05-24",
    ticketLink: "https://example.com/kamdridi/los-angeles",
    vip: "Backstage photo + laminate",
    status: "Low Tickets"
  },
  {
    city: "Paris, FR",
    venue: "L'Olympia",
    date: "2026-06-12",
    ticketLink: "https://example.com/kamdridi/paris",
    vip: "Acoustic preview + early merch access",
    status: "VIP Waitlist"
  }
];

export const products: Product[] = [
  {
    id: "tee-echoes-crest",
    name: "Echoes Unearthed Crest Tee",
    category: "T-Shirts",
    image: "/assets/images/merch/tee_black.png",
    price: 38,
    description: "Black premium tee with distressed crest art inspired by the album world.",
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: "hoodie-unearthed",
    name: "Unearthed Heavy Hoodie",
    category: "Hoodies",
    image: "/assets/images/merch/hoodie.png",
    price: 74,
    description: "Heavyweight hoodie with sleeve print and oversized cinematic back graphic.",
    sizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: "vinyl-echoes-deluxe",
    name: "Echoes Unearthed Deluxe Vinyl",
    category: "Vinyl",
    image: "/assets/images/releases/echoes-unearthed-cover.jpg",
    price: 52,
    description: "180g collector vinyl with lyric insert, art print, and deluxe packaging.",
    limited: true
  },
  {
    id: "cd-echoes-digipak",
    name: "Echoes Unearthed Digipak CD",
    category: "CDs",
    image: "/assets/images/releases/war-machines-cover.jpg",
    price: 19,
    description: "Physical CD edition with expanded artwork and campaign credits."
  },
  {
    id: "collector-box-war-machines",
    name: "War Machines Collector Box",
    category: "Limited Editions",
    image: "/assets/images/merch/reg2.png",
    price: 128,
    description: "Numbered collector box with vinyl, signed card, patch, and exclusive apparel.",
    limited: true,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "artifact-pick-tin",
    name: "Unearthed Artifact Pick Tin",
    category: "Accessories",
    image: "/assets/images/merch/reg1.png",
    price: 18,
    description: "Collector accessory tin with custom picks and metallic foil stamp."
  }
];

export const featuredVideo = {
  title: "War Machines Official Visual",
  embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=kamdridi-placeholder",
  description:
    "Replace this embed with the official KAMDRIDI video link when the final visual is published."
};

export const socialFeed = [
  {
    platform: "Instagram",
    caption: "Echoes Unearthed visual world tests are in motion. Dust, steel, and black-gold light.",
    date: "2 days ago"
  },
  {
    platform: "TikTok",
    caption: "Stage atmospheres and heavy transitions from rehearsals.",
    date: "5 days ago"
  },
  {
    platform: "YouTube",
    caption: "A new behind-the-scenes visual teaser is live now.",
    date: "1 week ago"
  }
];

export const privateVault = {
  intro:
    "Fan club members get private clips, rehearsal previews, pre-sale alerts, and early access to premium merch drops.",
  videos: [
    "Echoes Unearthed studio diary",
    "Private rehearsal cut: War Machines",
    "Lighting and visual design preview"
  ],
  communityTopics: [
    "Collector vinyl mockups and favorites",
    "Which deep cut should appear in the live set?",
    "Early fan-club discussion for upcoming merch access"
  ]
};
