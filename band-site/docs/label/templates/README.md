# KAMDRIDI RECORDS Importable Templates

These CSV files are back-office templates for a future KAMDRIDI RECORDS dashboard. They can later be imported into Airtable, Notion, Supabase, Google Sheets, or a custom admin dashboard.

Do not publish private artist information. Treat contact details, rights notes, payment notes, and submission notes as internal data.

Legal and rights fields must be confirmed before any real release, pitch, licensing discussion, or revenue split. Sync fields must be reviewed before pitching music to supervisors, libraries, agencies, or brands.

## Files

- `artists.csv` - Artist/project CRM records with contact, status, score, links, and notes.
- `releases.csv` - Release-level records for singles, EPs, albums, status, assets, distributor, and promo readiness.
- `tracks.csv` - Track-level metadata including credits, BPM, key, language, lyrics status, files, moods, and genres.
- `rights.csv` - Rights and clearance tracker for master ownership, publishing ownership, splits, agreements, and one-stop status.
- `campaigns.csv` - Release campaign tracker for announcement dates, posts, newsletter, press, website updates, and status.
- `sync_catalog.csv` - Sync-readiness catalog with one-stop status, instrumentals, stems, clean versions, tags, clearance contact, and notes.
- `submissions.csv` - Artist submission tracker for intake, review score, notes, status, and next action.
- `tasks.csv` - Internal task tracker for label operations, releases, rights, campaigns, and follow-up work.

## Import Notes

- Keep IDs stable after import.
- Use `to_confirm` for fields that need manual verification.
- Leave unknown non-required fields blank.
- Do not mark `one_stop_status` as `yes` unless master and publishing clearance are confirmed.
- Do not use sample rows as legal ownership records.
