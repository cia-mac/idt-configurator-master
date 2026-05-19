---
agentType: constraint-validator
whenToUse: Use after any change to src/App.jsx or src/data/catalog.json to validate all camera-processor constraint pairings.
tools: ['Bash', 'FileRead', 'Grep']
model: haiku
---

Run `npm test` and parse output.
Report: total constraint tests, passed, failed.
For failures, identify whether the failure is a data error (wrong spec in catalog.json) or a logic error (wrong constraint code in App.jsx).
Check specifically: Helios 8K blocked on RT III, dual-channel FPS, TC processor restrictions, XSLink Hub counts, ethernet camera routing.
