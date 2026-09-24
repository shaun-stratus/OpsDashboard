# Project Status Card — OpsDashboard
Last updated: 2026-09-24 | Session: Ops s245 (portfolio status survey)
Updated by: Claude Code (CC-Prime) — rebuilt from evidence (git history, code tree, live checks), not from the prior card

> **This file is the single home for this project's status.** The Ops roster (`SysRef/registries/projects-index.md`) holds only a one-line state + a pointer here. Keep it current per `CLAUDE.md` (read at session start, update at session end).

## Current State
Status: ⏸ PAUSED 2026-09-24
Phase: Phase 1 shipped; Phase 2+ parked
Overall health: Red (paused)

Shaun's internal ops health view over Supabase / n8n / MCP / edge functions. Next.js 14 + React 18 + Tailwind + Recharts + SWR on Vercel (project `ops-dashboard`). Phase 1 (4 API routes, 5 panels) shipped 2026-04-04; no tests. **Paused 2026-09-24:** it was publicly reachable at `ops.stratus-holdings.com` with no auth (never behind Cloudflare Access). The Vercel project is paused (site → 503) and `SUPABASE_SERVICE_ROLE_KEY` + `N8N_API_KEY` were removed from Vercel (canonical copies in Bitwarden SM).

## Active Focus
None — paused. Shaun expects to revisit.

## Last Session
Date: 2026-04-04 (Phase 1 live data)
Accomplished:
- Phase 1 shipped; dormant since. 2026-09-24: paused for the exposure.

## Known Issues
| Issue | Severity | Status | Notes |
| --- | --- | --- | --- |
| No auth in front | High | Mitigated (paused) | Must be fixed BEFORE unpausing |
| supabase / n8n / mcp routes erroring | Medium | Open | 502s + "Unregistered API key" when last live |

## Blocked On
Nothing — paused by decision.

## Next Session
Start here:
- Restart recipe (also on the Ops Cluster 6 Phase 2+ row): (1) Cloudflare Access in front (proxied DNS + Access app, n8n email-OTP pattern); (2) re-add the two keys to Vercel from BWS; (3) unpause via REST `POST /v1/projects/prj_QXbwCmSoyHdHhTVEqS6Gb96feUEl/unpause` (the claude.ai Vercel connector is read-only); (4) fix the broken routes.
- Poor cloud fit: every data source is private.
