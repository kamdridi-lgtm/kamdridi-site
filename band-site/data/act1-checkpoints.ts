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

export const currentAct1Checkpoint: Act1Checkpoint = {
  id: "act1-cp001",
  label: "Checkpoint 001",
  updatedAt: "July 22, 2026",
  status: "exporting",
  statusLabel: "Source archived - browser export in validation",
  sourceCommit: "51cb426",
  pipelineCommit: "3d509ae",
  branch: "handoff/codex-2026-07-19",
  playUrl: null,
  captures: [
    {
      src: "/assets/images/games/checkpoints/act1-cp001-gate.jpg",
      alt: "ACT I development capture at the gate approach",
      caption: "Gate approach - development capture"
    },
    {
      src: "/assets/images/games/checkpoints/act1-cp001-megacity.jpg",
      alt: "ACT I development capture inside the procedural Megacity",
      caption: "Procedural Megacity - development capture"
    }
  ],
  verified: [
    "Complete Title to Tutorial to Gate to Megacity loop",
    "IMMERSIVE, RUNNER and HERO camera presets",
    "Nineteen Megacity wall modules loaded (A-S)",
    "Game Over, Retry, Victory and Run Again",
    "500m+ automated run with zero engine errors"
  ],
  next: [
    "Validate the first WebGL 2 browser export",
    "Replace the temporary runner with RN-07 when the final asset is ready",
    "Complete shield feedback and the final audio pass"
  ]
};
