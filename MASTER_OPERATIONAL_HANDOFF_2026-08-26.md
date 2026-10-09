# KAM DRIDI — MASTER OPERATIONAL HANDOFF
## Canonical handoff for the next ChatGPT operational chat
**Timestamp:** 2026-08-26
**Repository:** `kamdridi-lgtm/kamdridi-site`
**Supabase project:** `retoydsgsuvznlpsguts`
**Purpose:** Continue the work autonomously without making Karim repeat the project history.

---

## 0. HOW THE NEXT CHAT MUST WORK

You are the operational continuation of the current MASTER chat for KAM DRIDI. Work in informal Quebec French unless Karim switches language. Karim prefers execution over planning: when he says “continue”, “vas-y”, “je te laisse poursuivre”, or “fait tout”, actually use the connected tools and complete safe high-impact work.

Do not invent completion. Use strict status language:
- SENT only with send evidence.
- SUBMITTED only with confirmation.
- RECEIVED only with receipt.
- REPLIED only after an actual reply.
- INTEREST only after substantive interest.
- AIRPLAY / BOOKED / LICENSED / SIGNED / RELEASED only with direct proof.

Never spend money, place manufacturing orders, ship products, accept contracts, grant rights/exclusivity, purchase travel, refund, or disclose banking/passport/home address without explicit approval. Checkouts may be enabled because Karim explicitly authorized opening/activating the store, but supplier auto-submit must remain FALSE unless he explicitly authorizes real spending/manufacturing.

**Japan hard lock:** no contacting, replying to, or negotiating with Toshi/Bickee/Japan-based targets. Japan = monitoring/reporting only unless Karim explicitly changes the lock.

---

## 1. CONNECTED SYSTEMS / HOW TO ACCESS THE WORK

The next chat should use the same connected tools when available:

- **GitHub** — repo `kamdridi-lgtm/kamdridi-site`; read/update files, commits, combined statuses.
- **Supabase** — project `retoydsgsuvznlpsguts`; source of truth for live unified commerce, fulfillment tasks, supplier mappings/integrations.
- **Vercel** — team `team_CJfwgPIAb9kVW7phHwXKSR7H`; deployment status can reliably be read via GitHub commit combined status even if Vercel direct lookup is awkward.
- **Stripe** — live account context `acct_1SvNi8GTOzOcyxK4`; hosted Checkout, no test purchase unless explicitly authorized.
- **Outlook** — signed-in mailbox is Karim’s mailbox; verify Sent after email sends.
- **Google Drive** — use for stored docs/registers; do not claim an upload unless connector confirms it.
- **Files library** — contains source PDFs/images and prior handoffs.
- **Opera Browser Connector** — useful for inspecting public KAMDRIDI/Printful/Kunaki pages when connection is enabled.
- **Printful** — no native connector, but the site’s server-side Printful token is valid and the public API health endpoint works. Never expose the token.
- **Kunaki** — public specs accessible; account login from browser has returned 403. No product/account IDs yet.
- **Merchize** — keychain candidate only; credentials not connected.

No passwords, API keys, webhook secrets, or private bearer tokens belong in this handoff.

---

## 2. CORE ARTIST / PUBLIC FACTS

Artist: **KAM DRIDI**
Website: https://kamdridi.com
EPK: https://kamdridi.com/press
Contact: kamdridi@hotmail.com

For OUR LOST DREAMS current US/studio campaign:
- release from ECHOES UNEARTHED
- released 2026-05-12
- album UPC 825233942565
- DistroKid display label: “5876021 Records DK”
- current US/studio ISRC: **QZZ7M2627617**
- music & lyrics: KARIM DRIDI
- vocals / instruments / producer: KARIM DRIDI
- final OUR LOST DREAMS audio was completely created with Suno from Karim’s own demo.
- Mediabase AI answer: YES.
- Mediabase status: SUBMITTED / RECEIVED / ENCODED CONFIRMED. Do not claim airplay/chart.

---

## 3. AUTOMATIONS / OUTREACH GUARDRAILS

Enabled automation: **Non-Japan Outreach Drive**, hourly. It may check non-Japan replies/outreach but must keep Japan locked.

