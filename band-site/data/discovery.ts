export type DiscoveryAudience = {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
  needs: string[];
  contactSubject: string;
};

export type DiscoveryMarket = {
  slug: string;
  name: string;
  region: string;
  priorityTrack: "our-lost-dreams" | "war-machines";
  marketContext?: string;
};

export const discoveryAudiences: DiscoveryAudience[] = [
  {
    slug: "radio",
    label: "Radio & Airplay",
    eyebrow: "Radio programmers · music directors · specialty shows",
    description:
      "Broadcast-ready KAM DRIDI information for programmers reviewing melodic hard rock, cinematic rock and independent international releases.",
    needs: ["radio-ready audio", "ISRC and runtime", "artist and release metadata", "EPK and contact"],
    contactSubject: "Radio Inquiry"
  },
  {
    slug: "sync",
    label: "Sync & Licensing",
    eyebrow: "Music supervisors · agencies · trailers · games · branded media",
    description:
      "A direct professional route for licensing review, master-use questions and sync conversations involving KAM DRIDI music.",
    needs: ["music review link", "master-use contact", "artist metadata", "fast rights inquiry route"],
    contactSubject: "Sync Licensing Inquiry"
  },
  {
    slug: "festivals",
    label: "Festivals & Booking",
    eyebrow: "Festival programmers · promoters · talent buyers · venues",
    description:
      "Live-booking information for KAM DRIDI, a Montreal-based independent cinematic melodic hard rock artist.",
    needs: ["live overview", "EPK", "booking contact", "production information on request"],
    contactSubject: "Festival Booking Inquiry"
  },
  {
    slug: "press",
    label: "Press & Media",
    eyebrow: "Editors · journalists · reviewers · interview producers",
    description:
      "A concise press route for KAM DRIDI interviews, reviews, features and music-media coverage.",
    needs: ["artist bio", "release context", "press assets", "interview contact"],
    contactSubject: "Press Media Inquiry"
  }
];

