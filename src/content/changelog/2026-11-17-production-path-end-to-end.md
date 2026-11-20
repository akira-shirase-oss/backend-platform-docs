---
title: The production path runs end to end — install, secrets, releases, CI on a real VM
type: Feature
areas: [Starter template, Operations]
date: 2026-11-17
docs:
  - label: Operating a copy
    href: /template/operations/
  - label: Copying and owning
    href: /template/copying/
---

The host layer and its guide are proven, not transcribed: the install test runs the
operator guide's commands verbatim on a CI VM with systemd — droplet hardening, the
service user, credential-loaded secrets, the three database roles, the unit at exposure
1.4, Caddy in front, the first release. Releases activate atomically; `deploy` refuses a
schema the binary does not know and `rollback` refuses while the target can't serve it.
`copy-template.sh` then makes any product a renamed, independently-owned copy.
