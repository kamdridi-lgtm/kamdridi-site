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
  status: "playable",
  statusLabel: "Web checkpoint verified - Godot 4.7.1",
  sourceCommit: "e8cbbce",
  pipelineCommit: "f4cd59b",
  branch: "handoff/codex-2026-07-19",
  playUrl: "/play/the-gilded-null-act1/checkpoints/act1-cp001/index.html",
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
    "Complete Title to Tutorial to Gate to Megacity desktop loop",
    "WebGL 2 browser boot and PLAY to Tutorial transition",
    "IMMERSIVE, RUNNER and HERO camera presets",
    "Nineteen Megacity wall modules loaded (A-S)",
    "Zero browser console, page and network errors",
    "Game Over, Retry, Victory and Run Again"
  ],
  next: [
    "Replace the temporary runner with RN-07 when the final asset is ready",
    "Complete the final audio pass",
    "Continue browser performance and device coverage testing"
  ]
};
