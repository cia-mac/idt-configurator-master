# CLAUDE.md — IDT Configurator (Master Engine)

## Project Identity
Product configurator for Integrated Design Tools (IDT), a high-speed camera manufacturer. Maps cameras through connection types to processors, enforcing hardware compatibility constraints. Built by Ciamac Parhizi. Maintained by Jeremy Cohen (web developer, implements data only).

- **Live:** https://cia-mac.github.io/idt-configurator-master/
- **Repo:** https://github.com/cia-mac/idt-configurator-master
- **Local source:** /IDT/_configurator/master-engine/
- **Deploy:** GitHub Pages (static HTML/CSS/JS, no build step)
- **Related repo:** idt-guided-configurator (v2 UX layer, separate repo)
- **Current version:** v2.0.0

## Architecture

### Data Model
Three entity types connected by a compatibility matrix:
- **Cameras** (13 families): Fiber (Helios 8K, Galileo, Phoenix GOLD, Phoenix, Phoenix CR, XS II), USB-C (OS II GOLD, OS II, XSM, XStream Stick, SugarCube), Ethernet (CrashCam Stick, CrashCam mini)
- **Processors** (7): RT V (4CH fiber), RT IV Rack (2CH fiber), RT III Compact (1CH fiber + 2x USB-C), TC II.2 (2CH), TC II.1 (1CH), TB3 (USB-C), Viper (Ethernet)
- **Connections** (3): XStream Fiber, XStream USB-C, Ethernet

### Key Logic Rules
- Camera-first flow: user selects camera, compatible processors auto-resolve.
- Incompatible cameras are hidden (not greyed out) when a processor or connection is selected.
- RT III is hybrid: supports both fiber AND USB-C cameras.
- Helios 8K is blocked on RT III (no GPU support). Restricted to RT IV/RT V only.
- Dual-channel cameras (Galileo, Phoenix GOLD, Phoenix) need 2 ports for full FPS. Single cable mode shows reduced FPS.
- TC processors are currently paired only with Phoenix HD/UHD (Gold + Galileo planned).
- XSLink Hub bridging: USB-C cameras connect to fiber processors via Camera > USB-C > XSLink Hub > Fiber > Processor.
- Hub allocation: RT V = 4 hubs (8 cams), RT IV = 2 hubs (4 cams), RT III = 1 hub + 2 direct USB-C.
- Two ethernet processor tiers: 2.5G (micro SD storage) and 10G (SSD storage), replacing single Viper.
- XSM, SugarCube, and XSS gain ethernet paths (new compatibility added March 2026).
- Dual cable stethoscope visual for dual-channel connections.

### FPS Display Rule
FPS numbers shown are best-case (dual-channel for fiber cameras). Other configurations are accessible but not the default display. This is intentional. Luiz wants high numbers prominent.

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
1. Run constraint validation suite.
2. Run visual regression check (verify layout renders correctly at 1920x1080 and 1440x900).
3. Commit with message: `[vX.Y.Z] description of change`.
4. Push to main branch. GitHub Pages auto-deploys.
5. Verify live site matches expected state.
6. Update Notion State: IDT page with changelog entry.

## File Structure Conventions
- `data/` contains camera specs, processor specs, compatibility matrix as JSON.
- `js/engine.js` contains the constraint logic. This is the core. Do not modify without running tests.
- `js/ui.js` handles DOM rendering. Separated from logic.
- `css/` contains styling. Changes here do not require constraint tests.
- `diagrams/` contains logic trees and system architecture PNGs. Version all diagrams (v1, v2, v3). Never replace.

## What NOT to Do
- Never trust spec numbers without cross-referencing the website, the Notion spec sheet, and the data JSON. Assume the website shows best-case. Ask "under what conditions?" for every FPS number.
- Never show greyed-out cameras. Hide incompatible options entirely.
- Never merge data changes from Jeremy without running the constraint suite. His role is implementation, not architecture.
- Never expose the guided configurator (v2 repo) to Luiz until strategically appropriate.
- Never modify the dual/single channel logic without understanding the stethoscope cable visualization.
- Do not create a second constraint engine. All logic lives in engine.js.

## Ownership Boundaries
- **Ciamac:** Architecture, constraint logic, UX design, Figma mockups, guided configurator v2.
- **Jeremy Cohen:** Data entry, WordPress integration, CSS adjustments. He receives item lists from Luiz and implements them into the data JSON.
- **Luiz:** Provides item lists and spec data. Approves final output. Does not touch code.

## IDT Product Name Reference
Never use "Integrated Design Technologies." The correct name is "Integrated Design Tools."
Camera families: Galileo, Phoenix, XSM, CCM (CrashCam mini), SugarCube, Helios, XS II, OS II, XStream Stick, CrashCam Stick.