Enabled automation: **KAMDRIDI Order Watch**, hourly condition watch. It checks new paid commerce orders and reports product/quantity/payment/shipping summary/fulfillment tasks. It must NOT submit supplier orders, spend money, manufacture, ship, refund, or alter the order.

One-offs from the broader campaign:
- RO JACK decision review Sep 20 2026, no automatic submission.
- Adelaide Fringe Sep 8 2026, check 2027 registration/fees/venue/visa, no automatic payment/legal commitment.

Important prior outreach:
- Room 7 / Travis Bengard: original demo was sent after provenance discussion; Travis replied that the demo was much stronger/closer to sync and said “Definitely keep them coming.” Status: REPLIED + INTEREST CONFIRMED / SYNC RELATIONSHIP OPEN. Not licensed/placed/signed.
- Bickee/Toshi Japan: proposal moved to 60/40 KAM DRIDI, but no agreement signed. See Japan section below.

---

## 4. COMMERCE ARCHITECTURE

Live unified commerce uses Supabase tables:
- `catalog_releases`
- `catalog_tracks`
- `catalog_products`
- `catalog_inventory`
- `commerce_orders`
- `commerce_order_items`
- `digital_entitlements`
- `digital_assets`
- `fulfillment_tasks`
- `inventory_movements`
- `supplier_integrations`
- `supplier_product_mappings`

Static fallback: `band-site/data/commerce-products.ts`.

The live storefront should use Supabase `commerce-catalog` via `band-site/lib/unified-commerce.ts`.

Stripe:
- hosted Checkout
- physical shipping countries currently: US, CA, GB, FR, DE, AU
- no separate shipping line/rate at present; selected products currently absorb shipping operationally
- checkout metadata identifies KAMDRIDI commerce order/products
- `commerce-stripe-webhook` is active, version 4
- paid physical products create fulfillment tasks
- no supplier order is auto-confirmed or auto-paid

Supplier routing safety:
- `automatic_submission=false`
- `auto_submit_supplier_order=false`
- `auto_submit_enabled=false`
unless Karim explicitly authorizes spending/manufacturing.

---

## 5. PRINTFUL MERCH — CURRENT ROUTING

Printful server connection was verified valid: token works, 1 store accessible, catalog accessible (~533 products).

### Tees — all checkout ON, fulfillment_mode=printful
All route to Printful product 71, Bella + Canvas 3001, DTG, large front.
- Salieri Tee — CA$59
- Echoes Unearthed Crest Tee — CA$52
- KAM DRIDI / Echoes Unearthed Wordmark Tee — CA$52
- Echoes Unearthed Excavation Tee — CA$52
- KAMDRIDI Gold Logo Tee — CA$52

Code in `band-site/lib/printful.ts` resolves size/color from the live Printful catalog and handles XXL → 2XL.

### Other active merch
- Salieri Hoodie CA$119 → Printful 146, Gildan 18500, black S–2XL, DTG front
- KAMDRIDI Gold Logo Hoodie CA$84 → same
- Salieri Mug CA$39 → Printful product 19, variant 1320, white 11 oz
- KAMDRIDI Logo Mug CA$56 → Printful product 300, variant 9323, black 11 oz
- Salieri Poster CA$49 → Printful product 1, variant 3876, matte poster 12×18
- War Machines Mini Poster CA$34 → same poster route
- KAMDRIDI Logo Snapback CA$80 → Printful product 99, Yupoong 6089M, black, one size, front embroidery; embroidery/digitization still required
- KAMDRIDI Boxed Logo Keychain CA$36 → Merchize candidate `ACKCUS`, 3 in acrylic, UV print, MOQ1 candidate. Credentials not connected.

Important: **mockup ≠ production print file**. Do not send site mockups to Printful as manufacturing art. Exact transparent production files/placements still need preflight.

A real transparent KAMDRIDI logo exists in the files library under:
`/KAMDRIDI/Manufacturing/PRINTFUL/TEES/KAMDRIDI_Official_Logo_Transparent.png`

---

## 6. 17 FOR EVER — AUSTRALIA

Live page: https://kamdridi.com/australia

Current products:
- CD CA$39, made-to-order / checkout ON
- 12-inch black vinyl CA$159, made-to-order / checkout ON
- cassette CA$49, made-to-order/preorder / checkout ON

