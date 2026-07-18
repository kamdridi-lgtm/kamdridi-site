export type SceneVariant = "full" | "case";

export type MuseumSceneData = {
  id: string;
  image: string;
  act: string;
  inventory: string;
  variant: SceneVariant;
};

export const museumScenes: MuseumSceneData[] = [
  // ACT I — DISCOVERY
  {
    id: "master-manuscript",
    image: "01-master-manuscript-final",
    act: "discovery",
    inventory: "INV. 1791.001",
    variant: "full",
  },
  {
    id: "discovery-provenance",
    image: "07-discovery-provenance",
    act: "discovery",
    inventory: "INV. 1791.002",
    variant: "case",
  },

  // ACT II — AUTHENTICATION
  {
    id: "restoration-lab-b",
    image: "11-restoration-lab-b",
    act: "authentication",
    inventory: "INV. 1791.003",
    variant: "full",
  },
  {
    id: "restoration-lab-a",
    image: "05-restoration-lab-a",
    act: "authentication",
    inventory: "INV. 1791.004",
    variant: "case",
  },

  // ACT III — PRESERVATION
  {
    id: "secret-library",
    image: "06-secret-library",
    act: "preservation",
    inventory: "INV. 1791.005",
    variant: "full",
  },

  // ACT IV — EXHIBITION
  {
    id: "museum-case-hero",
    image: "02-museum-case-hero",
    act: "exhibition",
    inventory: "INV. 1791.006",
    variant: "full",
  },
  {
    id: "grand-gallery",
    image: "03-grand-gallery",
    act: "exhibition",
    inventory: "INV. 1791.007",
    variant: "full",
  },
  {
    id: "museum-case-close",
    image: "10-museum-case-close",
    act: "exhibition",
    inventory: "INV. 1791.008",
    variant: "case",
  },

  // ACT V — GENESIS AND RESURRECTION
  {
    id: "composers-desk",
    image: "04-composers-desk",
    act: "resurrection",
    inventory: "INV. 1791.009",
    variant: "case",
  },
  {
    id: "piano-room",
    image: "08-piano-room",
    act: "resurrection",
    inventory: "INV. 1791.010",
    variant: "full",
  },
  {
    id: "fortepiano",
    image: "09-fortepiano",
    act: "resurrection",
    inventory: "INV. 1791.011",
    variant: "case",
  },
  {
    id: "resurrection",
    image: "placeholder-orchestra",
    act: "resurrection",
    inventory: "INV. 1791.012",
    variant: "full",
  }
];
