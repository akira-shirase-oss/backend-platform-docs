---
title: A control API that refuses honestly
type: Feature
areas: [Control plane, API, Security]
date: 2026-11-16
docs:
  - label: The control API
    href: /control-plane/api/
  - label: The threat model
    href: /control-plane/threat-model/
---

The control API answers `GET /readyz` against a 500 ms database probe, bounds in-flight
requests and sheds past the cap (an immediate `503 overloaded`, proven by a test that
fails without the bound), and caps operations per project at admission. It links no
adapter and reads no provider setting — the architecture check fails the build if it
ever does — so the API process can never hold the root-equivalent provider credentials.
Two busy-laptop smokes already live in the evidence set; misses are kept, not rerun.
