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
  updatedAt: "July 28, 2026",
  sourceRepo: "kamdridi-lgtm/kamdridi-gilded-null-act1",
  sourceBranch: "handoff/codex-2026-07-19",
  sourceCommit: "67559f0",
  headline: "Mobile, audio and full-run work consolidated",
  sourceMessage:
    "Promote the complete ACT I production branch with responsive mobile controls, adaptive audio, three camera modes and the validated full-run gameplay loop",
  deployedCheckpoint: "Checkpoint 003",
  deploymentStatus: "PLAYABLE",
  nextMilestone:
    "Integrate the final RN-07 character, then export and validate Checkpoint 004 before replacing the current public browser build",
  truthNote:
    "The production source is newer than the public build. Checkpoint 003 remains the latest playable browser checkpoint until Checkpoint 004 passes Godot import, Web export, browser boot, mobile controls, camera, audio and complete-run validation."
};
