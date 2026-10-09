export type AiArtistRelease = {
  title: string;
  type: "Single" | "EP" | "Album";
  status: "writing" | "production" | "ready" | "released";
  year: string;
  description: string;
  audioUrl?: string;
  duration?: string;
  releaseDate?: string;
};

export type AiArtistTrack = {
  title: string;
  status: "ready" | "in production" | "coming soon";
};

export type AiArtist = {
  slug: string;
  name: string;
  genre: string;
  badge: string;
  slogan: string;
  disclosure: string;
  images: {
    hero: string;
    portrait: string;
    cover: string;
    altWide: string;
    darkChurch: string;
  };
  genres: string[];
  positioningLine: string;
  shortBio: string;
  longBio: string[];
  visualDirection: string[];
  sonicDirection: string[];
  members: { name: string; role: string }[];
  releases: AiArtistRelease[];
  epTitle: string;
  tracklist: AiArtistTrack[];
  lyricsTitle?: string;
  lyrics?: string;
  coverPrompt: string;
};

export const aiArtists: AiArtist[] = [
  {
    slug: "iron-county-ghosts",
    name: "IRON COUNTY GHOSTS",
    genre: "Dark Country / Outlaw Americana",
    badge: "Official Artist Site",
    slogan: "Country music for roads that never forgive.",
    disclosure:
      "IRON COUNTY GHOSTS is a fictional AI-assisted country-rock project created and produced by KAMDRIDI RECORDS.",
    images: {
      hero: "/assets/images/label/iron-county-ghosts/band-hero.png",
      portrait: "/assets/images/label/iron-county-ghosts/lead-portrait.png",
      cover: "/assets/images/label/iron-county-ghosts/dust-on-the-altar-cover.png",
      altWide: "/assets/images/label/iron-county-ghosts/band-stage-spotlight.png",
      darkChurch: "/assets/images/label/iron-county-ghosts/live-side-stage-angle.png"
    },
    genres: ["Dark Country", "Outlaw Country", "Southern Gothic Americana", "Cinematic Western Rock", "Country-Rock"],
    positioningLine:
      "A haunted country-rock project built around a young powerful female lead voice, dusty revenge stories, and the ghosts of Iron County.",
    shortBio:
      "A dark country-rock project from KAMDRIDI RECORDS blending outlaw country, southern gothic Americana, and cinematic western rock with songs about broken roads, dead towns, lost love, whiskey bars, abandoned churches, revenge, redemption, and ghosts that never stop following you.",
    longBio: [
      "The project blends outlaw country, southern gothic atmosphere, cinematic Americana, and heavy emotional storytelling.",
      "The band lives inside the KAMDRIDI RECORDS roster, with songs, visuals, and releases produced under the label direction.",
      "The songs follow rusted towns, old family wounds, lost love, whiskey prayers, and highways that feel alive after midnight."
    ],
    visualDirection: [
      "Abandoned southern church at night",
      "Dusty altar, broken stained glass, moonlight, rusted pickup",
      "Amber, black, smoke, motel neon, highway rain",
      "Premium dark country cover art, no parody, no cartoon look"
    ],
    sonicDirection: [
      "78-86 BPM, D minor or E minor",
      "Baritone electric guitar, acoustic guitar, pedal steel, low toms",
      "Subtle organ, distant choir, cinematic reverb",
      "Young powerful female lead vocal with deep male backing responses"
    ],
    members: [
      { name: "June Marlowe", role: "Lead Vocal / Frontwoman" },
      { name: "Caleb Rusk", role: "Baritone Vocal / Acoustic Guitar" },
      { name: "Eli Cross", role: "Electric Guitar / Pedal Steel" },
      { name: "The Ghost", role: "Drums / Percussion / Atmosphere" }
    ],
    releases: [
      {
        title: "Dust on the Altar",
        type: "EP",
        status: "writing",
        year: "2026",
        description: "The debut EP: five songs about regret, faith, ghosts, and roads that do not forgive."
      },
      {
        title: "Dust on the Altar",
        type: "Single",
        status: "released",
        year: "2026",
        description: "Lead single. A man returns to his hometown and finds only an empty church and the weight of what he left behind.",
        audioUrl: "/audio/dust-on-the-altar.mp3",
        releaseDate: "May 23, 2026"
      },
      {
        title: "Highway 17 Ghost",
        type: "Single",
        status: "writing",
        year: "2026",
        description: "A haunted highway song built around slow drums, tremolo guitar, and a chorus made for night driving."
      }
    ],
    epTitle: "Dust on the Altar",
    tracklist: [
      { title: "Dust on the Altar", status: "ready" },
      { title: "Highway 17 Ghost", status: "in production" },
      { title: "Whiskey Don't Pray", status: "in production" },
      { title: "Mama Left the Porch Light On", status: "coming soon" },
      { title: "Black River Sunday", status: "coming soon" }
    ],
    lyricsTitle: "Dust on the Altar",
    lyrics: `Dust on the Altar
IRON COUNTY GHOSTS

[Intro]
Church bell rings in a dead-end town
Boots hit dirt where the sun goes down
Wind keeps whispering my father's name
And every old road still remembers my shame

[Verse 1]
I came back west with a guitar case
A little black dress and a sinner's face
There was blood-red dust on the county line
And a bottle full of ghosts in the passenger side

The motel sign was missing three lights
The bar still burned like a bad goodbye
Mama's porch had fallen through
But the church still stood like it always knew

[Pre-Chorus]
I left a prayer where the candles died
I left a tear where the angels cried
And I heard your voice through the broken door
Saying, girl, don't run no more

[Chorus]
There's dust on the altar
Smoke in the sky
A Bible wide open
Where the old dreams die

There's whiskey in the water
Fire in my name
I came back a stranger
But the town stayed the same

If heaven won't answer
And the devil won't call
I'll sing to the shadows
Till the last walls fall

There's dust on the altar
And ghosts in the hall
Dust on the altar
I came back for it all

[Verse 2]
Highway 17 took my innocence
Left me standing on the wrong side of the fence
He said forever with a silver ring
Then sold my heart for a song to sing

Now the boys stand back like loaded guns
Black shirts burning in the dying sun
They don't talk much, they don't need to
Every scar knows what we've been through

[Pre-Chorus 2]
I lit a match where the choir once stood
Watched the flame turn the bad into good
And I heard my name in the chapel floor
Saying, girl, don't beg no more

[Chorus]
There's dust on the altar
Smoke in the sky
A Bible wide open
Where the old dreams die

There's whiskey in the water
Fire in my name
I came back a stranger
But the town stayed the same

If heaven won't answer
And the devil won't call
I'll sing to the shadows
Till the last walls fall

There's dust on the altar
And ghosts in the hall
Dust on the altar
I came back for it all

[Bridge]
Bury me low where the black river bends
Where the road runs out and the truth begins
Tell every liar, tell every saint
I was born in fire, I was not born faint

Ring that bell for the ones who lied
Ring that bell for the love that died
Ring that bell till the whole town knows
Iron County don't bury ghosts

[Final Chorus]
There's dust on the altar
Smoke in the sky
A Bible wide open
Where the old dreams die

There's whiskey in the water
Fire in my name
I came back a stranger
But I don't feel the same

If heaven won't answer
And the devil won't call
I'll stand in the doorway
And outlive them all

There's dust on the altar
And ghosts in the hall
Dust on the altar
I came back for it all

[Outro]
Church bell fades in the evening light
Boots walk slow through the dust and night
No more running, no more shame
Iron County remembers my name`,
    coverPrompt:
      "dark cinematic country album cover, abandoned southern church at night, dusty altar, old wooden pews, moonlight through broken stained glass, a lone cowboy silhouette at the door, rusted pickup outside, warm amber and deep black tones, gritty film texture, premium music cover art, no text"
  }
];

export function getAiArtist(slug: string) {
  return aiArtists.find((artist) => artist.slug === slug) ?? null;
}
