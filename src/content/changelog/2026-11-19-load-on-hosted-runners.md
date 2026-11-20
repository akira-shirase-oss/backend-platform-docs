---
title: The load evidence runs on hosted runners
type: Improvement
areas: [Control plane, Starter template, Operations]
date: 2026-11-19
docs:
  - label: Drills and evidence
    href: /control-plane/drills/
  - label: The evidence kit
    href: /template/evidence/
---

The owed load runs — the quiet-machine smoke and the million-request full run — no
longer wait on a laptop. A manually dispatched workflow runs one job per scenario on
GitHub-hosted runners: the control-API smoke, the control-API full run, and the
template's service load. Each records the runner's CPU and host labels in the result and
uploads the evidence even on failure — a miss is evidence, not a rerun until green.