Kunaki verified public production facts:
- CD jewel case: US$2/unit, MOQ1, full-color disc, 2-panel insert, tray card, cellophane, ~24h manufacturing
- black 12-inch stereo vinyl: US$36/unit, MOQ1, full-color labels, inner sleeve, full-color jacket, ~24h manufacturing
- cassette: public route was used as a MOQ1 candidate
- Kunaki can drop-ship and offers XML/HTTP/manual interfaces
- pending orders still require merchant funding; no auto-spend

Cassette prep:
`/mnt/data/17_FOR_EVER_KUNAKI_CASSETTE_READY.zip`

No actual Kunaki account product IDs are connected yet.

---

## 7. SALIERI’S HANDS — CANONICAL CURRENT STATE

All visible SALIERI’S HANDS products with prices have checkout enabled. Physical products are made-to-order / supplier-routed; no auto-submit.

Current key prices/routes:
- Collector CD CA$49 → Kunaki
- Limited Vinyl Edition CA$199 → Kunaki
- Hardcover Booklet CA$69 → First Press candidate, CDMPrint alternate, quote requested
- Special Edition Box CA$249 → manual/custom supplier; quote route sent to Elite Custom Boxes Canada
- Collector Coin CA$89 → manual/custom supplier; quote sent to CustomCoins.ca
- Collector Medallion CA$89 → same quote route
- Collector Bundle CA$349 → manual multi-component
- Digital Deluxe CA$16 → checkout ON; final HD masters not yet active
- Salieri merch → Printful as listed above

Catalog number: **KDR-SH-001**
Direct artist edition, no retail barcode required for current direct-sale configuration.

### Salieri 16-page corrected physical source
Canonical corrected booklet source used in this chat:
`SALIERIS_HANDS_BOOKLET_16P_CORRECTED (4).pdf`

The corrected booklet explicitly defines **THIRTEEN MOVEMENTS**:
1. Requiem
2. Shadows of Vienna
3. The Gift Was Not Mine
4. Divine Jealousy
5. Mozart’s Ghost
6. Invidia
7. Confession in C Minor
8. The Face of My Prayer
9. Fugue for the Unchosen
10. Salieri’s Hands
11. Salieri’s Hands - Classical Version
12. The Fall of the First Knight - Grand Opera Version
13. The Prism - Grand Opera Version

### Edition split — LOCKED POLICY
Supabase was reconciled to:
- **CD / booklet physical programme = 13 movements**
- **Vinyl = curated 9-track single LP**
- **Digital Deluxe = 14 tracks**

The 14-track digital edition keeps the German:
`Das Prisma: Requiem für meine Seele - Extended German Version`
as the additional digital-only bonus.

Do not collapse these back into one track count.

### Salieri final-audio blocker
Final HD WAV masters are NOT yet verified as ready for manufacturing.

There is an unresolved identity/name mapping for physical movements 12/13:
- booklet physical names: “The Fall of the First Knight - Grand Opera Version” and “The Prism - Grand Opera Version”
- current digital/master-catalog references use “The Fall of the First Knight - Requiem Aria” and “The Prism Requiem (Viennese Aria) - Extended English Version”

Do not guess that these are the exact same final masters. Verify WAV identity before CD manufacturing.

### Salieri single-LP curated 9-track sequence
Kunaki’s black 12-inch single record has a published **20 minute maximum per side**.

A 9-track curated sequence was locked using current MP3 reference durations only:

**SIDE A — reference 18:48.264**
1. Requiem — 3:02.496
2. The Gift Was Not Mine — 4:52.944
3. Mozart’s Ghost — 5:48.000
4. Confession in C Minor — 5:04.824

**SIDE B — reference 18:45.336**
1. Shadows of Vienna — 2:09.120
2. Divine Jealousy — 5:07.680
3. Invidia — 4:28.200
4. Fugue for the Unchosen — 1:58.656
5. Salieri’s Hands — 5:01.680

Total reference: 37:33.600.

These are NOT manufacturing-final timings. Reconfirm final HD WAV durations before product creation.

