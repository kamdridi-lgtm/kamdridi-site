import masterCatalog from "@/data/master-catalog.json";

export type MasterCatalogTrack = {
  id: string;
  collectionId: string;
  trackNumber: number;
  title: string;
  version?: string;
  previewPath?: string;
  previewAvailable?: boolean;
};

const tracks = masterCatalog.tracks as MasterCatalogTrack[];

export function getMasterTrack(trackId: string) {
  return tracks.find((track) => track.id === trackId) ?? null;
}

export function getPreparedPreview(trackId: string) {
  const track = getMasterTrack(trackId);
  if (!track?.previewAvailable || !track.previewPath) return undefined;
  return `/${track.previewPath}`;
}
