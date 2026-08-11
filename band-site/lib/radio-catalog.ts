import masterCatalog from "@/data/master-catalog.json";

export type RadioTrack = {
  id: string;
  title: string;
  frequency: string;
  pathname: string;
  src: string;
};

type MasterCatalogTrack = {
  id: string;
  title: string;
  version?: string;
  frequency?: string;
  radioEnabled: boolean;
  radioPath: string;
  blobPath?: string;
};

const enabledTracks = (masterCatalog.tracks as MasterCatalogTrack[]).filter((track) => track.radioEnabled);

export const radioTracks: RadioTrack[] = enabledTracks.map((track, index) => ({
  id: track.id,
  title: track.version ? `${track.title} — ${track.version}` : track.title,
  frequency: track.frequency ?? (87.7 + (index % 18) * 1.1).toFixed(1),
  pathname: track.blobPath ?? `radio/catalog/${track.radioPath.split("/").pop()}`,
  src: `/${track.radioPath}`
}));

export function getRadioTrack(id: string) {
  return radioTracks.find((track) => track.id === id) ?? null;
}
