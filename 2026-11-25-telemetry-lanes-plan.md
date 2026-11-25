# Ops telemetry lanes (Phase 3) — plan

## 1. Trigger check
The row's trigger is "3+ sessions in a row where Shaun had to check N surfaces to answer X, and a live render surface (#1/#2)."

- Render surface: MET. The AI resources board is live (s339/s343). It has a Usage tile and an Infra tile.
- "3 sessions in a row" is NOT proven. I found no log of it.
- The closest evidence is the weekly 💳 credits nag (tasks.queue.md line 165). Each Monday Shaun reads about 6 dashboards by hand: Anthropic, OpenAI, Higgsfield x2, TypeSafe, Tavily. CC reads Firecrawl and OpenRouter.
- That is a standing manual check, not three sessions of pain. But on 11-23 Tavily was noted "burning fast, may run out ~11-29". That is the exact miss telemetry would catch.

**Verdict:** the whole row stays parked. Split off the balance poll only. It is small, already planned (scheduled-execution-registry line 67), and the weekly nag proves the need. The rest of the row (Supabase depth, Worker invocations, Actions minutes, Tailscale, AgentMail, gitleaks) has no pain evidence. Keep it parked.

## 2. Inventory
Cost is $0 for every read below. No card is on file where a read could bill.

| Surface | What watches it now | Gap | How to read | Value |
|---|---|---|---|---|
| Firecrawl credits | Weekly nag; ledger row | No automatic read | API `GET /v2/team/credit-usage` (0 credits) | High |
| OpenRouter balance | Weekly nag | None automatic | API `/api/v1/credits` and `/key` | High |
| Tavily credits | Weekly nag (by hand) | Burns fast; hard stop at 0 | API usage endpoint (ledger says unverified; test it) | High |
| context.dev | Ledger row only | No read | `/org/usage` (0 credits) | Low |
| Anthropic and OpenAI balance | Weekly nag (Shaun) | Dashboard only. `OPENAI_ADMIN_KEY` reads usage, not balance | No balance API. Console shows it | Med. Leave manual |
| Higgsfield x2, TypeSafe | Weekly nag | Higgsfield CLI `account status` reads the app credits | CLI | Low-med |
| Credit expiry dates | `scripts/ai_dashboard/usage.py` `_credit_rows` (reads ledger "Expiry" column only) | Reads dates, never balances | Already built | Done |
| Claude caps | Same file (status-line snapshot) | None | Done | Done |
| Supabase DB size | `supabase-headroom` probe (health-probes-registry line 75, 400 MB warn); backup freshness probe | Not on the board (C7 planned). No disk I/O, latency p50/p95, egress, log errors | Size: RPC (have it). Rest: MCP `get_logs` / `get_advisors`, or Management API (needs a PAT; none listed) | Med (size), Low (rest) |
| n8n success | Infra tile row `row_n8n` (infra.py): last-run staleness | No success-rate delta | n8n REST (already used) | Low (covered) |
| Tunnel uptime | `row_tunnel` probe and audit `cloudflare-tunnel` / `cloudflare-edge` | Point-in-time only, no uptime % | Healthchecks.io history, or log each hourly probe | Low |
| Worker invocations / Pages | None | Free-tier limit watch | Cloudflare API: the token is DNS-scoped, so it would need a new token | Low |
| Actions minutes | None | Repos are mostly private | `gh api /users/{u}/settings/billing/actions` (read only) | Low |
| Tailscale | None | Tailnet device up/down | `tailscale status` CLI | Low |
| AgentMail volume | None | Send/receive counts | AgentMail API (unconfirmed) | Low |
| brew / npm outdated | Audit `tooling-stale` probe (health-probes-registry ~line 118) | Already covered | Done | Done |
| gitleaks runs | `scripts/health_audit/secrets.py` | Covered by the audit | Done | Done |

Several "un-inventoried" surfaces in the row are already watched. These are n8n, tunnel, brew/npm and gitleaks. That row text is stale.

## 3. Right-sized plan

**Lane A, balance poll (~half a day, build only on Shaun's yes).**
- Read three API-readable pools: Firecrawl, OpenRouter, Tavily. Add context.dev if free.
- Add it as a morning-prep leg, as scheduled-execution-registry line 67 already plans. Reuse the polling pattern in `scripts/morning_prep/`.
- Append one line per run to a new `SysRef/state/credit-poll.jsonl`.
- Output 1: a Sync Up line only when a pool is under a threshold, or on pace to hit zero within 7 days. Silent otherwise.
- Output 2: the Usage tile gets the live balances. This is the planned C7 row (amber at about 75% used).
- Result: the weekly nag shrinks to the dashboard-only pools (Anthropic, OpenAI, Higgsfield, TypeSafe).

**Lane B, Supabase depth (~2 hours, only if wanted).**
- Move the existing DB-size read (the RPC behind `supabase-headroom`) onto the Usage tile. Part of C7.
- Add the MCP `get_advisors` count to the audit. Skip latency p95 and disk I/O until something actually fails.

**Lane C, the rest (Actions minutes, Tailscale, AgentMail, Worker invocations).** Stay parked. Revisit only if a free-tier limit actually bites.

## 4. Stale in the docs
- OPEN-WORK row 5 lists n8n success, tunnel, brew/npm and gitleaks as "un-inventoried". All four are covered (see the table). Trim the row.
- The trigger "a live render surface (#1/#2)" is satisfied. Rows #1/#2 are closed. Point it at "the AI resources board".
- OPEN-WORK frontmatter says `last_session: s455`. Row 5 detail is "—". Add pointers to the ledger, the probes registry and NOTES § C7.
- tasks.queue.md line 105: row 5's twin is truncated ("health tren"). It is a duplicate of OPEN-WORK row 5. One home is enough.
- The ledger's Anthropic row is stale (11-16 figures; the 11-23 read is on the nag). Notion is the real record.
- Ledger rows past expiry: the Codex reset (expired 11-06) says "row can go". The cloud-session pool expired 11-05.
- Hostinger: no reference in the OpsDashboard folder. Elsewhere it is email-only plus domains (accounts registry lines 46 and 79, access-paths ch.29). No telemetry impact.
- group-C.md flags row 5 as LIVE and keep-parked. This report agrees, apart from splitting Lane A off.

## Questions for Shaun
1. Split the balance poll (Lane A) out as its own small row and build it, leaving the rest parked? My lean: yes. The Tavily near-miss shows it pays.
2. Should Tavily be read by API, with a quick check that its usage endpoint works? My lean: yes. If it doesn't, drop Tavily from the poll and keep it on the nag.
3. Warn at a fixed 75% used, or at "runs out within 7 days at the current pace"? My lean: the pace rule. It catches the Tavily case. A fixed percent would not.
