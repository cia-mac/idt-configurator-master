---
workflow_step: idt_claude_md_pushed_stage_deployed
agent_type: execute
token_budget: deep
last_updated: 2026-10-13
---
## 2026-10-13 EXIT (2) - CLAUDE.md for v2.0.1, lane repo pushed, new /idt build on stage and deployed there (CLOSED)

Snapshot before this block: none (append only).
Follow-up to the closing block above. Updated this lane's CLAUDE.md, pushed the lane repo, put the new build into the stage clone, and deployed the stage site, each on Cia's explicit go.

### Done
- [observed] CLAUDE.md rewritten for v2.0.1 (case-study status, ciamac.com/idt deploy sequence, corrected rules, OPEN items); previous copy kept as CLAUDE_v_2026-10-13_pre_v2.0.1.md; commit ebaea2b.
- [observed] Lane repo pushed to cia-mac/idt-configurator-master: abe6c35..c04c279, then c04c279..ebaea2b (git push output); `git status -sb` read level with origin at that time.
- [observed] Stage clone deploy/idt synced from the live clone build (identical, diff -rq empty), committed path-limited as 7c1987f; a session working in that clone then merged and pushed stage, so origin/stage contains 7c1987f and its deploy/idt equals the live build (git archive diff).
- [observed] My own merge of origin/stage (only conflict: SESSION_STATE.md, resolved by keeping both sides' blocks) was built in a temp worktree and never pushed, because origin/stage moved first; worktree and branch tmp-stage-merge deleted.
- [observed] Stage site deployed from ~/Developer/ciamac-site-stage/deploy (HEAD fd68cc5 plus 24 modified and 3 untracked files from another session): https://ciamac-site-stage.vercel.app/idt 200 with index-rvUYfdqy.js, sugarcube-alt 248973 B, renders 404.

### Previous pending
- done: push this lane's two commits -> pushed (above)
- done: CLAUDE.md still describes the old version -> updated (above)
- done: stage clone deploy/idt old build -> synced and deployed on stage
- carried: IDT spec sheet for the est. fps rows; four data questions, now written into CLAUDE.md as OPEN (TC pairing, RT III hub, Helios note, hidden vs greyed resolved in docs)
- carried: preview tool reads another launch.json than this lane's master-engine entry
- dropped: guardrail "do not expose the guided configurator to Luiz" is moot; left in CLAUDE.md for Cia to drop

### Pending / open
- This block's own commit is local (SESSION_STATE.md); push needs Cia's go.
- Cia to rule on the TC pairing rule and the RT III hub question (CLAUDE.md OPEN lines).

### Operational notes
- Two sessions were working in the stage clone at once; origin/stage moved twice within minutes. Check `git fetch` immediately before any push there.
- Session Log row for this session already exists (2026-10-13 row, filed in the closing block); not duplicated.

### Durable thought
none, reason: nothing new beyond what the blocks and CLAUDE.md now record.

### Repo state

Computed by `exit-stamp` at 2026-10-13T18:48:40-07:00. Do not edit by hand; re-run it.

- repo: `~/Developer/archive/idt-configurator-master`
- branch: `main`
- HEAD: `ebaea2b docs: CLAUDE.md for v2.0.1 (case study status, ciamac.com/idt deploy, corrected rules, open questions)` (committed 2026-10-13)
- tree: clean
- upstream: origin/main (ahead 0, behind 0)
- merged into HEAD: none
- NOT merged into HEAD: none
- test: `npm test` -> exit 0: # duration_ms 1243.726333

### Why we stopped
finished

Stage clone at close: ## stage...origin/stage. Live clone at close: ## main...origin/main.

---

## 2026-10-13 EXIT - Push of the live site repo, session closed (CLOSED)

Snapshot before this block: none (append only).
Closing block. After the deploy block was written, Cia said "go" and the live site repo was pushed; this records that and closes the session.

### Done
- [observed] Pushed ~/Developer/ciamac-site main to origin (b713579..d15f53c), carrying d15f53c (idt) and 6396181 (Theodore sync, already live); evidence: git push output and `git status -sb` afterwards: ## main...origin/main [ahead 2].
- [observed] Local dev servers on 5177 and 5178 stopped; lsof shows no listeners.

### Previous pending
- done: Live clone ahead of origin by 2, not pushed -> pushed (Done line above)
- carried: Stage clone deploy/idt still the old build
- carried: spec sheet from IDT for "est." windowed fps; four data questions (RT III hub vs directUsbc, TC pairing doc, Helios note, hidden vs greyed docs)
- carried: this lane's own repo (cia-mac/idt-configurator-master, GitHub Pages) not pushed; commits 22cfea4 and de56098 are local only
- carried: preview tool reads another launch.json than this lane's master-engine entry
- dropped: Site SESSION_STATE.md edits in the live clone belong to another session; not mine to resolve

### Pending / open
- Push this lane's two commits to GitHub only on Cia's go (it would also change the old GitHub Pages deploy).
- CLAUDE.md in this lane still says v2.0.0, "incompatible cameras are hidden", and the gold/Master Engine framing; not edited this session.

### Operational notes
- none beyond the previous two blocks.

### Durable thought
none, reason: nothing new beyond the specifics already in the blocks and commits.

### Repo state

Computed by `exit-stamp` at 2026-10-13T18:10:05-07:00. Do not edit by hand; re-run it.

- repo: `~/Developer/archive/idt-configurator-master`
- branch: `main`
- HEAD: `de56098 session_state: 2026-10-11 exit blocks` (committed 2026-10-11)
- tree: clean
- upstream: origin/main (ahead 2, behind 0)
- merged into HEAD: none
- NOT merged into HEAD: none
- test: `npm test` -> exit 0: # duration_ms 88.745125

### Why we stopped
finished

---

## 2026-10-11 EXIT - IDT System Configurator: verified, branded, deployed to ciamac.com/idt (CLOSED)

Snapshot before this block: none (append only).
Continuation of the audit block below. Verified the changes in the browser, restyled to the ciamac.com styleguide at Cia's direction (IDT is not the brand; the page lives on Cia's site), retitled to "IDT System Configurator", committed, and deployed live on Cia's "go".

