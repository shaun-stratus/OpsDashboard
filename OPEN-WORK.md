---
project: OpsDashboard
lane: ops-dash
template: v3
kind: project
state: warm
revisit: 2026-12-08
health: green
plugin: none
walked: s426 (2026-11-17)
last_session: s455 (2026-11-23)
---
Where it stands: **LIVE — the AI resources board** (built s339, fixed + refined s343): private page https://claude.ai/artifact/QRqdycfrDskhw9X4zBtZvr, pinned in Shaun's claude.ai sidebar (phone), plus the Acer LEFT-monitor kiosk; hourly job `scripts/ai_dashboard/` in the Ops repo (LaunchAgent `com.stratus.ai-dashboard`) → Notion page "AI dashboard data" → the page. Four tiles: usage + credits · retirements · system health · Claude Code sessions. **Shaun's KPI ideas / tweaks land in `NOTES.md` § Board ideas (KPI wishlist)** — the one place. The old Next.js app (`ops.stratus-holdings.com`) was **retired 2026-10-26 (s343)**: Vercel project deleted, DNS record removed, and the Next.js code deleted s344 (`projects/OpsDashboard/app/` no longer exists); a one-line build history stays below. **s347 (10-28):** the Acer kiosk copy now opens a tile on click (all rows, closes on click / Esc / 90 s); the three Acer wall displays restart nightly at 04:47 (`scripts/acer-wallboards/`).

## Live documents
Names from `SysRef/registries/document-names.yaml` (s449).

| Job | File | You might call it |
|---|---|---|
| work list | `OPEN-WORK.md` (this file) | the work list, next up |
| map: AI resources board | `artifact/ai-dashboard.html` | the AI resources board, the dashboard |

## Next up
0. **Notion Dashboard (s363):** spec approved s369 → next: CC writes the build plan (superpowers:writing-plans), then Shaun marks it to build → `docs/superpowers/specs/2026-11-01-notion-dashboard-design.md`
1. Usage tile: the tile already reads the status line's rate-limit snapshot + credit ledger (`scripts/ai_dashboard/usage.py`); open only: do we also want server-side reads of Claude's usage endpoint? (needs the Claude sign-in token)
2. #4 Command Centre slice — CodeBurn check DONE (Codex x6a, 2026-11-23, `docs/research-results/2026-11-23-codex-batch-2/x6a.md`): it covers tokens/cost/cache-hit/sessions, tool + MCP frequency, retries and one-shot edits (free, MIT, v0.9.28 2026-11-08); it does NOT cover MCP per-tool p95, tool latency, edit acceptance or session outcomes. Next: feed CodeBurn's JSON into the board and build only those gaps (OTel gives tool durations + edit decisions; outcomes need separate analysis)

## Recently done
- Row #1 closed: app retired s343, code deleted s344; ideas combed into NOTES § Board ideas (s444 audit; closed s343)
- Walked onto template v3; Active → Warm, revisit 2026-12-08: write the Notion Dashboard plan or drop it (s426)
- Evidence check: row 7 closed — board batch ① shipped s344 (s420)
- Notion Dashboard spec approved; build plan next (s369)

## Build status (historical)

The Next.js app (Next.js 14 on Vercel, `ops.stratus-holdings.com`; Phase 1 shipped 2026-04-04, paused 2026-09-24) was **retired s343 (2026-10-26): Vercel project and DNS deleted, code deleted s344** — nothing to restart. Its "Known issues" and restart recipe are void; the live surface is the AI resources board above.

## Work table

