# Codex 1 Integration Notes

These notes are for Codex 1 after public-site work is finished. Do not deploy until lint/build checks pass and Kam has reviewed mobile.

## Recommended Final Copy Locations

- Homepage KAMDRIDI RECORDS block: use `HOMEPAGE_LABEL_BLOCK_COPY.md`.
- `/releases`: use `RELEASES_PAGE_COPY.md`.
- `/submit`: use `SUBMIT_PAGE_COPY.md`.
- Licensing/sync section: use `LICENSING_SECTION_COPY.md`.
- Label Assistant FAQ responses: use `CHATBOT_FAQ_COPY.md`.
- Mobile manual QA: use `MOBILE_QA_CHECKLIST.md`.

## Sections That Need Checking

- Homepage label block visibility
- Label page package language
- Roster wording and confirmed project list
- Releases page metadata and links
- Submit page mailto link
- Licensing/sync wording
- Label Assistant answers
- Mobile navigation and CTAs
- Footer links

## Public Routes Expected

- `/`
- `/label`
- `/roster`
- `/releases`
- `/submit`
- `/iron-county-ghosts`

## No-Deploy Warning

Do not deploy until:

- Lint passes
- Build passes
- Public routes load locally
- Mobile QA is checked
- No fake Stripe links exist
- No fake forms exist
- No fake streaming links or metadata exist

## Route Checks

- [ ] `/` loads
- [ ] `/label` loads
- [ ] `/roster` loads
- [ ] `/releases` loads
- [ ] `/submit` loads
- [ ] `/iron-county-ghosts` loads
- [ ] Mailto links open email
- [ ] Chatbot opens and closes
- [ ] Chatbot gives safe FAQ answers
- [ ] Footer links work