### Kunaki vinyl art spec
Official page reverified:
- 12-inch black 180g stereo
- max 20 minutes per side
- cover: 3675×3675 px
- labels: 990×990 px
- JPG/JPEG, RGB, 300 DPI, no bleed
- US$36/unit, MOQ1
- one standard record/jacket only; no 2LP in one package

Current Salieri site pack image is a reference/mockup, NOT yet supplier-ready vinyl jacket/labels.

### Salieri CD artwork
Original source/output files in current workspace:
- `/mnt/data/SALIERIS_HANDS_BOOKLET_16P_CORRECTED (4).pdf`
- `/mnt/data/SALIERIS_HANDS_JEWEL_CASE_ARTWORK_CONCEPT(2).pdf`
- `/mnt/data/FINAL_DIRECT_EDITIONS/SALIERIS_HANDS/SALIERIS_HANDS_BOOKLET_16P_DIRECT_ARTIST_EDITION.pdf`
- `/mnt/data/FINAL_DIRECT_EDITIONS/SALIERIS_HANDS/SALIERIS_HANDS_JEWEL_CASE_DIRECT_ARTIST_EDITION.pdf`

Kunaki-normalized CD V2 pack:
`/mnt/data/SALIERIS_HANDS_KUNAKI_CD_ARTWORK_READY_v2.zip`
SHA256:
`e1b6bd2b4fd848ccbf985e3f881c0a2cbbbae48be2f8ff44052559f90591e67e`

The V2 fixed the disc face: Kunaki requires a **square image with no embedded circular/hub masks**, because Kunaki masks the disc itself.

V2 dimensions:
- front 1423×1411
- inside 1423×1411
- tray 1772×1385
- disc 1394×1394 square/no mask

Supabase marks Salieri CD artwork QC as ready except final audio/title mapping.

Important: the attempt to persist this ZIP into the files library failed because that container session expired. Do not claim it is in Drive/library. It was created locally in the prior chat and should be regenerated from approved source if the sandbox file is not available in the next chat.

### Kunaki CD exact behavior
Official page reverified:
- jewel CD US$2/unit, MOQ1
- 2-panel insert only
- 700 MB / 80-minute published audio capacity
- web uploader inserts industry-standard 2-second gaps between tracks
- ISO/CUE upload exists for exact already-mastered audio
- art: JPG/JPEG, RGB, 300 DPI, no bleed
- disc 1394×1394 square, no masks
- front/insert 1423×1411
- tray 1772×1385 including spines
- spine ~74 px each

For live/transition-sensitive material, prefer final ISO/CUE after audio QC rather than allowing an unwanted automatic 2-second gap.

---

## 8. ECHOES UNlive IN BRASIL — CANONICAL CURRENT STATE

Catalog number: **KDR-EUB-001**
Direct Artist Edition.

Current live products:
- Expanded Edition / CD CA$69 → Kunaki, checkout ON
- Collector Booklet CA$39 → First Press candidate, checkout ON
- Deluxe Edition CA$229 → manual multi-component, checkout ON
- Digital Album CA$16 → final masters not active
- **NEW standalone Collector Vinyl Edition CA$159** → Kunaki candidate, checkout ON, added 2026-08-26

Standalone Brasil vinyl product id:
`echoes-brasil-vinyl-2026`
Description is transparent: single-LP programme will be curated from the canonical 14-track edition and finalized against Kunaki’s 20-min-per-side limit. No track sequence is promised yet because full reference/final durations have not been found.
Current blocker:
`final_reference_durations_curated_side_sequence_hd_wav_mapping_and_kunaki_product_id_required`
Artwork status: awaiting supplier-ready jacket/labels.
Static fallback was also updated in `band-site/data/commerce-products.ts` via commit `856e4c7f667e5400017e3d0e7f670640cd00300c`; verify its Vercel status before calling it LIVE.

### Canonical Brasil 14-track programme — LOCKED
1. Dream Machines
2. Michael Remembers
3. The Time of Signs
4. 17 Forever
5. Too Fast Too Young
6. For Some Dialog… (Interlude)
7. Alone Apart / One Apart
8. Our Lost Dreams
9. The Fall of the First Knight
10. War Machines
11. Junction Ahead (Brazil Club Unplugged)
12. Into the News (Semi-Acoustic Session)
13. Tough Boys Rumble (Night Session)
14. Dream Machines (Solo Remix)