### Done
- [observed] Verified in browser at 1280/1440, 900 (stepper), 375: Helios + RT III no longer co-selectable (processor clears, RT III greyed); evidence: screenshots in session, live re-test on https://ciamac.com/idt.
- [observed] Brand: Caspian #4d7fe0 replaces gold, ink/bone, Helvetica Neue + system mono, Google Fonts removed, header "IDT System Configurator", gold IDT wordmark and MASTER ENGINE tag removed, XSLink hub kept distinct in bone; selected camera/processor now scroll into view so the cable no longer draws off-screen. Evidence: commit 22cfea4 in this repo.
- [observed] Built with --base=/idt/, analytics tag a.ciamac.com/t.js re-added, committed in ~/Developer/ciamac-site as d15f53c (path-limited to deploy/idt; 92 renders deleted, history keeps them), deployed with vercel --prod from deploy/. Live bundle index-rvUYfdqy.js, 0 broken images, sugarcube-alt 248973 B, /idt/images/renders now 404, verify-live-media.sh: 0 missing.
- [observed] Checked the other pending live-clone commit (Theodore 6396181) was already live (only Cloudflare email obfuscation differs) before deploying.

### Previous pending
- carried: Live copy not updated -> done (deployed d15f53c)
- done: Visual check of new build -> done above
- carried: data questions for IDT (RT III hub vs directUsbc, TC pairing doc, Helios note, hidden vs greyed docs)

### Pending / open
- Live clone is ahead of origin/main by 2 commits (d15f53c, Theodore 6396181); NOT pushed. Needs Cia's go.
- Site SESSION_STATE.md in the live clone has someone else's uncommitted edits; not touched.
- Stage clone deploy/idt still has the old build.
- The "est." windowed fps and the data questions need IDT's spec sheet (never delivered).
- Preview tool reads a different launch.json than this lane's; used a manual vite server (stopped).

### Operational notes
- Outside the sandbox TMPDIR differs from the in-sandbox one (/tmp/claude-501); a cd with the wrong TMPDIR silently ran in the repo dir once. No damage; verified git clean.
- vercel --prod from ~/Developer/ciamac-site/deploy is allowed by the gate in this session.

### Durable thought
none, reason: specifics recorded here and in commits.

### Repo state

