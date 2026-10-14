# CLAUDE.md — IDT Configurator (Master Engine)

## Project Identity
Product configurator for Integrated Design Tools (IDT), a high-speed camera manufacturer. Maps cameras through connection types to processors, enforcing hardware compatibility constraints. Built by Ciamac Parhizi.

**Status (2026-10-13): CASE STUDY.** The engine was built for IDT as a contractor and was never accepted or paid for. It now lives on Cia's own site as a case study. Consequences: the page is styled with the ciamac.com styleguide (not IDT's brand), it is titled "IDT System Configurator", and nothing on it claims a current relationship with IDT. Jeremy Cohen and Luiz appear below as history; there is no active client.

- **Live:** https://ciamac.com/idt (served from the Site (live repo), `~/Developer/ciamac-site/deploy/idt`)
- **Old live (GitHub Pages):** https://cia-mac.github.io/idt-configurator-master/ (base path `/idt-configurator-master/`; may rebuild from pushes)
- **Repo:** https://github.com/cia-mac/idt-configurator-master
- **Local source:** ~/Developer/archive/idt-configurator-master/
- **Build:** React/JSX via Vite. `npm run build` builds to dist/ with the frozen base `/idt-configurator-master/`; ciamac.com uses `--base=/idt/` (see Deploy Protocol)
- **Related repo:** idt-guided-configurator (v2 UX layer, separate repo)
- **Current version:** v2.0.1 (2026-10-11 audit, brand restyle, deployed live at d15f53c in ciamac-site)
- **Session state:** See SESSION_STATE.md in this directory for tactical handoff between sessions.
- **Previous CLAUDE.md:** `CLAUDE_v_2026-10-13_pre_v2.0.1.md`

## Architecture

### Stack
React + Vite. No build framework beyond Vite. No state management library. All state in App.jsx.

### Data Model
Three entity types connected by a compatibility matrix:
- **Cameras** (13 families): Fiber (Helios 8K, Galileo, Phoenix GOLD, Phoenix, Phoenix CR, XS II), USB-C (OS II GOLD, OS II, XSM, XStream Stick, SugarCube), Ethernet (CrashCam Stick, CrashCam mini)
- **Processors** (7): RT V (4CH fiber), RT IV Rack (2CH fiber), RT III Compact (1CH fiber + 2x USB-C), TC II.2 (2CH), TC II.1 (1CH), TB3 (USB-C), Viper (Ethernet)
- **Connections** (3): XStream Fiber, XStream USB-C, Ethernet

### Key Logic Rules
- Camera-first flow: user selects camera, compatible processors auto-resolve.
- Incompatible cameras are greyed out, not hidden, when a processor or connection is selected (desktop; the mobile stepper also blocks the tap). The earlier "hidden" rule is withdrawn: the code never did that.
- RT III is hybrid: supports both fiber AND USB-C cameras.
- Helios 8K is blocked on RT III (no GPU support). Restricted to RT IV/RT V only. Enforced in `selectProcessor`, `selectFamily`, `availableProcs` and `availableFamilies`, so the pairing cannot be reached from either selection order (fixed in v2.0.1; before that, RT III first then Helios produced the blocked pair). Restrictions live in `catalog.restrictions`.
- Dual-channel cameras (Galileo, Phoenix GOLD, Phoenix) need 2 ports for full FPS. Single cable mode shows reduced FPS.
- TC processors were documented as paired only with Phoenix HD/UHD (Gold + Galileo planned). **OPEN: not enforced.** The code and the tests allow every fiber camera on TC II.1/II.2. Needs a ruling from Cia (enforce it, or change this line).
- XSLink Hub bridging: USB-C cameras connect to fiber processors via Camera > USB-C > XSLink Hub > Fiber > Processor.
- Hub allocation: RT V = 4 hubs (8 cams), RT IV = 2 hubs (4 cams), RT III = 1 hub + 2 direct USB-C. **OPEN:** the code draws a hub for USB-C cameras on RT III too (`needsXSLinkHub` keys off `hubSupport`) and ignores `directUsbc: 2` in the catalog. Needs IDT product input.
- Two ethernet processor tiers: 2.5G (micro SD storage) and 10G (SSD storage), replacing single Viper.
- XSM, SugarCube, and XSS gain ethernet paths (new compatibility added March 2026).
- Dual cable stethoscope visual for dual-channel connections.

