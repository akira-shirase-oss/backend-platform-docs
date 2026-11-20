---
title: The starter template lands — service skeleton, accounts kit and gate
type: Feature
areas: [Starter template]
date: 2026-11-17
docs:
  - label: What the starter template is
    href: /template/
  - label: Accounts kit API
    href: /template/accounts/
---

The copy-and-own template is a real service: a bounded accept loop (connection cap
before accept, header-read and idle timeouts, write-stall deadline), a middleware
envelope, a pool, and the PostgreSQL split — an administrator bootstraps, the owner
migrates, the runtime role reads and writes rows but cannot rewrite its protections.
The accounts kit mounts under `/v1`: invite-gated sign-up, verification and reset
through a mail port, sessions, workspaces, members, tokens, plan limits at admission,
deletion. Configuration is typed; secrets come from systemd credentials or owner-only
files, and every problem reports at once.
