import { storeProducts } from "@/data/store";

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
  priceLabel: string;
  description: string;
  checkoutUrl: string;
  limited?: boolean;
};

export type MembershipTier = {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  checkoutUrl: string;
  features: string[];
};

export type GameExperience = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  poster: string;
  launchUrl: string;
  membership: "Inner Circle" | "Collector";
  launcherLabel: string;
  comingSoon?: boolean;
};

export type ComicPage = {
  id: string;
  title: string;
  image: string;
  caption: string;
};

export type VisualAlbumScene = {
  id: string;
  title: string;
  image: string;
  description: string;
};

export type StreamingLink = {
  label: string;
  href: string;
  note: string;
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
    "Official cinematic artist website for KAMDRIDI featuring Echoes Unearthed music, visual album content, games, memberships, merchandise, and fan-universe access.",
  heroVideo:
    "https://cdn.coverr.co/videos/coverr-stage-lights-1565701223930?download=1080p",
  email: "management@kamdridi.com",
  domain: "https://kamdridi.com",
  keywords: [
    "KAMDRIDI",
    "Echoes Unearthed",
    "cinematic metal",
    "visual album",
    "interactive music experience",
    "The Gilded Null",
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
  {
    label: "Spotify",
    href: "https://open.spotify.com/track/1jfpUX2dXWBzwnfAhhMm7W?si=c07e266c25314fc8",
    handle: "War Machines"
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com/us/artist/kam-dridi/1871722663",
    handle: "Kam dridi"
  },
  { label: "Facebook", href: "https://facebook.com/kamdridi", handle: "KAMDRIDI" },
  { label: "Twitter", href: "https://x.com/kamdridi", handle: "@kamdridi" }
];

export const streamingLinks: StreamingLink[] = [
  {
    label: "Apple Music",
    href: "https://music.apple.com/us/album/war-machines-radio-edit-single/1871879256",
    note: "War Machines (Radio Edit)"
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/track/1jfpUX2dXWBzwnfAhhMm7W?si=c07e266c25314fc8",
    note: "War Machines"
  },
  {
    label: "Amazon Music",
    href: "https://amazon.com/music/player/tracks/B0GJN46NSS",
    note: "War Machines"
  },
  {
    label: "Deezer",
    href: "https://link.deezer.com/s/32ItAgNBZtNl",
    note: "War Machines"
  }
];

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Music",
    href: "/music",
    children: [
      { label: "Latest Video", href: "/music#videos" },
      { label: "Discography", href: "/music#discography" },
      { label: "Tour Dates", href: "/tour#dates" }
    ]
  },
  {
    label: "Store",
    href: "/store",
    children: [
      { label: "Featured Merch", href: "/store#featured" },
      { label: "Collector Drops", href: "/store#featured" }
    ]
  },
  {
    label: "Fan Club",
    href: "/fan-club",
    children: [
      { label: "Membership Levels", href: "/fan-club#membership" },
      { label: "Games Access", href: "/fan-club#game-access" },
      { label: "Fan Vault", href: "/fan-club#vault" }
    ]
  },
  {
    label: "Games",
    href: "/games",
    children: [
      { label: "Games Protocol", href: "/games#games-protocol" },
      { label: "The Gilded Null", href: "/games#the-gilded-null" }
    ]
  },
  {
    label: "Visual Album",
    href: "/visual-album",
    children: [
      { label: "Scene Archive", href: "/visual-album#scene-archive" },
      { label: "Album World", href: "/visual-album#album-world" }
    ]
  },
  {
    label: "Who is Kam Dridi",
    href: "/who-is-kam-dridi",
    children: [
      { label: "Comic Reader", href: "/who-is-kam-dridi#comic-reader" },
      { label: "Lore Archive", href: "/who-is-kam-dridi#lore-archive" }
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

export const membershipTiers: MembershipTier[] = [
  {
    id: "inner-circle-membership",
    name: "INNER CIRCLE MEMBERSHIP",
    priceLabel: "$5 / month",
    description:
      "For fans who want a direct line into the Echoes Unearthed universe with private updates, first-wave access, and the first protocol unlocked.",
    checkoutUrl: process.env.NEXT_PUBLIC_STRIPE_LINK_INNER_CIRCLE || "",
    features: [
      "Access to the first game in Games Protocol",
      "Partial fan vault access",
      "Private updates and member-only announcements",
      "Early access to selected merch drops"
    ]
  },
  {
    id: "collector-membership",
    name: "COLLECTOR MEMBERSHIP",
    priceLabel: "$25 / month",
    description:
      "For collectors who want full universe access, deeper vault unlocks, rare drops, and the most complete KAMDRIDI membership tier.",
    checkoutUrl: process.env.NEXT_PUBLIC_STRIPE_LINK_COLLECTOR || "",
    features: [
      "Everything in Inner Circle",
      "Access to both games",
      "Full fan vault access and collector section",
      "Priority early merch access",
      "Exclusive drops and premium content"
    ]
  }
];

export const products = storeProducts;

export const featuredVideo = {
  title: "War Machines - Official Audio",
  embedUrl: "https://www.youtube.com/embed/hzIVyLQN6a8",
  description:
    "Official audio for War Machines, presented as the current featured media release inside the Echoes Unearthed campaign."
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
    "Fan club members get private clips, rehearsal previews, pre-sale alerts, game protocol access, and early entry to premium drops inside the Echoes Unearthed world.",
  videos: [
    "Echoes Unearthed studio diary",
    "Private rehearsal cut: War Machines",
    "Lighting and visual design preview"
  ],
  communityTopics: [
    "Collector vinyl mockups and favorites",
    "Which deep cut should appear in the live set?",
    "Early fan-club discussion for upcoming merch access"
  ],
  accessNotes: [
    "Inner Circle unlocks the first game, private updates, and a partial vault archive.",
    "Collector unlocks both game protocols, the full vault, collector-only drops, and deeper archive access."
  ]
};

export const gameExperiences: GameExperience[] = [
  {
    id: "the-gilded-null",
    title: "THE GILDED NULL",
    subtitle: "Corridor Protocol",
    description: "Hold the line. Collect the gold. Outrun the darkness.",
    poster: "/gilded-null.jpg",
    launchUrl: process.env.NEXT_PUBLIC_GAME_THE_GILDED_NULL_URL || "/games#the-gilded-null",
    membership: "Inner Circle",
    launcherLabel: "Initiate Protocol"
  },
  {
    id: "monster-system",
    title: "MONSTER SYSTEM",
    subtitle: "Vault Sequence",
    description:
      "Enter the archive, track your score, and push deeper into the premium layer of the Echoes Unearthed world.",
    poster: "/assets/images/band/live3.jpg",
    launchUrl: process.env.NEXT_PUBLIC_GAME_MONSTER_SYSTEM_URL || "/games#games-protocol",
    membership: "Collector",
    launcherLabel: "Launch Sequence",
    comingSoon: true
  }
];

export const comicPages: ComicPage[] = [
  {
    id: "page-1",
    title: "Page 01",
    image: "/assets/images/gallery/p01_hero.jpg",
    caption: "The first signals surface through dust, floodlights, and a city still waking up."
  },
  {
    id: "page-2",
    title: "Page 02",
    image: "/assets/images/gallery/p02_live.jpg",
    caption: "The stage becomes a threshold where memory, pressure, and performance collide."
  },
  {
    id: "page-3",
    title: "Page 03",
    image: "/assets/images/gallery/p03_portrait_mic.jpg",
    caption: "A voice emerges from the static with fragments of the Echoes Unearthed story."
  },
  {
    id: "page-4",
    title: "Page 04",
    image: "/assets/images/gallery/p04_portrait_leather.jpg",
    caption: "The figure behind the signal steps fully into the frame: Kam Dridi."
  }
];

export const visualAlbumScenes: VisualAlbumScene[] = [
  {
    id: "war-machines",
    title: "War Machines",
    image: "/assets/images/releases/war-machines-cover.jpg",
    description: "Industrial pressure, scorched light, and the first rupture in the campaign world."
  },
  {
    id: "echoes-unearthed",
    title: "Echoes Unearthed",
    image: "/assets/images/releases/echoes-unearthed-cover.jpg",
    description: "The central record as a visual ruin: heavy, haunted, and cinematic."
  },
  {
    id: "live-stage",
    title: "Stage Transmission",
    image: "/assets/images/band/live_stage.jpg",
    description: "Live performance reframed as a cinematic corridor between album scenes."
  }
];

export const fanClubHubSections = [
  {
    id: "game-access",
    title: "Game Access",
    description: "Protocol launch cards for members, including The Gilded Null and the deeper Collector-only sequence."
  },
  {
    id: "comic-access",
    title: "Comic Access",
    description: "Responsive reader access for Who is Kam Dridi with sequential page navigation."
  },
  {
    id: "fan-vault",
    title: "Fan Vault",
    description: "Archive drops, private videos, hidden updates, and premium world-building materials."
  },
  {
    id: "exclusive-content",
    title: "Exclusive Content",
    description: "Drops, collector updates, early merch access, and private release notes from the campaign."
  }
];