### FPS Display Rule
FPS numbers shown are best-case (dual-channel for fiber cameras). Other configurations are accessible but not the default display. This is intentional. Luiz wanted high numbers prominent.

Windowed rows (resolution tiers below native) are extrapolated as `native fps x nativeH / tierHeight`, not taken from a spec sheet. Since v2.0.1 they are tagged "est." with a footnote. The headline number is the highest tier, so it is an estimate (Helios 8K² shows 683 fps at HD from 90 fps native). Do not remove the tag until IDT's spec sheet exists.

## Conditional Rules

### Data File Protection
`src/data/catalog.json` is guarded by a PreToolUse hook. Edits are blocked unless Ciamac explicitly overrides.
This enforces the ownership boundary: Jeremy handles data entry, Ciamac approves changes.

### Frozen Files
`vite.config.js` is deny-listed in permissions. `package.json` and `package-lock.json` default to ask (not auto-approved, not blocked).
Remove the deny rule on vite.config.js only with explicit instruction.

### Constraint Validation
After any edit to `src/App.jsx`, the PostToolUse hook reminds to run `npm test` (script added in v2.0.1: `node --test tests/constraints.test.js`, 102 tests).
The constraint-validator agent can be spawned for a full validation report.
**Known limit:** `tests/constraints.test.js` reimplements the rules as pure functions instead of importing App.jsx, so it passed while the Helios/RT III order bug was live. After a logic change, also drive the UI (select processor first, then camera, and the reverse) before calling it verified.

### Brand and layout (v2.0.1)
- Tokens follow `~/Developer/ciamac-brand/STYLEGUIDE.md`: Caspian `#4d7fe0` accent, ink/bone neutrals, Helvetica Neue + system mono (`SANS`, `MONO` constants at the top of App.jsx). No gold, no web fonts.
- The fiber/USB-C/ethernet group colours (blue/green/red) are product coding from the client and stay.
- The XSLink hub is drawn in bone so it is not confused with the blue fiber cable.
- Desktop layout needs about 1180px (`DESKTOP_MIN_WIDTH`); narrower screens get the stepper, capped at 720px wide.
- The selected camera and processor are scrolled into view so the canvas cable never draws off-screen.

### Deploy Gate
Never deploy without passing all constraint tests.
The deploy sequence: `npm test` -> `npm run build` -> commit -> push (GitHub Pages), or the ciamac.com sequence below. A live deploy or a push still needs Cia's explicit go.

## Key File Map
- `src/App.jsx` — All constraint logic and UI rendering. This is the core. Do not modify without running tests.
- `src/data/catalog.json` — Camera specs, processor specs, compatibility matrix. The single source of product data.
- `src/main.jsx` — React entry point. Rarely touched.
- `tests/constraints.test.js` — Constraint validation suite.
- `vite.config.js` — Build config. Do not modify.
- `dist/` — Built output for GitHub Pages. Generated by `npm run build`.
- `mockups/` — Logic trees and system architecture PNGs. Version all diagrams (v1, v2, v3). Never replace.
- `public/images/` — Camera and processor product images. Everything here ships, so keep it light (angles are 1600px; `sugarcube-alt.png` was 19.7 MB until v2.0.1).
- `_unshipped/` — Not shipped, kept for the record: `renders_v1/` (92 MB of renders no code references) and `originals/` (full-size SugarCube image).
- `manifest.json` (repo root) — the PWA manifest Vite bundles; paths use `../` because it is emitted into `assets/`.
- `index.html` — no external fonts; title "IDT System Configurator".

## Constraint Validation
Every camera-processor pairing must be validated. The test suite must cover:
- All 13 camera families against all 7 processors.
- Fiber cameras: verify dual vs single channel FPS difference.
- Helios 8K: verify blocked on RT III, allowed on RT IV and RT V.
- TC processors: verify only Phoenix HD/UHD allowed (until scope expands).
- XSLink Hub: verify USB-C cameras can bridge to fiber processors with correct hub count.
- Ethernet cameras: verify only Viper (2.5G/10G) processor is available.
- Hybrid cameras: verify streaming and ethernet toggle states produce correct processor lists.

## Test Protocol
1. After any data change (new camera, new processor, new constraint), run the full constraint validation suite.
2. Report which camera-processor pairings changed and what changed.
3. Never deploy to GitHub Pages without passing all constraint tests.
4. If a test fails, identify whether the failure is a data error (wrong spec) or a logic error (wrong constraint code). Data errors go back to Luiz. Logic errors get fixed in code.

