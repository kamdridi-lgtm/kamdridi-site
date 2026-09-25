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
  { slug: "taiwan", name: "Taiwan", region: "Asia", priorityTrack: "our-lost-dreams" }
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