Computed by `exit-stamp` at 2026-10-11T18:12:10-07:00. Do not edit by hand; re-run it.

- repo: `~/Developer/archive/idt-configurator-master`
- branch: `main`
- HEAD: `22cfea4 [v2.0.1] audit fixes, brand restyle, weight` (committed 2026-10-11)
- tree: clean
- upstream: origin/main (ahead 1, behind 0)
- merged into HEAD: none
- NOT merged into HEAD: none
- test: `npm test` -> exit 0: # duration_ms 78.392792

### Why we stopped
finished

---

## 2026-10-11 EXIT - Audit and debug of ciamac.com/idt configurator, GUI cleanup (OPEN)

Snapshot before this block: none (append only).
Audited the configurator behind ciamac.com/idt (case study; never accepted or paid by IDT). Fixed logic bugs and layout in this lane's source. Nothing committed, pushed or deployed. Visual check of the new build not done: the dev server could not be started until the folder switch took effect.

### Done
- [observed] Reproduced on the live page: Helios 8K² + RT III Compact selectable together despite the catalog restriction (chain bar read "Helios 8K² -> RT III Compact"); evidence: browser pane on https://ciamac.com/idt, 2026-10-11. Fixed in src/App.jsx (selectProcessor, selectFamily, availableProcs, availableFamilies, mobile click guard).
- [observed] Fixed: mobile detail kept the previous camera's thumbnail index (SugarCube has 1 angle, others 5-6) -> key on family + fallback to angles[0]; hooks-order violation in CameraHero and MobileCameraDetail (useState after early return); connectionModes useMemo missing hybridModes dep. Evidence: git diff src/App.jsx.
- [observed] Windowed FPS rows now tagged "est." with a footnote (live page headlined 683 fps for Helios 8K², native 90 fps; formula in CameraHero is rawFps * nativeH / tierHeight, not a spec).
- [observed] Layout: desktop breakpoint 768 -> 1180 (DESKTOP_MIN_WIDTH), strip widths clamp(220px,19vw,280px), group headers 28 -> 18px, cell padding reduced, spec grid wraps. Evidence: diff. NOT visually verified.
- [observed] Weight: sugarcube-alt.png 19.7 MB (6666x5000 16-bit) -> 249 KB 1600px, original kept at _unshipped/originals/sugarcube-alt_v1_6666x5000.png; unreferenced public/images/renders (92 MB) moved to _unshipped/renders_v1. Evidence: ls, du.
- [observed] PWA manifest start_url/scope pointed at /idt-configurator-live/ (dead path on ciamac.com/idt) and icon paths 404 from the hashed asset folder; manifest.json now uses ../ paths. Evidence: live manifest-BNB_gD3I.json content.
- [observed] package.json had no test script (CLAUDE.md referenced npm test); added "test": "node --test tests/constraints.test.js". 102/102 pass, build ok (stamp below).
- [inferred] tests/constraints.test.js reimplements the rules as pure functions instead of importing App.jsx, so it could not catch the Helios/RT III order bug; inferred from reading the test header and the passing suite alongside the live repro.

### Previous pending
- carried: none beyond below
- done: wire up test runner (no test script) -> test script added this session
- done: push the 4 unpushed commits -> stamp shows upstream ahead 0 (the push happened at some point)

### Pending / open
- Visual check of the new build in the browser at 1280, 1440, 1920 and a tablet width (needs the master-engine dev server from this folder).
- Live copy at ~/Developer/ciamac-site/deploy/idt is a different build (index-h2hAGM0p.js, base /idt/) and is NOT updated. Rebuilding with --base=/idt/ and deploying needs Cia's explicit go and the DEPLOY.md flow. The deployed folder is 270 MB.
- Open data questions for IDT: RT III shows an XSLink hub for USB-C cameras although catalog has directUsbc:2; CLAUDE.md says TC processors pair only with Phoenix HD/UHD but code and tests allow all fiber cameras; Helios 8K² note says 8Kx6K@120fps vs fps 90; CLAUDE.md says incompatible cameras are hidden but code greys them.

### Operational notes
- LANES.md has no row for the Site /idt surface; the lane maps to idt-configurator-master (row truncated in the table).
- sips cannot write inside the sandbox temp; PIL worked.
- vite.config.js base is /idt-configurator-master/ (frozen); the live /idt build was made with a different base.