## Deploy Protocol
1. Run constraint validation suite (`npm test`).
2. Run `npm run build` to generate dist/.
3. Commit with message: `[vX.Y.Z] description of change`.
4. Push to main branch (Cia's go). GitHub Pages may rebuild from this.
5. Verify live site matches expected state.
6. Update Notion State: IDT page with changelog entry.

### Deploy to ciamac.com/idt (the live case study)
Read `~/Developer/ciamac-site/DEPLOY.md` first; it is the only runbook. Proven sequence (2026-10-11):
1. `npx vite build --base=/idt/ --outDir <scratch>/idt --emptyOutDir` (do not edit the frozen vite.config.js; the CLI flag overrides the base).
2. Re-add the analytics tag to the built index.html before `</body>`: `<script defer src="https://a.ciamac.com/t.js" data-site="ciamac.com"></script>` (the build drops it).
3. Serve the artifact at `/idt/` and check it in the browser (0 broken images, no console errors, restricted pairing, title).
4. Into `~/Developer/ciamac-site/deploy/idt`: `rsync -a --delete` the `assets/` and `images/` folders, copy `index.html`, `sw.js`, icons. Never touch `media/` (the profile film lives there).
5. Path-limited commit in ciamac-site, then `cd deploy && vercel --prod --yes` (the gate asks Cia).
6. Verify on https://ciamac.com/idt, run `scripts/verify-live-media.sh`, then push ciamac-site only on Cia's go.
Gotcha: outside the sandbox `$TMPDIR` differs from the in-sandbox value; use an explicit scratch path, or a failed `cd` silently runs in the wrong folder.

## Failure Patterns (Learned From Prior Sessions)
- The dual-channel fiber logic has edge cases where selecting certain cameras with specific resolutions silently drops the second channel. Always verify both channels render after any FPS logic change.
- Jeremy has submitted data changes to catalog.json that broke constraint pairings. Never merge his data changes without running the constraint suite first.
- The CLAUDE.md previously referenced `js/engine.js` and `js/ui.js` which do not exist. The actual codebase is React (src/App.jsx). File references in documentation drift. Verify paths before citing them.
- FPS spec sheet from Luiz has been promised but not delivered. Any FPS numbers in catalog.json should be treated as provisional until verified against an official spec sheet.
- A restriction enforced on only one click path is not enforced: Helios + RT III was blocked when the camera came first and allowed when RT III came first (fixed v2.0.1). Test both orders.
- Product images shipped at full size: a single 6666x5000 16-bit PNG was 19.7 MB and loaded as the SugarCube hero, and 92 MB of unreferenced renders rode along in every deploy. Check `du` on `public/` after adding assets.
- Camera detail state (thumbnail index) must reset per family; key the component by family.
- The preview tool in the desktop app may read another folder's launch.json; if `master-engine` is not found, serve with `npx vite --port 5177` (needs local port binding outside the sandbox) and stop it by port afterward.

## Guardrails (Do Not Touch Without Explicit Instruction)
- `src/data/catalog.json` — Do not modify product data without explicit instruction from Ciamac.
- `vite.config.js` — Frozen. Do not modify.
- `package.json` / `package-lock.json` — Do not update dependencies without asking.
- Do not restructure App.jsx into multiple components without explicit architectural approval.
- Do not create a second constraint engine. All logic lives in App.jsx.
- Do not expose the guided configurator (v2 repo) to Luiz until strategically appropriate.

## Ownership Boundaries
Historical, from the contract period. The engagement ended without acceptance or payment; the code is Cia's and no one else is maintaining it.
- **Ciamac:** Architecture, constraint logic, UX design, Figma mockups, guided configurator v2. Owns every decision now, including catalog data.
- **Jeremy Cohen (past):** Data entry, WordPress integration, CSS adjustments. He received item lists from Luiz and implemented them into the data JSON.
- **Luiz (past):** Provided item lists and spec data. Approved final output. Did not touch code.

## IDT Product Name Reference
Never use "Integrated Design Technologies." The correct name is "Integrated Design Tools."
Camera families: Galileo, Phoenix, XSM, CCM (CrashCam mini), SugarCube, Helios, XS II, OS II, XStream Stick, CrashCam Stick.
