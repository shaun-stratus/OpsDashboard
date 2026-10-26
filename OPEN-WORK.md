---
project: OpsDashboard
lane: ops-dash
template: v2
kind: project
state: active
health: green
last_session: s343 (2026-10-26)
---
Where it stands: **LIVE — the AI resources board** (built s339, fixed + refined s343): private page https://claude.ai/artifact/QRqdycfrDskhw9X4zBtZvr, pinned in Shaun's claude.ai sidebar (phone), plus the Acer LEFT-monitor kiosk; hourly job `scripts/ai_dashboard/` in the Ops repo (LaunchAgent `com.stratus.ai-dashboard`) → Notion page "AI dashboard data" → the page. Four tiles: usage + credits · retirements · system health · Claude Code sessions. **Shaun's KPI ideas / tweaks land in `NOTES.md` § Board ideas (KPI wishlist)** — the one place. The old Next.js app (`ops.stratus-holdings.com`) was **retired 2026-10-26 (s343)**: Vercel project deleted, DNS record removed, code kept in this repo; its build status + old restart recipe stay below as history.

## Next up
1. **Board build batch ① — Infra tile (C1 + C5 jobs + C6 n8n + tunnel) + the "needs you" banner (C2)** — then batches ②–⑤ in NOTES § Board ideas (carry-over walk done s343)
2. Usage tile: read Claude's usage endpoint? (needs the Claude sign-in token)
3. #4 Command Centre slice — first check whether CodeBurn already covers the continuous-`/insights` metrics

## Build status (folded from `docs/STATUS.md`, s326)

- **Stack:** Next.js 14 + React 18 + Tailwind + Recharts + SWR on Vercel (project `ops-dashboard`). Phase 1 (4 API routes, 5 panels) shipped 2026-04-04; no tests.
- **Paused 2026-09-24:** it was public at `ops.stratus-holdings.com` with no auth (never behind Cloudflare Access). Vercel project paused (site → 503); `SUPABASE_SERVICE_ROLE_KEY` + `N8N_API_KEY` removed from Vercel (canonical copies in Bitwarden SM).
- **Known issues:** no auth in front (High — must be fixed before unpausing) · supabase / n8n / mcp routes erroring when last live (502s + "Unregistered API key").
- **Restart recipe:** work table #1. Poor cloud-session fit: every data source is private.

## Work table

| # | Item | Size | Status / next step | Detail |
|---|---|---|---|---|
| 1 | Ops Dashboard Phase 2+ (Tier 2/3/4) — restart or not | ✅ | **Closed s343: app retired (Vercel project + DNS deleted); its ideas were combed into NOTES § Board ideas.** Historical: Restart recipe: (1) Cloudflare Access in front FIRST (proxy the DNS record + an Access app, the n8n email-OTP pattern) · (2) re-add `SUPABASE_SERVICE_ROLE_KEY` + `N8N_API_KEY` to Vercel from BWS · (3) unpause (`POST /v1/projects/prj_QXbwCmSoyHdHhTVEqS6Gb96feUEl/unpause`, REST — the MCP connector is read-only) · (4) fix the broken supabase/n8n/mcp routes. Phase 2 = work visibility (tasks, phase progress, git, session timeline, upcoming triggers, portfolio snapshot); Phase 3 = intelligence (embedding growth, velocity, workflow history, platform spend — #5); Phase 4 = experimental. Was at `https://ops.stratus-holdings.com`. | specs `docs/superpowers/specs/2026-04-03-ops-dashboard-design.md` + `…/2026-04-16-ops-dashboard-phase-2-design.md` · `docs/deployment.md` · access paths ch.22 |
| 2 | 📊 Live-data dashboard at a stable Artifact URL | ✅ | **Covered by the AI resources board (s339/s343)** — system health, drift, TLD size live at a pinned private URL. Original note: Direction set (s144), scope NOT defined — scoping pass first. System state (health audit · drift census · instruction-load floor) as a self-updating page at a durable private URL instead of terminal snapshots. Data exists: `SysRef/state/health-trend.jsonl` + `drift-trend.jsonl` + `instruction-load-trend.jsonl`. Questions: which datasets · republish-on-audit vs a live capability · Shaun-only vs collaborator · relationship to the task-corpus dashboard, Claude Dashboards, #1, #3, #4, and Tighten Arc #8 (the navigable view). | `SysRef/procedures/task-dashboard-procedure.md` · CAPABILITIES Artifacts + Dashboards rows |
| 3 | 📺 System-health dashboard on the Acer screens | ◐ | **Largely covered: the board's kiosk runs on the Acer LEFT monitor (s339).** Panels still missing from the s298 list (projects, infra, reservoir) → candidates in NOTES § Board ideas. Shaun s298: an always-on visual cue for which part of the system needs attention most (doc limits, reaching-outside-working-memory count, board, reservoir, health, Hypnos, usage, infra, projects). Two open decisions: Artifact vs a LAN page; overlap with the TLD tune-up. Project folders shipped, so the Projects panel is unblocked. | `projects/system/ProcessDoctrineHealth/2026-10-11-system-health-dashboard.md` (moved s321) |
| 4 | Command Centre — local CC-observability slice | ◐ | Pre-decided slicing (06-05): STEAL the observability core (JSONL + Claude Code's native OpenTelemetry → MCP per-tool p95, cache-hit rate, session outcomes, tool latency, edit acceptance — a continuous `/insights`); SKIP the Mission Control dispatcher (a second task system) and the Telegram bridge. OTel ruling: adopt for native emitters only, not a universal bus. Next: check whether CodeBurn (trial s299) already covers the continuous-`/insights` slice; if yes, drop or shrink to the gaps. Unpark: Shaun calls the dashboard discussion, after that check. | `docs/research-results/2026-06-05-command-centre-dashboard-prompt-THIRD-PARTY.md` · Graphite recon `docs/research-results/2026-06-06-graphite-metrics-recon.md` |
| 5 | Ops telemetry lanes (Phase 3) | 🏔 | Platform/vendor telemetry, distinct from the audit's own `health-trend.jsonl`: Supabase platform health depth (disk I/O, sizes, latency p50/p95, log errors) · API balance / credit / usage vs tier limits (partial: `SysRef/state/credit-balances-ledger.md`; an API-balance morning-prep poll is planned) · un-inventoried surfaces (n8n success deltas, tunnel uptime, Worker invocations, Actions minutes, Tailscale, AgentMail volume, brew/npm outdated, gitleaks runs). Trigger: 3+ sessions in a row where Shaun had to check N surfaces to answer X — and a live render surface (#1/#2). | — |
| 6 | Dependency Lifecycle Console (DLC) — a thin read-only view | ◐ | Re-scoped 06-09: NOT a cadence engine (morning-prep + the health audit already poll). A view over the running cadences mapping APIs / tokens / SDKs / models → what depends on each, so blast radius is known up front ("model X deprecates in 30 d → migration arc"). Open: dependency-map storage (Supabase vs a `SysRef/registries/` markdown file) · presentation (a panel on #1/#2). Promote on bandwidth or a dependency incident. | `docs/research-results/2026-06-07-recurring-checks-dossier-reconciliation.md` §5 |