### Durable thought
none, reason: findings are specific to this archived engine and recorded here.

### Repo state

Computed by `exit-stamp` at 2026-10-11T17:52:28-07:00. Do not edit by hand; re-run it.

- repo: `~/Developer/archive/idt-configurator-master`
- branch: `main`
- HEAD: `abe6c35 chore: sync package-lock.json version field to 2.0.0` (committed 2026-05-19)
- tree: **95 uncommitted change(s)**
- upstream: origin/main (ahead 0, behind 0)
- merged into HEAD: none
- NOT merged into HEAD: none
- test: `npm test` -> exit 0: # duration_ms 77.269125

### Why we stopped
Visual verification needs the dev server; deploy needs Cia's go.

---


# SESSION_STATE.md -- IDT Configurator (Master Engine)

> Tactical handoff between sessions. Update at every session exit.

## 2026-05-19 — Post-migration repo cleanup (new Mac, 4 commits, NOT pushed)

Triaged the "2,357 dirty file" pile that was sitting on `main` since the 7-week-old "pre-reorg save uncommitted work" commit. Real scope was 10 files. node_modules and dist were tracked but absent on the new Mac (never npm-installed), creating phantom-deletion noise. Four clean commits stacked on top of `5cf8654`, working tree now clean. Build verified (vite v7.3.1, 30 modules, 892ms, dist/index-*.js = 79.5 KB gzip).

Commits (oldest first, all unpushed):
1. `cdfdc7a` chore: gitignore node_modules and dist, untrack build artifacts
2. `2d66194` chore: add Claude Code project config, drop stale .DS_Store
3. `0d91a83` docs: refresh CLAUDE.md for ~/Developer layout, add SESSION_STATE
4. `50c7210` fix: route asset URLs through Vite BASE_URL, tighten CameraHero layout