Supabase drift was fixed:
- extra `brasil-13-for-some-dialog-unplugged` is now track_number 0, `archive-noncanonical`, excluded from release
- Tough Boys Rumble = canonical 13
- Dream Machines Solo Remix = canonical 14
- release canonical_track_count = 14

Do not restore the old accidental 15-track state.

### Brasil source/production documents
Source documents establish that the physical architecture historically contained three distinct physical objects:
1. premium CD
2. black vinyl
3. 16-page booklet

“KAM DRIDI LIVE COLLECTION” is an editorial identity, not automatically a heavy collector box.

The old production docs also state:
- final programme/durations must be checked against masters
- booklet is separate from Kunaki’s 2-panel insert
- no production until technical files are approved

### Brasil CD artwork
The existing normalized pack was visually QC’d:
- disc art is square/no embedded mask
- tray shows the canonical 14-track programme
- artwork marked ready, audio pending

Kunaki CD route = same verified specs above.
Because this is live-style material, ISO/CUE is preferred if final transitions must remain continuous.

### Brasil booklet
16 pages, target 4.75×4.75 in, saddle stitch.
First Press and CDMPrint quote requests were sent/verified; awaiting reply.

### Brasil Deluxe
Current exact catalog component manifest is:
- premium case
- black disc
- edition card

Do not silently add random components. Supplier grouping/shipping/component manufacturing quotes remain required.

---

## 9. VERIFIED SUPPLIER QUOTE EMAILS SENT 2026-08-26

### First Press
To: `info@firstpressprint.com`
Subject: `Short-run 4.75 × 4.75 music booklet quote`
Verified in Outlook Sent around 2026-08-26T21:53:35Z.

Requested:
- 4.75×4.75 in
- 16 pages
- full color
- saddle stitch
- premium/hardcover-equivalent 16-page alternative for Salieri
- qty 1 / 5 / 10
- pricing, turnaround, Montreal shipping/pickup
- bleed/safe/PDF specs
No production authorized.

### CDMPrint
To: `info@cdmprint.ca`
Subject: `Custom 4.75 × 4.75 booklet — short-run quote`
Verified in Outlook Sent around 2026-08-26T21:53:39Z.
Same scope.

### CustomCoins.ca
To: `info@customcoins.ca`
Subject: `Low-quantity collector coin / medallion quote`
Verified SENT 2026-08-26T22:28:34Z.
Asked pricing/minimums for 1/5/10, approx 1.75/2 in, two-sided relief/recessed, antique bronze, presentation option, art specs, setup and Montreal shipping. No production authorized.

### Elite Custom Boxes Canada
To: `quotes@elitecustomboxes.ca`
Subject: `Ultra-short-run rigid collector box quote`
Verified SENT 2026-08-26T22:28:37Z.
Asked 1/5/10 rigid/magnetic collector box, inserts, foil/embossing, prototype, dieline/specs, turnaround/Montreal. No production authorized.

Latest check found **no replies yet** from these four routes. Do not claim REPLIED/QUOTE RECEIVED until actual mail arrives.

---

## 10. RECENT GITHUB COMMITS / DEPLOYMENT TRUTH

Important recent commits:
- `9611a4a256e18213c9177a45aa6587e9a8d61af5` — Align Salieri physical copy with made-to-order fulfillment
- `725774ba4eb90cd6fd21eef5e5e3f89e7d33a1e9` — Use live unified catalog on Salieri release page
- `a9c6dcb878c3faed3897d8614df762e1f921a8ed` — Clarify Salieri 13-movement physical and 14-track digital editions
- `efa88485692f58fd7f9673d252979899d57cdc72` — Set Salieri vinyl as curated nine-track single LP — **Vercel SUCCESS verified**
- `856e4c7f667e5400017e3d0e7f670640cd00300c` — Restore standalone Brasil collector vinyl — deployment was still PENDING when this handoff section was written; re-check before claiming production deployment.

Older commit `038839ede36dbe1fa9c3054c155c8334ab5bb09a` had Vercel SUCCESS and proved the production branch recovered from an earlier series of build failures.

Use GitHub combined status on the newest commit before saying “LIVE/deployed”.

---

