---
title: A reconciler that never duplicates — the operation log and leased steps
type: Feature
areas: [Control plane, Operations]
date: 2026-11-16
docs:
  - label: Concepts
    href: /concepts/
  - label: The control API
    href: /control-plane/api/
---

Provisioning has no cross-provider transaction, so B0 makes resumability structural.
Recording desired state writes an operation with recorded steps; the worker claims steps
under leases, and every provider resource gets a deterministic name derived from the
project and resource — a retried step finds what exists and adopts it. Every create is
verified by name afterward, and a late create the check catches is **reported** as a
duplicate, never silently adopted. `POST /v1/operations/{id}/retry` resumes the same
operation rather than starting a blind retry.
