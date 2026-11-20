---
title: Every bound port is a parameter inside the band
type: Improvement
areas: [Control plane, Starter template, Operations]
date: 2026-11-19
docs:
  - label: The development stack
    href: /self-hosting/dev-stack/
---

Each product on the shared machine owns a port band; the platform's is 61400–61499, and
now every bound port is a parameter: `BP_PG_PORT` (PostgreSQL, 61432), `BP_SERVER_PORT`
(the control API, 61400) and `BP_FAKE_PORT` (the fake provider, 61410). A checker wired
into the gate and CI scans every file that binds or references a port and refuses a
literal outside the band — the gate proves it fails on out-of-band samples. The
template's development, load, rehearsal and mail ports got the same parameters.
