---
title: The partial-provisioning drill, practiced before any real adapter
type: Feature
areas: [Control plane, Operations]
date: 2026-11-16
docs:
  - label: Drills and evidence
    href: /control-plane/drills/
---

The contract's hardest failure case — provisioning that stops partway — is drilled from
day one. The fake provider injects fail-before-effect, lost replies, late creates and
hangs on a seeded schedule; the drill runs concurrent workers and kills them mid-step.
Pass means every operation reaches a recorded state and provider inventory shows zero
duplicates and zero orphans. A second adapter may only be added after this drill is
practiced — the rule that keeps a real provider's outage from being the first test.
