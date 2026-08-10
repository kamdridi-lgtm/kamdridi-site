export type RadioTrack = {
  id: string;
  title: string;
  frequency: string;
  pathname: string;
};

const radioBasePath = "radio/echoes-unearthed";

export const radioTracks: RadioTrack[] = [
  { id: "war-machines", title: "War Machines", frequency: "87.7", pathname: `${radioBasePath}/01-war-machines-radio.mp3` },
  { id: "too-fast-too-young", title: "Too Fast Too Young", frequency: "89.1", pathname: `${radioBasePath}/02-too-fast-too-young-radio.mp3` },
  { id: "our-lost-dreams", title: "Our Lost Dreams", frequency: "90.4", pathname: `${radioBasePath}/03-our-lost-dreams-radio.mp3` },
  { id: "junction-ahead", title: "Junction Ahead (New Heaven's Odyssey)", frequency: "91.3", pathname: `${radioBasePath}/04-junction-ahead-new-heavens-odyssey-radio.mp3` },
  { id: "17-for-ever", title: "17 For Ever", frequency: "93.7", pathname: `${radioBasePath}/05-17-for-ever-radio.mp3` },
  { id: "the-victory-goes-on", title: "The Victory Goes On", frequency: "95.1", pathname: `${radioBasePath}/06-the-victory-goes-on-radio.mp3` },
  { id: "alone-apart-one-apart", title: "Alone Apart / One Apart", frequency: "96.9", pathname: `${radioBasePath}/07-alone-apart-one-apart-radio.mp3` },
  { id: "michael-remembers", title: "Michael Remembers", frequency: "98.4", pathname: `${radioBasePath}/08-michael-remembers-radio.mp3` },
  { id: "the-fall-of-the-first-knight", title: "The Fall of the First Knight", frequency: "99.8", pathname: `${radioBasePath}/09-the-fall-of-the-first-knight-radio.mp3` },
  { id: "echoes-of-our-youth", title: "Echoes of Our Youth", frequency: "101.3", pathname: `${radioBasePath}/10-echoes-of-our-youth-radio.mp3` }
];

export function getRadioTrack(id: string) {
  return radioTracks.find((track) => track.id === id) ?? null;
}
