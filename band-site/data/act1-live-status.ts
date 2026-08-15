export type Act1LiveStatus = {
  updatedAt: string;
  sourceRepo: string;
  sourceBranch: string;
  sourceCommit: string;
  headline: string;
  sourceMessage: string;
  deployedCheckpoint: string;
  deploymentStatus: "PLAYABLE" | "EXPORTING" | "ARCHIVED";
  nextMilestone: string;
  truthNote: string;
};

export const act1LiveStatus: Act1LiveStatus = {
  updatedAt: "August 14, 2026",
  sourceRepo: "kamdridi-lgtm/kamdridi-gilded-null-act1",
  sourceBranch: "handoff/codex-2026-07-19",
  sourceCommit: "e684e58",
  headline: "Canonical candidate validated; CP004 remains gated",
  sourceMessage:
    "Merge the canonical-candidate validation gate: exact-export Chromium WebGL boot and PLAY, quota-resilient mobile and camera proof transfer, and the updated next-checkpoint truth lock",
  deployedCheckpoint: "Checkpoint 003",
  deploymentStatus: "PLAYABLE",
  nextMilestone:
    "Add and approve the final RN-07 wrapper scene at assets/characters/rn07/RN07.tscn and the authored KAMDRIDI master, then rerun the same integration, soak, mobile, camera, audio and exact-export Web validation before publishing Checkpoint 004",
  truthNote:
    "The current source is validated end to end at merge e684e58: integration, soak, 390x844 mobile controls, six camera captures and exact WebGL boot plus PLAY are green. The final RN-07 character asset and approved KAMDRIDI master are still absent, so Checkpoint 003 remains the latest playable browser build and Checkpoint 004 remains unpublished."
};
