---
title: Restore drills, the upgrade rehearsal, and limits proven by removal
type: Feature
areas: [Starter template, Operations]
date: 2026-11-17
docs:
  - label: The evidence kit
    href: /template/evidence/
  - label: Operating a copy
    href: /template/operations/
---

The template's evidence kit ships with it: restore drills for PostgreSQL, SQLite and an
append-only journal (each failing on a weakened source and a wrong key backup — a
restore that cannot happen is found in the drill), a 23-step upgrade rehearsal that
installs, writes data, upgrades, verifies, rolls back and verifies again, and
`prove-limits` — sixteen `LIMIT` markers each paired with a mutation and a test that
must fail without the bound. Drill records carry the commit and the machine's load, and
misses are kept.
