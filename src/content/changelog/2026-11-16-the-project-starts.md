---
title: The Backend Platform starts — with a spine built to answer a question
type: Feature
areas: [Control plane]
date: 2026-11-16
docs:
  - label: The control plane, as planned
    href: /control-plane/
  - label: Concepts
    href: /concepts/
---

The project begins with its riskiest assumption on the table: is a self-hosted control
plane the right answer to the sibling products' repeated work? Milestone B0 builds the
minimum spine that can answer honestly — the pure domain (no I/O, enforced), the control
database with its append-only operation log, the bounded control API, the reconciler
worker, and a fault-injecting fake provider — plus CI, the pin checks and the load
scenario from the first commit.

The spine's job is evidence, not ambition. Every later milestone is planned only.