## 11. JAPAN / BICKEE — HARD LOCK

Contact: Toshi-san, `info@bickee-music.com`.

Status:
- REPLIED + INTEREST / NEGOTIATION ACTIVE historically
- proposal moved 55/45 → 60/40 in KAM DRIDI’s favor
- NOT signed, NOT licensed, NOT contract accepted
- no manufacturing/expedition authorized

Karim accepts giving Bickee 40% on the WAR MACHINES physical single if it creates a tangible Japan foothold, BUT scope must stay:
**WAR MACHINES physical maxi-single only**, no broad Japan exclusivity blocking ECHOES UNEARTHED, Tower/HMV, future albums, or direct DTC.

Latest proposed physical maxi track order:
1. War Machines
2. Too Fast Too Young — original/original Japan master
3. Our Lost Dreams — original/original Japan master
4. War Machines — Live Crowd Version physical bonus

Working catalog: `KDR-WM-JP-001`.

Latest Toshi next-step email was sent/verified around Aug 24. Prior check found no newer reply.
**Do not contact/reply/renegotiate Japan from this chat unless Karim explicitly lifts the lock.**

Tower dossier #000369 = ECHOES UNEARTHED — JAPAN EDITION, distribution evaluation only, not accepted.

---

## 12. IMMEDIATE NEXT ACTIONS FOR THE NEXT CHAT

Work in this order without re-asking Karim unless a legal/payment/final artistic decision truly requires him:

1. **Re-check deployment status of commit `856e4c7f...` and any newer main commit.**
2. **Audit the new Brasil vinyl on the public store/release page after deployment.** It should be visible, CA$159, checkout ON, made-to-order, no sequence promise yet.
3. **Find real full-length Brasil reference/final audio durations.** Public GitHub preview MP3s are only ~36-second previews and cannot be used to infer full durations. Search Drive/files/local asset manifests for full files. If full references are found, build a curated single-LP sequence with each side safely <20:00 and store exact reference durations in Supabase. Reconfirm later against final HD WAVs.
4. **Resolve Salieri physical movements 12/13 audio identity.** Determine whether the booklet “Grand Opera Version” titles map to current Requiem Aria/Viennese Aria files or require separate masters. Do not guess.
5. **Finish Salieri vinyl supplier artwork:** use approved Salieri visual identity, but prepare actual Kunaki files: cover 3675×3675 + side A/B labels 990×990 JPG RGB 300dpi no bleed. Do not merely upscale/mockup without preserving exact approved design/content.
6. **Continue Printful production-file work** for tees/hoodies/mugs/posters/snapback: exact transparent art, wrap/placement, embroidery digitization. Keep checkout open, no auto supplier confirmation.
7. **Monitor supplier replies** from First Press, CDMPrint, CustomCoins, Elite Custom Boxes. When a reply arrives, classify truthfully and update Supabase with real MOQ/prices/specs. Do not accept/order automatically.
8. **No Kunaki manufacture until final audio/product ID is ready and Karim explicitly authorizes spending.**
9. **Keep this handoff updated** whenever a major new lock/status/commit is created so the next MASTER chat can fetch one canonical source.

---

## 13. IMPORTANT CREATIVE / BRAND RULES

- Preserve exact KAM DRIDI logo geometry; no letter deformation.
- Do not replace approved artwork with generic generated alternatives.
- Mockups are references; manufacturing files must be built separately to supplier specs.
- SALIERI’S HANDS visual language: dark baroque / black / gold / amber / manuscript/Vienna world.
- ECHOES UNlive in Brasil: black / amber / dark red / aged gold; `UN` red when typography rule applies; “UNlive in Brasil” branding.
- KAMDRIDI RECORDS can be treated as working imprint where already locked; do not invent legal entity status.
- Do not invent barcode, UPC, ISRC, copyright ownership, mastering credits, venue/location, live performer credits, supplier proof, or manufacturing approval.

---

## 14. USER WORK STYLE

Karim does not want the next chat to restart from zero or repeatedly ask him what to do. He wants the assistant to decide and execute the safe operational work, report what is truly done, and leave only real external blockers.

When he says “continue”, continue using tools. Do not merely provide a list of what could be done.

**END OF CANONICAL HANDOFF**
