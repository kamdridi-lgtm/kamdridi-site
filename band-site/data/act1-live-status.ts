export type Act1LiveStatus = {
  updatedAt: string;
  sourceRepo: string;
  sourceBranch: string;
  sourceCommit: string;
  sourceMessage: string;
  deployedCheckpoint: string;
  deploymentStatus: "PLAYABLE" | "EXPORTING" | "ARCHIVED";
  nextMilestone: string;
  truthNote: string;
};

export const act1LiveStatus: Act1LiveStatus = {
  updatedAt: "July 24, 2026",
  sourceRepo: "kamdridi-lgtm/kamdridi-gilded-null-act1",
  sourceBranch: "handoff/codex-2026-07-19",
  sourceCommit: "e8cbbce",
  sourceMessage: "Fix Web wall loading and validate ACT I export",
  deployedCheckpoint: "Checkpoint 003",
  deploymentStatus: "PLAYABLE",
  nextMilestone: "Replace the temporary runner with final RN-07 and validate a new browser checkpoint",
  truthNote:
    "Checkpoint 003 remains the latest public browser build. A newer checkpoint will not be labeled playable until export, browser boot, camera, audio and full-run validation pass."
};
