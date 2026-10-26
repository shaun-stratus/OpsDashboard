# OpsDashboard — decisions

| Date | Decision | Why | Replaced |
|---|---|---|---|
| 2026-06-05 | Command Centre slicing: steal the observability core; skip the dispatcher + Telegram bridge; OTel only for native emitters | A second task system collides with the board; one emitter doesn't justify a bus | building the whole community stack |
| 2026-06-09 | DLC is a thin read-only view, not a cadence engine | morning-prep + the health audit already own the polling | a DLC cadence engine |
| 2026-09-24 (s245) | PAUSED — it was public with no auth | Exposure; poor cloud fit (every data source is private) | live at ops.stratus-holdings.com |

## 2026-10-26 (s339) — Dashboard direction: AI-resources view as a private Artifact page, also shown on an Acer screen

Shaun chose **Both**. Infrastructure status is already covered by the Acer wallboards (Checkmk + UniFi), so the old Vercel app's Phase-1 panels (n8n workflows, Supabase pulse, Edge Function health, error feed, MCP status) are not rebuilt. The never-built part, the AI-resources view (Claude Code usage + health, API balances/credits vs limits, model/API lifecycle, system health), is built once as a private claude.ai Artifact page with a fixed URL (phone-reachable) and the same page is shown on an Acer screen. Data comes from what we already log. The Vercel `ops-dashboard` project is retired (stays paused until its delete is done). Panel scope: next decision.

**Panels for v1 (Shaun, same day): all four** — usage caps + credits · model + API retirements · system health · Claude Code session health.
