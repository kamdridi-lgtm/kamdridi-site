# KAMDRIDI RECORDS Label Dashboard Schema

Purpose: design a future Airtable, Notion, or Supabase-style back-office dashboard for artists, releases, rights, campaigns, and sync.

Use simple IDs, consistent status fields, and linked records where possible. This is a planning schema, not a finished database.

## Artists

Tracks every artist, band, prospect, and active project.

| Field | Type / Notes |
| --- | --- |
| artist_id | Unique ID |
| artist_name | Public artist or band name |
| legal/contact name | Real name or main contact |
| email | Primary email |
| phone/WhatsApp | Optional direct contact |
| location | City, region, country |
| genre | Primary genre or style |
| status | prospect / submitted / reviewing / selected / active / archived |
| score | Internal review score |
| notes | Review, communication, and project notes |
| links | Music, social, website, EPK links |

## Releases

Tracks singles, EPs, albums, demos, and archived release plans.

| Field | Type / Notes |
| --- | --- |
| release_id | Unique ID |
| artist | Linked artist |
| title | Release title |
| type | single / EP / album |
| status | demo / in production / scheduled / released / archived |
| release date | Target or actual release date |
| distributor | Distributor name or direct/manual status |
| UPC | UPC if available |
| cover art status | missing / draft / approved / delivered |
| master status | missing / demo / final / approved |
| EPK status | not started / draft / approved / live |
| website status | not needed / needed / draft / live |
| promo status | not started / planned / active / complete |

## Tracks

Tracks song-level metadata and assets.

| Field | Type / Notes |
| --- | --- |
| track_id | Unique ID |
| release | Linked release |
| title | Track title |
| ISRC | ISRC if available |
| writers | Songwriter names |
| producers | Producer names |
| performers | Main and featured performers |
| BPM | Tempo |
| key | Musical key |
| explicit | yes / no / unknown |
| language | Primary language |
| lyrics status | missing / draft / final / approved |
| master file | File location or link |
| instrumental file | File location or link |
| stems status | missing / partial / available |

## Rights

Tracks ownership, splits, agreement status, and clearance notes.

| Field | Type / Notes |
| --- | --- |
| track | Linked track |
| master owner | Person/entity controlling the master |
| publishing owner | Person/entity controlling publishing |
| songwriter splits | Split percentages or linked split sheet |
| producer splits | Producer share/points if applicable |
| agreement status | missing / draft / signed / needs review |
| clearance notes | Samples, beat licenses, approvals, concerns |

## Campaigns

Tracks release promotion and content execution.

| Field | Type / Notes |
| --- | --- |
| release | Linked release |
| announcement date | Planned announcement date |
| teaser posts | Planned/complete notes |
| release day posts | Planned/complete notes |
| follow-up posts | Planned/complete notes |
| press outreach | Targets, sent status, responses |
| newsletter | Draft/sent/not needed |
| assets ready | yes / no / partial |
| status | not started / planning / active / complete / paused |

## Sync

Tracks licensing readiness and searchable music details.

| Field | Type / Notes |
| --- | --- |
| track | Linked track |
| one-stop | yes / no / unknown |
| instrumental available | yes / no |
| stems available | yes / no / partial |
| clean version | yes / no / not needed |
| mood tags | Mood keywords |
| genre tags | Genre keywords |
| BPM | Tempo |
| key | Musical key |
| clearance contact | Person/email authorized to respond |
| sync status | not ready / ready / pitched / hold / placed |

## Practical Rules

- Do not mark a release ready until rights, metadata, artwork, and master status are clear.
- Do not mark a track sync-ready until ownership and clearance contact are clear.
- Keep public claims separate from internal notes.
- Archive old prospects instead of deleting useful history.