| # | Item | Size | Status / next step | Detail |
|---|---|---|---|---|
| 1 | Ops Dashboard Phase 2+ (Tier 2/3/4) — restart or not | ✅ | **Closed s343: app retired (Vercel project + DNS deleted), `app/` code deleted s344; ideas combed into NOTES § Board ideas.** Restart recipe dropped (nothing left to restart; in git history). | specs `docs/superpowers/specs/2026-04-03-ops-dashboard-design.md` + `…/2026-04-16-ops-dashboard-phase-2-design.md` · access paths ch.22 (its `docs/deployment.md` (gone) went with the app, s344) |
| 2 | 📊 Live-data dashboard at a stable Artifact URL | ✅ | **Superseded by the AI resources board (s339/s343)** — `scripts/ai_dashboard/` + `artifact/ai-dashboard.html`, hourly publish; system health, drift, TLD size live at a pinned private URL. | `SysRef/procedures/task-dashboard-procedure.md` · CAPABILITIES Artifacts + Dashboards rows |
| 3 | 📺 System-health dashboard on the Acer screens | ◐ | **Kiosk shipped (s339/s347: the board runs on the Acer LEFT monitor; Infra tile shipped s344, row 7).** Remaining = the extra panels from the s298 list (projects, reservoir) → candidates in NOTES § Board ideas. Shaun s298: an always-on visual cue for which part of the system needs attention most (doc limits, reaching-outside-working-memory count, board, reservoir, health, Hypnos, usage, infra, projects). Two open decisions: Artifact vs a LAN page; overlap with the TLD tune-up. Project folders shipped, so the Projects panel is unblocked. | `projects/system/ProcessDoctrineHealth/2026-10-11-system-health-dashboard.md` (moved s321) |
| 4 | Command Centre — local CC-observability slice | ◐ | Pre-decided slicing (06-05): STEAL the observability core (JSONL + Claude Code's native OpenTelemetry → MCP per-tool p95, cache-hit rate, session outcomes, tool latency, edit acceptance — a continuous `/insights`); SKIP the Mission Control dispatcher (a second task system) and the Telegram bridge. OTel ruling: adopt for native emitters only, not a universal bus. Next: check whether CodeBurn (trial s299) already covers the continuous-`/insights` slice; if yes, drop or shrink to the gaps. Unpark: Shaun calls the dashboard discussion, after that check. | `docs/archive/research-results/2026-06-05-command-centre-dashboard-prompt-THIRD-PARTY.md` · Graphite recon `docs/research-results/2026-06-06-graphite-metrics-recon.md` |
| 5 | Ops telemetry lanes (Phase 3) | 🏔 | Platform/vendor telemetry, distinct from the audit's own `health-trend.jsonl`: Supabase platform health depth (disk I/O, sizes, latency p50/p95, log errors) · API balance / credit / usage vs tier limits (partial: `SysRef/state/credit-balances-ledger.md`; an API-balance morning-prep poll is planned) · un-inventoried surfaces (n8n success deltas, tunnel uptime, Worker invocations, Actions minutes, Tailscale, AgentMail volume, brew/npm outdated, gitleaks runs). Trigger: 3+ sessions in a row where Shaun had to check N surfaces to answer X — and a live render surface (#1/#2). | — |
| 6 | Dependency Lifecycle Console (DLC) — a thin read-only view | ◐ | Re-scoped 06-09: NOT a cadence engine (morning-prep + the health audit already poll). A view over the running cadences mapping APIs / tokens / SDKs / models → what depends on each, so blast radius is known up front ("model X deprecates in 30 d → migration arc"). Open: dependency-map storage (Supabase vs a `SysRef/registries/` markdown file) · presentation (a panel on #1/#2). Promote on bandwidth or a dependency incident. | `docs/research-results/2026-06-07-recurring-checks-dossier-reconciliation.md` §5 |
| 7 | Board build batch ① — Infra tile (C1 + C5 jobs + C6 n8n + tunnel) + the "needs you" banner (C2) | ✅ | **CLOSED s420 (2026-11-16, evidence check): shipped s344 (2026-10-27, archive)** Brief `docs/superpowers/plans/2026-10-26-ai-board-batch1-infra-banner.md` (Ops repo), queue row § Background Candidates; then batches ②–⑤ in NOTES § Board ideas (carry-over walk done s343). Dependabot backlog + Next.js code removal done s344, `c9899ee`. | NOTES § Board ideas |
