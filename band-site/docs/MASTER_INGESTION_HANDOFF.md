# KAMDRIDI master ingestion handoff

This is the single workflow for every new HD master. It keeps the original master out of the public website, generates the radio copy and the 36-second sales preview, verifies both, and leaves a receipt with hashes and technical metadata.

## What is already registered

- `Echoes Unearthed`: 10 full radio tracks live and protected from accidental replacement.
- `ECHOES UN LIVE IN BRASIL`: 15 master slots.
- `Salieri's Hands`: 10 album tracks plus 4 bonus tracks.
- `17 FOR EVER — Australia`: 4 maxi-single versions.
- `KAMDRIDI Singles Archive`: the six known standalone editions.
- `Twice Upon a Time`: collection reserved; tracks remain intentionally empty until the approved final tracklist exists.

The authoritative list is `data/master-catalog.json`. A future track is invisible to Signal Radio until `radioEnabled` becomes `true` after a successful conversion and review. Existing 36-second previews are never mistaken for masters.

## When a master arrives

1. Put the original WAV, FLAC, AIF, or AIFF in `band-site/masters-inbox/`. That directory is ignored by Git.
2. Identify its exact track ID:

   ```bash
   jq -r '.tracks[] | select(.radioEnabled == false) | [.id, .title, (.version // "")] | @tsv' data/master-catalog.json
   ```

3. Generate the web files without activating the radio:

   ```bash
   npm run masters:prepare -- --track brasil-01-dream-machines --input masters-inbox/master.wav
   ```

4. Verify the entire catalog:

   ```bash
   npm run masters:verify
   ```

5. After listening and confirming the exact title/version/order, run the same command with `--activate --force`. `--force` is deliberately required when a page preview already exists:

   ```bash
   npm run masters:prepare -- --track brasil-01-dream-machines --input masters-inbox/master.wav --activate --force
   ```

6. Run `npm run masters:verify`, `npm run lint`, and `npm run build` before deployment.

## Output rules

- Original HD masters are never copied into `public/` and are never committed to GitHub.
- Full Signal Radio copies are 320 kbps MP3 files.
- Store/release previews are exactly 36 seconds at 256 kbps MP3.
- The tool does not normalize, limit, remix, or otherwise remaster the supplied audio.
- The title, version, album, artist, and track number come from the approved catalog, not from an unreliable upload filename.
- A SHA-256 receipt is written to `data/master-receipts/` for every processed master.
- A full track shorter than 60 seconds is rejected, which prevents a preview from entering the radio by mistake.

## Safe publication rule

Do not activate a master merely because the conversion succeeded. Activation happens only after the supplied master has been matched to the correct catalog slot and its title/version/order have been confirmed. This protects similar titles such as the album, demo, live, classical, and Australian versions.
