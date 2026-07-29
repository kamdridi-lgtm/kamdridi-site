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
  updatedAt: "July 29, 2026",
  sourceRepo: "kamdridi-lgtm/kamdridi-gilded-null-act1",
  sourceBranch: "handoff/codex-2026-07-19",
  sourceCommit: "5999446",
  headline: "RN-07 gameplay events connected",
  sourceMessage:
    "Connect existing DASH, HIT and VICTORY gameplay events to optional RN-07 animation clips while preserving all movement tuning, collision, cameras and the procedural fallback",
  deployedCheckpoint: "Checkpoint 003",
  deploymentStatus: "PLAYABLE",
  nextMilestone:
    "Add and approve the final RN-07 wrapper scene at assets/characters/rn07/RN07.tscn, prove animation playback and retargeting in the real game, then pass mobile, camera, audio, complete-run and Web validation before publishing Checkpoint 004",
  truthNote:
    "The RN-07 gate, automatic replacement slot and gameplay event bridge are merged and validated, but the final RN-07 character asset is not yet present or approved. Checkpoint 003 remains the latest playable browser build; Checkpoint 004 is not being presented as playable."
};
