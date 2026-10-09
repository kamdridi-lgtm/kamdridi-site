import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type Playlist = {
  id: string;
  name: string;
  platform: "spotify" | "apple" | "independent";
  curator: string;
  contact: string;
  genres: string[];
  successRatePct: number;
};

export type PlaylistPitch = {
  id: string;
  playlistId: string;
  releaseId: string;
  status: "draft" | "sent" | "accepted" | "refused" | "follow_up_due";
  message: string;
  createdAt: string;
  followUpAt: string;
};

export async function listPlaylists() {
  const existing = await readLabelJson<Playlist[]>("playlists.json", []);
  if (existing.length) return existing;
  const seed: Playlist[] = [
    { id: "pl_cyber_metal", name: "Cyber Metal Radar", platform: "spotify", curator: "KDR Research", contact: "curator@example.com", genres: ["metal", "industrial"], successRatePct: 18 },
    { id: "pl_dark_game", name: "Dark Game Soundtracks", platform: "independent", curator: "KDR Research", contact: "games@example.com", genres: ["soundtrack", "cyberpunk"], successRatePct: 24 }
  ];
  await writeLabelJson("playlists.json", seed);
  return seed;
}

export function renderPitchTemplate(input: { artistName: string; title: string; genre: string; link: string }) {
  return `Hi, this is KAMDRIDI RECORDS. We are pitching ${input.artistName} - ${input.title}, a ${input.genre} release built for dark cinematic and cyberpunk audiences. Private stream: ${input.link}`;
}

export async function submitPlaylistPitch(input: { playlistId: string; releaseId: string; message: string }) {
  const pitches = await readLabelJson<PlaylistPitch[]>("playlist-pitches.json", []);
  const follow = new Date();
  follow.setDate(follow.getDate() + 7);
  const pitch: PlaylistPitch = {
    id: `pitch_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    playlistId: input.playlistId,
    releaseId: input.releaseId,
    message: input.message,
    status: "sent",
    createdAt: new Date().toISOString(),
    followUpAt: follow.toISOString()
  };
  pitches.unshift(pitch);
  await writeLabelJson("playlist-pitches.json", pitches);
  return pitch;
}

export async function updatePitchStatus(id: string, status: PlaylistPitch["status"]) {
  const pitches = await readLabelJson<PlaylistPitch[]>("playlist-pitches.json", []);
  const next = pitches.map((pitch) => (pitch.id === id ? { ...pitch, status } : pitch));
  await writeLabelJson("playlist-pitches.json", next);
  return next.find((pitch) => pitch.id === id);
}