The code commit (#4) is the only behavioral change. It's two concerns rolled into one (BASE_URL refactor + hero spacing pass) because they were both in the same pre-reorg App.jsx diff and splitting a 7-week-old blob mid-migration wasn't worth the token cost. Body of the commit message documents both.

**Pre-existing gap discovered, NOT fixed this session:** `npm test` is referenced by CLAUDE.md and the constraint-validator agent but the test runner is not installed. tests/constraints.test.js (387 lines) exists, package.json has no `test` script, devDependencies lack vitest/jest. Next code session should either wire up vitest or delete the agent + CLAUDE.md references.

**Not pushed.** User said "commit as you go" but did not authorize push. Next session should verify with Cia, then `git push origin main`.
> Notion holds strategy. This file holds working state.

## Last Updated
- Date: 2026-05-09 16:35 PDT
- Session summary: Handover delivered yesterday; Luiz has not responded to delivery email. Continued post-delivery organization through the day: heavy 07_Photography tagging pass (hundreds of new subject-prefix renames), 06_Blender/Source standardization (62 renames), 01_Product-Renders cleanup (21 huge files moved to Banners totaling 1.59 GB, 2 ICDs reclassified to Documents, TB3/RT-III-Compact/Camera-Mount renames), 05_Collateral image-cleanup (24 misfiled items relocated + IDT_Marketing PDFs to Banners). Full IDT-Facility → IDT-Showroom bulk rename across 278 files. Single canonical PDF renamed to `00_Folder-Overview.pdf` with updated content (counts, new subjects, IDT-Showroom). Server fully synced after overnight run (zero-delta across all 7 folders at 05:35 AM). Cleared 77 IDT files from ~/Desktop and ~/Downloads to `_personal-not-handover/_Desktop-Downloads_2026-05-09/`. Reorganized `_personal-not-handover/` into 9 numbered top-level folders mirroring handover style. Moved 4 root-level folders (_to-be-deleted, Desktop, Documents, SORT this) into `_personal-not-handover/` as dated archives. 2TB root now has only 4 entries.

## Current Objective
Post-delivery organization is essentially complete. No deadline pressure. Remaining work is optional refinement: tag the 87 unprefixed DSC files in 12 number ranges, disambiguate ~39 singletons in 07_Photography, decide on the 15 single-token Blender Source files, decide on the 4 newly-archived folders in `_personal-not-handover/`.

## Final 2TB Drive State (2026-05-09 16:35)
```
/Volumes/CIA-2TB-IDT/
├── _IDT-HANDOVER/          (delivered library, 13,469 files / 659 GB, server-mirrored zero-delta)
│   └── 00_Folder-Overview.pdf (sole handover doc, 1 A4 page)
├── _personal-not-handover/ (organized into 9 numbered folders + 4 dated archives + special)
├── _Ronin-4D-for-Proxy/    (93 GB cinema raw, held back — proxy decision pending)
└── Radici Ojai/            (106 GB personal trip — Cia explicit: "not IDT, leave alone")
```

## Final Server State (perfectly mirrors local handover)
```
/Volumes/group/marketing_dept_public/ciamac/
├── 00_Folder-Overview.pdf
├── 01_Product-Renders/   (1,342)
├── 02_Web-Assets/        (1,102)
├── 03_Animations/          (494)
├── 04_Video/             (6,841)
├── 05_Collateral/          (560)
├── 06_Blender/           (1,793)
└── 07_Photography/       (1,337)
```
Verified zero-delta at 05:35 AM via recursive walk. Nothing else on server.

## Final _personal-not-handover Structure (2026-05-09)
```
_personal-not-handover/  ~570 GB
├── 00_Reference.md
├── 01_Photography/        (Personal-Photos, Sony-Raws, Slomo, Raw-Captures) 82G
├── 02_Video/              (Personal-Videos, Galileo-Stars, IDT-Video-Stringouts, Spatial) 10G
├── 03_Audio/              (Audio-Archive, Luiz-OSG-Brief) 1.8G
├── 04_AI-Generated/       3.4G
├── 05_References/         (Stock-References, References, Stock-Ideas, customer/competitor) 14G
├── 06_Documents/          (Personal-Work-Docs + IDT-Spec-Sheets + manuals + screencaps) 265M
├── 07_Marketing-Writing/  (Marketing, SEO, Creative-Directions, Movie-Proposal, LinkedIn) 118M
├── 08_Projects/           (Animal-Pharm, Cyril-Backup, GWU, Rick-Sutherland, Misc-Projects) 370G
├── 09_Software-Configs/   643M
├── _Desktop-Downloads_2026-05-09/    (77 IDT files pulled from ~/Desktop and ~/Downloads)
├── _Desktop-2TB-Archive_2026-05-09/  (8,941 / 34 GB — old Mac desktop dump)
├── _Documents-2TB-Archive_2026-05-09/(6,880 / 5.1 GB — old Mac documents dump)
├── _To-Be-Deleted_2026-05-09/        (1,341 / 38 GB — purge candidates)
├── _SORT-this_2026-05-09/            (15 / 5.5 GB — unsorted IDT marketing assets)
├── _Junk-Archive/         (blender-junk, web-junk, Exports) 4.7G
└── _session-manifests/    (67 CSV manifests — full reversal records)
```

## Last Completed Actions (this session, 2026-05-09)
- Photography rename passes: Veritas-Lights (47), OSII-Gold-Ventura (13), XSM-Caltech-FluidDynamics (16), Mori-Gharib (5), Helios-8K (3), Veritas-Small-LED (24), SugarCube-Stereo-Viper (9), more IDT-Facility (20), more XSLink-Hub (12+8 incl. correction), EagleVision (37), GPS-Chronograph (8), Time-Capsule (10), RT-IV-Rack (4), Shotover-NASA (7+12), SugarCube-Model-1 (19), Phoenix-Gold-6K (15), audit standardization (66), Ink-In-Water moved to Web-Assets
- IDT-Facility → IDT-Showroom bulk rename (278 files)
- 06_Blender/Source standardization (62 renames, then 47 file upload deltas to server)
- 01_Product-Renders cleanup: 21 huge files (~1.59 GB) moved to Banners, 2 ICDs to Documents, TB3 (4 files), Camera-Mount (8), RT-III-Compact, Time-Capsule-Fiber
- 05_Collateral/Documents: 24 misfiled images relocated (Banners 4, Web-Assets 6, Brand 9, Product-Renders 5)
- 00_Folder-Overview.pdf generated (replaced 00_IDT-Handover.pdf and _Guide variants); old retired
- Server sync v3 completed overnight at 05:35 AM (47 Blender uploads, 645 photo uploads, 478 stale-name deletes) — zero-delta verified
- ~/Desktop and ~/Downloads scanned: 77 IDT files (35 DALL-E, 11 emails, 7 LinkedIn, etc.) archived
- `_personal-not-handover/` reorganized: 52 ops, 9 numbered top-level folders, 00_Reference.md written
- 4 root folders (_to-be-deleted 37.8GB, Desktop 34.2GB, Documents 5.1GB, SORT this 5.5GB) moved into `_personal-not-handover/` as dated archives

## Decisions Made This Session
1. **`00_Folder-Overview.pdf`** is the sole canonical handover doc (1 A4 page). Replaces all earlier multi-PDF variants. Internal title also updated to "IDT Asset Library — Folder Overview".
2. **`IDT-Showroom` is the canonical photo prefix** for misc product/office shots at the facility (replaces IDT-Facility). Cia: "find a better name." Total reach: 278 files.
3. **Server delete-server-only files outright** (no archive safety net) — per Cia: "you can recreate from the 2TB drive." Final clean sync ran overnight in this mode.
4. **`_personal-not-handover/` mirrors handover style**: 9 numbered top-level folders + underscore-prefixed special/archive folders + 00_Reference.md guide.
5. **Radici Ojai/ stays untouched at 2TB root** — Cia explicit: "not part of IDT, leave it alone."
6. **No follow-up email about updated PDF** — Luiz hasn't even responded to initial delivery (on-pattern per locked read).

## Open Loops (Next Session — No Urgency)
- [ ] 87 unprefixed `DSC####` in 07_Photography across 12 number ranges — need shoot tags per range
- [ ] 39 ambiguous singletons in 07_Photography (Booth, Phoenix.jpg, OSpace*, Software, Sensor, XMM, etc.)
- [ ] 24 `DualEXP000-023.tif` image sequence — keep raw or normalize?
- [ ] 15 ambiguous single-token Blender Source files (Brochure, Hourglass, Tornado, Powder, etc.)
- [ ] Contents of `_Desktop-2TB-Archive`, `_Documents-2TB-Archive`, `_To-Be-Deleted`, `_SORT-this` archives — disperse into numbered buckets when there's time
- [ ] 16 UNKNOWN_ files in 01_Product-Renders awaiting Luiz's parts master
- [ ] `_Ronin-4D-for-Proxy/` 93 GB — proxy generation decision
- [ ] (Not blocking) Luiz reply to handover email — locked read says he won't respond on schedule; not a blocker for next work

## Manifests (full reversal records)
At `/Volumes/CIA-2TB-IDT/_personal-not-handover/_session-manifests/`:
- All `_photography_*_pass*.csv` (every rename batch)
- `_photography_audit_standardize_pass.csv`
- `_photography_facility_to_showroom_bulk-rename.csv`
- `_blender_source_standardize_pass.csv`
- `_product-renders_classify_pass.csv`, `_camera-mount_pass.csv`
- `_huge-renders-to-banners_pass.csv`
- `_documents_image-cleanup_pass.csv`
- `_server_sync_clean_v2.csv` (final overnight sync)
- `_desktop-downloads_idt-cleanup.csv`
- `_personal-archive_reorganize.csv`
- `_root-2tb-cleanup_2026-05-09.csv`

## Fragile Areas
- VPN file ops slow (~3 MB/s, ~3 sec per stat). Always use Finder for bulk transfers, scripts only for renames/diffs.
- Python full-buffers stdout when piped to tee — log freezes mid-run despite work continuing. Use `python3 -u` or `flush=True`.
- Filename word-splitting in bash with spaces — use Python with quoted paths.
- Server filesystem case-sensitive; local APFS case-insensitive. Beware case-only collisions on rename.
- Processes blocked on VPN I/O enter `U` state — `kill -9` doesn't land until syscall returns.
- Folder names with trailing spaces existed at root (`rick sutherland `, `documents `, `SORT this `) — handled, no longer present.

## Active Branch
N/A for code (file organization only). idt-configurator-master repo: `main` with pre-existing uncommitted changes from prior sessions (NOT from today's work — today was 100% file ops on 2TB drive, no code touched).

## Uncommitted Changes
N/A from this session. Pre-existing repo state untouched.
