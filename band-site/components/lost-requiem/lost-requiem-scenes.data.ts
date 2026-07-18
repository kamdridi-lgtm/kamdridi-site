export type SceneVariant = "full" | "case";

export type MuseumSceneData = {
  id: string;
  image: string;
  act: string;
  title: string;
  eyebrow: string;
  description: string;
  inventory: string;
  variant: SceneVariant;
  alt: string;
};

export const museumScenes: MuseumSceneData[] = [
  // ACT I — DISCOVERY
  {
    id: "master-manuscript",
    image: "01-master-manuscript-final",
    act: "discovery",
    title: "THE MANUSCRIPT",
    eyebrow: "The source object",
    description: "Recovered among sealed papers and forgotten catalogues, the manuscript enters the archive as an object without a history.",
    inventory: "INV. 1791.001",
    variant: "full",
    alt: "The master manuscript of The Lost Requiem"
  },
  {
    id: "discovery-provenance",
    image: "07-discovery-provenance",
    act: "discovery",
    title: "PROVENANCE",
    eyebrow: "Tracing the origin",
    description: "",
    inventory: "INV. 1791.002",
    variant: "case",
    alt: "Details of the manuscript's provenance"
  },

  // ACT II — AUTHENTICATION
  {
    id: "restoration-lab-b",
    image: "11-restoration-lab-b",
    act: "authentication",
    title: "ANALYSIS",
    eyebrow: "Authentication",
    description: "Ink, paper, seals and damage are examined. Every mark becomes evidence; every silence raises another question.",
    inventory: "INV. 1791.003",
    variant: "full",
    alt: "Analysis of the manuscript in the restoration lab"
  },
  {
    id: "restoration-lab-a",
    image: "05-restoration-lab-a",
    act: "authentication",
    title: "STABILIZATION",
    eyebrow: "Manual restoration",
    description: "The manuscript is stabilized, not remade. Its scars remain part of the object and part of its story.",
    inventory: "INV. 1791.004",
    variant: "case",
    alt: "Manual restoration of the manuscript pages"
  },

  // ACT III — PRESERVATION
  {
    id: "secret-library",
    image: "06-secret-library",
    act: "preservation",
    title: "THE VAULT",
    eyebrow: "Preservation",
    description: "Preserved beyond public view, the score waits among works abandoned by time.",
    inventory: "INV. 1791.005",
    variant: "full",
    alt: "The manuscript stored in a secret library vault"
  },

  // ACT IV — EXHIBITION
  {
    id: "museum-case-hero",
    image: "02-museum-case-hero",
    act: "exhibition",
    title: "THE EXHIBITION",
    eyebrow: "First light",
    description: "For the first time, the manuscript leaves the archive and enters the light of the gallery.",
    inventory: "INV. 1791.006",
    variant: "full",
    alt: "Hero view of the manuscript in a museum case"
  },
  {
    id: "grand-gallery",
    image: "03-grand-gallery",
    act: "exhibition",
    title: "GRAND GALLERY",
    eyebrow: "Public viewing",
    description: "",
    inventory: "INV. 1791.007",
    variant: "full",
    alt: "The manuscript displayed in the grand gallery"
  },
  {
    id: "museum-case-close",
    image: "10-museum-case-close",
    act: "exhibition",
    title: "DETAIL",
    eyebrow: "Close inspection",
    description: "",
    inventory: "INV. 1791.008",
    variant: "case",
    alt: "Close-up view of the manuscript in the museum case"
  },

  // ACT V — GENESIS AND RESURRECTION
  {
    id: "composers-desk",
    image: "04-composers-desk",
    act: "resurrection",
    title: "THE DESK",
    eyebrow: "Genesis",
    description: "Before the concert, there was only paper, ink and the possibility of sound.",
    inventory: "INV. 1791.009",
    variant: "case",
    alt: "The composer's desk with early sketches"
  },
  {
    id: "piano-room",
    image: "08-piano-room",
    act: "resurrection",
    title: "THE ROOM",
    eyebrow: "First notes",
    description: "",
    inventory: "INV. 1791.010",
    variant: "full",
    alt: "The piano room where the composition began"
  },
  {
    id: "fortepiano",
    image: "09-fortepiano",
    act: "resurrection",
    title: "THE INSTRUMENT",
    eyebrow: "Genesis",
    description: "",
    inventory: "INV. 1791.011",
    variant: "case",
    alt: "The historical fortepiano used for the composition"
  },
  {
    id: "resurrection",
    image: "placeholder-orchestra", // wait: user said "Concert placeholder jusqu’à réception d’une image d’orchestre validée"
    act: "resurrection",
    title: "RESURRECTION",
    eyebrow: "Return to sound",
    description: "The written object becomes vibration. The archive gives way to music.",
    inventory: "INV. 1791.012",
    variant: "full",
    alt: "Placeholder for the upcoming orchestral concert"
  }
];
