import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const discoveryPath = path.join(root, "data", "discovery.ts");
const sitemapPath = path.join(root, "app", "sitemap.ts");
const sitePath = path.join(root, "data", "site.ts");
const layoutPath = path.join(root, "app", "layout.tsx");

for (const file of [discoveryPath, sitemapPath, sitePath, layoutPath]) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const discovery = fs.readFileSync(discoveryPath, "utf8");
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const site = fs.readFileSync(sitePath, "utf8");
const layout = fs.readFileSync(layoutPath, "utf8");

const marketMatches = [...discovery.matchAll(/slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*region:\s*"([^"]+)",\s*priorityTrack:\s*"(our-lost-dreams|war-machines)"/g)];
const audienceMatches = [...discovery.matchAll(/slug:\s*"(radio|sync|festivals|press)"/g)];

const markets = marketMatches.map((m) => ({ slug: m[1], name: m[2], region: m[3], priorityTrack: m[4] }));
const audienceSlugs = [...new Set(audienceMatches.map((m) => m[1]))];

if (markets.length < 40) throw new Error(`Expected at least 40 markets, found ${markets.length}`);
if (audienceSlugs.length !== 4) throw new Error(`Expected 4 discovery audiences, found ${audienceSlugs.length}`);

const marketSlugs = markets.map((m) => m.slug);
const dupes = marketSlugs.filter((slug, i) => marketSlugs.indexOf(slug) !== i);
if (dupes.length) throw new Error(`Duplicate market slugs: ${[...new Set(dupes)].join(", ")}`);

const japan = markets.find((m) => m.slug === "japan");
if (!japan || japan.priorityTrack !== "war-machines") {
  throw new Error("Japan must use WAR MACHINES as priority track");
}

const nonJapanWarMachines = markets.filter((m) => m.slug !== "japan" && m.priorityTrack === "war-machines");
if (nonJapanWarMachines.length) {
  throw new Error(`WAR MACHINES must not be primary outside Japan: ${nonJapanWarMachines.map((m) => m.slug).join(", ")}`);
}

const expectedRoutes = markets.length * audienceSlugs.length;
if (!discovery.includes("discoveryRoutes")) throw new Error("discoveryRoutes export missing");
if (!sitemap.includes("...discoveryRoutes")) throw new Error("Discovery routes are not published in sitemap");
if (!sitemap.includes('"/discover"')) throw new Error("/discover index missing from sitemap");

if (!discovery.includes("QZZ7M2627618")) throw new Error("OUR LOST DREAMS ISRC missing or changed");
if (!discovery.includes('duration: "4:55"')) throw new Error("OUR LOST DREAMS duration missing or changed");

for (const value of ["Melodic Hard Rock", "Cinematic Melodic Hard Rock"]) {
  if (!site.includes(value)) throw new Error(`site.ts missing positioning: ${value}`);
  if (!layout.includes(value)) throw new Error(`layout.tsx missing structured-data positioning: ${value}`);
}

if (/label:\s*"Submit"/.test(site)) throw new Error('Top-level "Submit" navigation must remain removed');
if (/label:\s*"Submit Music"/.test(site)) throw new Error('"Submit Music" navigation link reintroduced');

console.log(`Discovery QA passed: ${markets.length} markets × ${audienceSlugs.length} audiences = ${expectedRoutes} routes.`);
