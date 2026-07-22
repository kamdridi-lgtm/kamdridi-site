export type Act1CheckpointStatus = "archived" | "exporting" | "playable";

export type Act1Checkpoint = {
  id: string;
  label: string;
  updatedAt: string;
  status: Act1CheckpointStatus;
  statusLabel: string;
  sourceCommit: string;
  pipelineCommit: string;
  branch: string;
  playUrl: string | null;
  captures: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  verified: string[];
  next: string[];
};

export const act1Checkpoints: Act1Checkpoint[] = [
{
  id: "act1-cp003",
  label: "Checkpoint 003",
  updatedAt: "July 22, 2026",
  status: "playable",
  statusLabel: "Adaptive audio checkpoint verified - Godot 4.7.1",
  sourceCommit: "e8d37af",
  pipelineCommit: "fbd9b20",
  branch: "codex/act1-production",
  playUrl: "/play/the-gilded-null-act1/checkpoints/act1-cp003/index.html",
  captures: [
    {
      src: "/assets/images/games/checkpoints/act1-cp003-runner.png",
      alt: "ACT I Checkpoint 003 using the RUNNER camera",
      caption: "RUNNER camera - adaptive signal score checkpoint"
    },
    {
      src: "/assets/images/games/checkpoints/act1-cp003-hero.png",
      alt: "ACT I Checkpoint 003 using the HERO camera",
      caption: "HERO camera - temporary runner visual baseline"
    },
    {
      src: "/assets/images/games/checkpoints/act1-cp003-immersive.png",
      alt: "ACT I Checkpoint 003 using the IMMERSIVE camera",
      caption: "IMMERSIVE camera - Megacity gameplay baseline"
    }
  ],
  verified: [
    "Two-layer generated score with black-gold signal and metallic threat pulse",
    "Music intensity reacts to danger and late-run phases",
    "Web-safe audio start after PLAY with pause, resume and end-state fades",
    "Shield damage, ten-gold repair and all three runner cameras retained",
    "Full soak through 500m, 1000m, 1500m, 2100m and Victory",
    "Six graphical validation captures generated in Godot 4.7.1",
    "WebGL 2 boot and PLAY with zero console, page or request errors"
  ],
  next: [
    "Replace the temporary human runner with final RN-07",
    "Replace generated layers with final authored KAMDRIDI masters",
    "Continue impact feedback, mobile testing and Megacity polish"
  ]
},
{
  id: "act1-cp002",
  label: "Checkpoint 002",
  updatedAt: "July 22, 2026",
  status: "archived",
  statusLabel: "Archived WebGL 2 checkpoint - still playable",
  sourceCommit: "c4a82d2",
  pipelineCommit: "dc8d0e6",
  branch: "codex/act1-production",
  playUrl: "/play/the-gilded-null-act1/checkpoints/act1-cp002/index.html",
  captures: [
    {
      src: "/assets/images/games/checkpoints/act1-cp002-runner.png",
      alt: "ACT I Checkpoint 002 using the RUNNER camera",
      caption: "RUNNER camera - temporary human runner"
    },
    {
      src: "/assets/images/games/checkpoints/act1-cp002-hero.png",
      alt: "ACT I Checkpoint 002 using the HERO camera",
      caption: "HERO camera - closer animation view"
    },
    {
      src: "/assets/images/games/checkpoints/act1-cp002-immersive.png",
      alt: "ACT I Checkpoint 002 using the IMMERSIVE camera",
      caption: "IMMERSIVE camera - expanded road view"
    }
  ],
  verified: [
    "Animated temporary human runner silhouette with unchanged collision",
    "Reframed IMMERSIVE, RUNNER and HERO cameras",
    "Brighter black-gold city lighting and production HUD",
    "Nineteen Megacity wall resources available (A-S)",
    "Full soak through 500m, 1000m, 1500m, 2100m and Victory",
    "Zero browser console, page and network errors",
    "Game Over, Retry, Victory and Run Again remain intact"
  ],
  next: [
    "Replace the temporary human runner with final RN-07",
    "Complete the final audio pass",
    "Continue Megacity materials, reflections and device coverage"
  ]
},
{
  id: "act1-cp001",
  label: "Checkpoint 001",
  updatedAt: "July 22, 2026",
  status: "archived",
  statusLabel: "Archived Web checkpoint - still playable",
  sourceCommit: "e8cbbce",
  pipelineCommit: "f4cd59b",
  branch: "handoff/codex-2026-07-19",
  playUrl: "/play/the-gilded-null-act1/checkpoints/act1-cp001/index.html",
  captures: [
    {
      src: "/assets/images/games/checkpoints/act1-cp001-gate.jpg",
      alt: "ACT I Checkpoint 001 at the gate approach",
      caption: "Gate approach - Checkpoint 001"
    },
    {
      src: "/assets/images/games/checkpoints/act1-cp001-megacity.jpg",
      alt: "ACT I Checkpoint 001 inside the procedural Megacity",
      caption: "Procedural Megacity - Checkpoint 001"
    }
  ],
  verified: [
    "Complete Title to Tutorial to Gate to Megacity desktop loop",
    "WebGL 2 browser boot and PLAY to Tutorial transition",
    "IMMERSIVE, RUNNER and HERO camera presets",
    "Nineteen Megacity wall modules loaded (A-S)",
    "Zero browser console, page and network errors",
    "Game Over, Retry, Victory and Run Again"
  ],
  next: []
}
];

export const currentAct1Checkpoint = act1Checkpoints[0];