export const discoveryMarkets: DiscoveryMarket[] = [
  { slug: "canada", name: "Canada", region: "North America", priorityTrack: "our-lost-dreams" },
  { slug: "united-states", name: "United States", region: "North America", priorityTrack: "our-lost-dreams" },
  { slug: "united-kingdom", name: "United Kingdom", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "germany", name: "Germany", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "france", name: "France", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "japan", name: "Japan", region: "Asia", priorityTrack: "war-machines" },
  { slug: "australia", name: "Australia", region: "Oceania", priorityTrack: "our-lost-dreams" },
  { slug: "new-zealand", name: "New Zealand", region: "Oceania", priorityTrack: "our-lost-dreams" },
  { slug: "south-africa", name: "South Africa", region: "Africa", priorityTrack: "our-lost-dreams" },
  { slug: "brazil", name: "Brazil", region: "South America", priorityTrack: "our-lost-dreams" },
  { slug: "mexico", name: "Mexico", region: "North America", priorityTrack: "our-lost-dreams" },
  { slug: "spain", name: "Spain", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "italy", name: "Italy", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "netherlands", name: "Netherlands", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "belgium", name: "Belgium", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "switzerland", name: "Switzerland", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "austria", name: "Austria", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "czech-republic", name: "Czech Republic", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "romania", name: "Romania", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "bulgaria", name: "Bulgaria", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "greece", name: "Greece", region: "Europe", priorityTrack: "our-lost-dreams" },
  { slug: "india", name: "India", region: "Asia", priorityTrack: "our-lost-dreams" },
  { slug: "philippines", name: "Philippines", region: "Asia", priorityTrack: "our-lost-dreams" },
  { slug: "taiwan", name: "Taiwan", region: "Asia", priorityTrack: "our-lost-dreams" },
  { slug: "sweden", name: "Sweden", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Nordic rock, specialist radio, press, festival and sync discovery." },
  { slug: "norway", name: "Norway", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Nordic rock, live-booking, press and licensing discovery." },
  { slug: "denmark", name: "Denmark", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Nordic music-industry, radio, festival and media discovery." },
  { slug: "finland", name: "Finland", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock-focused radio, media, festival and professional music discovery." },
  { slug: "poland", name: "Poland", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock radio, festival, press and international artist discovery." },
  { slug: "portugal", name: "Portugal", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Radio, music press, festivals and sync licensing discovery." },
  { slug: "ireland", name: "Ireland", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Independent radio, rock media, festivals and booking discovery." },
  { slug: "south-korea", name: "South Korea", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "International rock, media, sync and live-show discovery." },
  { slug: "singapore", name: "Singapore", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "Regional media, sync, festival and international music discovery." },
  { slug: "thailand", name: "Thailand", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "Radio, media, live and international music discovery." },
  { slug: "indonesia", name: "Indonesia", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "Rock media, radio, festival and digital music discovery." },
  { slug: "argentina", name: "Argentina", region: "South America", priorityTrack: "our-lost-dreams", marketContext: "Rock radio, music press, festivals and booking discovery." },
  { slug: "chile", name: "Chile", region: "South America", priorityTrack: "our-lost-dreams", marketContext: "Rock media, festival, radio and international artist discovery." },
  { slug: "colombia", name: "Colombia", region: "South America", priorityTrack: "our-lost-dreams", marketContext: "Radio, music media, festival and sync discovery." },
  { slug: "tunisia", name: "Tunisia", region: "Africa", priorityTrack: "our-lost-dreams", marketContext: "Festival, cultural programming, media and international artist discovery." },
  { slug: "united-arab-emirates", name: "United Arab Emirates", region: "Middle East", priorityTrack: "our-lost-dreams", marketContext: "Music supervision, branded media, events and international artist discovery." },
  { slug: "belarus", name: "Belarus", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock media, independent music discovery and regional press." },
  { slug: "croatia", name: "Croatia", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Festival, radio and rock-media discovery in Southeast Europe." },
  { slug: "serbia", name: "Serbia", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock radio, festival, media and live-booking discovery." },
  { slug: "slovenia", name: "Slovenia", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Festival, press, radio and international artist discovery." },
  { slug: "hungary", name: "Hungary", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock radio, media, festivals and independent music discovery." },
  { slug: "slovakia", name: "Slovakia", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Radio, press, festival and live music discovery." },
  { slug: "estonia", name: "Estonia", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Showcase, press, radio and international music discovery." },
  { slug: "latvia", name: "Latvia", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Radio, music media, festival and booking discovery." },
  { slug: "lithuania", name: "Lithuania", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock media, radio, festival and international artist discovery." },
  { slug: "turkey", name: "Turkey", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Rock media, live music, festival and licensing discovery." },
  { slug: "malaysia", name: "Malaysia", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "Regional radio, media, sync and festival discovery." },
  { slug: "vietnam", name: "Vietnam", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "International music media, events, sync and digital discovery." },
  { slug: "hong-kong", name: "Hong Kong", region: "Asia", priorityTrack: "our-lost-dreams", marketContext: "Media, sync, events and international music discovery." },
  { slug: "israel", name: "Israel", region: "Middle East", priorityTrack: "our-lost-dreams", marketContext: "Rock media, radio, sync and live-show discovery." },
  { slug: "morocco", name: "Morocco", region: "Africa", priorityTrack: "our-lost-dreams", marketContext: "Festival, radio, cultural programming and media discovery." },
  { slug: "egypt", name: "Egypt", region: "Africa", priorityTrack: "our-lost-dreams", marketContext: "Media, events, sync and international music discovery." },
  { slug: "nigeria", name: "Nigeria", region: "Africa", priorityTrack: "our-lost-dreams", marketContext: "Radio, media, sync and international artist discovery." },
  { slug: "kenya", name: "Kenya", region: "Africa", priorityTrack: "our-lost-dreams", marketContext: "Radio, festival, media and live-music discovery." },
  { slug: "peru", name: "Peru", region: "South America", priorityTrack: "our-lost-dreams", marketContext: "Rock radio, press, festival and booking discovery." },
  { slug: "uruguay", name: "Uruguay", region: "South America", priorityTrack: "our-lost-dreams", marketContext: "Radio, music press, festival and international artist discovery." },
  { slug: "costa-rica", name: "Costa Rica", region: "North America", priorityTrack: "our-lost-dreams", marketContext: "Radio, festivals, music press and international artist discovery." },
  { slug: "puerto-rico", name: "Puerto Rico", region: "North America", priorityTrack: "our-lost-dreams", marketContext: "Radio, media, live booking and sync discovery." },
  { slug: "iceland", name: "Iceland", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Independent music, showcase, press and sync discovery." },
  { slug: "luxembourg", name: "Luxembourg", region: "Europe", priorityTrack: "our-lost-dreams", marketContext: "Cross-border radio, media, festival and music-industry discovery." }
];

export const discoveryRouteCount = discoveryAudiences.length * discoveryMarkets.length;

export function getAudience(slug: string) {
  return discoveryAudiences.find((item) => item.slug === slug);
}

export function getMarket(slug: string) {
  return discoveryMarkets.find((item) => item.slug === slug);
}

export function getPriorityTrack(market: DiscoveryMarket) {
  if (market.priorityTrack === "war-machines") {
    return {
      title: "WAR MACHINES",
      description: "Primary KAM DRIDI focus for Japan.",
      href: "/app/war-machines-jp",
      album: "Echoes Unearthed"
    };
  }

  return {
    title: "OUR LOST DREAMS",
    description: "Primary international radio, media and professional outreach track outside Japan.",
    href: "/our-lost-dreams",
    album: "Echoes Unearthed",
    isrc: "QZZ7M2627618",
    duration: "4:55"
  };
}

export const discoveryRoutes = discoveryAudiences.flatMap((audience) =>
  discoveryMarkets.map((market) => `/discover/${audience.slug}/${market.slug}`)
);


export const discoveryRegions = [...new Set(discoveryMarkets.map((market) => market.region))].map((name) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-")
}));

export function getRegion(slug: string) {
  return discoveryRegions.find((region) => region.slug === slug);
}

export function getMarketsForRegion(regionName: string) {
  return discoveryMarkets.filter((market) => market.region === regionName);
}

export const discoveryRegionRoutes = discoveryRegions.map((region) => `/discover/region/${region.slug}`);
