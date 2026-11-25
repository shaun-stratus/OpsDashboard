# Decision memo: Acer system-health board, the "needs attention most" cue

## 1. Where it stands (checked in code, 2026-11-25)
- Hourly LaunchAgent `com.stratus.ai-dashboard` (3600 s) runs `scripts/ai_dashboard/run.py`. Cache `~/.claude/.cache/ai-dashboard.json` was fresh (06:14 today).
- Five tiles, each a Python gatherer:
  - Usage: `usage.py` (status-line rate-limit snapshot + `SysRef/state/credit-balances-ledger.md`).
  - Retirements: `retirements.py` (`SysRef/state/model-lifecycle.yaml` + weekly deprecations-page check).
  - System health: `health.py` runs `scripts/sync_up.py --no-mark`. Rows today: Board, Backlog, Ideation, Health audit, Drift census, Hypnos REM/deep heartbeat, Doc headroom (docs at 85%+ of cap), TLD floor (93 of 120 KB).
  - Sessions: `sessions.py` (session JSONL logs: tool-error rate, cache hit, failed sessions vs a 28-day baseline).
  - Infra: `infra.py` (Checkmk, backups, patch plan, scout, Healthchecks, scheduled jobs, n8n, tunnel).
- A "Needs you" banner is already live: `publish.banner()`. It shows the first row with status `act`, plus "+N more". Shaun narrowed it s344 so only `act` lights it.
- Acer display: `publish_acer()` renders `kiosk.html.tmpl` and SSHes the file to the Acer. A `file://` Chrome app window on the left monitor shows it. It reloads every 5 min, restarts nightly at 04:47, and click-to-expand works.
- Payload is guarded: a fixed key allowlist plus a secret-shape check (`core.guard`).

## 2. Decision A: Artifact vs LAN page
This is mostly answered by the build. Both exist:
- The kiosk is a static file on the Acer. It needs no login and nothing sits on the network.
- The same payload goes via Notion to the pinned claude.ai artifact (phone).

Options:
1. **Keep both, one payload (today).** One gatherer feeds both. Adding a panel means editing Python plus the artifact page's JS. The banner logic is duplicated in two places ("change both together").
2. **Kiosk only.** Simplest. You lose the phone view.
3. **Real LAN web server on the Acer.** Not needed. It would add a service and an attack surface for no gain, since the page is already local.

Acer constraint: the kiosk does NOT need claude.ai auth. A claude.ai artifact on the Acer would, and it would break at every login expiry. **Lean: option 1.** Close decision A as "static kiosk plus artifact, already built." New panels go in the Python payload, so both get them.

## 3. Decision B: overlap with the TLD tune-up
The tune-up is closed as a project (SystemTightenArc #1 done; floor is a nag, next 12-19; the ≥85% line is machine-checked at Sync Up). Its doc said the dashboard could be its "visual half." That half partly exists already: the TLD floor row and the Doc headroom row.
**Lean: feed, keep separate.** The dashboard only reads the tune-up's signals (doc-budgets, headroom). The monthly nag stays a nag. Don't build a second doc-size checker.

## 4. The attention cue (design)
Banner exists, but it only fires on `act`. Today's cache shows Infra `act` (Updates, Scout) while several `watch` rows (Board yellow, drift 2, doc headroom 2, audit 6 degraded) stay quiet. That is the gap.

Proposal, small and rules-based, no new data:
- Score each tile 0 to 100 as the worst row's weight plus age. Weights: act = 100, watch = 50 per row (capped 80), nodata/stale = 40. Add +1 per day a row has stayed non-ok, if its source records that (health-trend and drift-trend jsonl already do).
- Banner line 2: "Most attention: <tile> — <top row>". It shows when nothing is `act`, so watch items finally get a cue.
- Highlight that one tile (thicker border or a pulse). The other tiles keep their colours.
- Needs building: the score function in `publish.py` (about 30 lines) and a tile highlight in the template. Keep the artifact JS in step.

Signals vs data:
| Signal | Status |
|---|---|
| Doc limits | exists (`doc_headroom` in the sync_up report) |
| Board, backlog, ideation | exists (`file_stats`) |
| Health, drift, Hypnos | exists (report + trend jsonl) |
| Usage, infra | exists |
| Projects, reservoir | data exists (see 5), no tile |
| Doc-size trend / days-to-limit (C9) | needs the nightly `doc_budgets.py --stage` to keep history. `instruction-load-trend.jsonl` has 1 line (July) |
| Reaching outside working memory (C8) | needs building. I found no hook or log for it. Shaun's "for sure" item, yet it is the least ready |

## 5. Remaining panels
- **Reservoir rows (C3), on the Health tile:** oldest loose end, nags due or overdue, waiting-on-others count. Data: sync_up `projects` (`waiting.count` 51, `by_person`, `items`, `revisit_due`), `rollover` (21 rungs) and `tier_counts` (ticklers 73). Private projects stay counts only. About 1 session.
- **Projects tile (C4):** headline "N blocked on you, M quiet 14+ days", with blocked and quiet projects first. Data: `scripts/lib/projects.py` (`all_projects`, `loose_ends`, `blocked_since`). Fits the 2+2+1 layout awkwardly (6 tiles means 3x2, so adjust the CSS grid).
- Later, from the s343 walk: C8, V1 background agents, C7 free-tier gauges, C14 Dependabot, C9. C10 and V2 are still gated.

## 6. Build order and stale rows
1. Attention score plus "Most attention" line plus highlight, ~half a session. This is the cue Shaun asked for, and it needs no new data.
2. C3 reservoir rows, ~half a session.
3. C4 Projects tile and grid change, ~1 session.
4. Start the nightly doc-size history line now (tiny). The C9 trend needs a week of data first.
5. C8 reaching-outside: design a logging hook first, ~1 to 2 sessions. Then V1/C7/C14 if wanted.

Stale in the docs:
- OPEN-WORK row 3 still says Infra is "remaining" in the audit's wording. It shipped s344. Also the "unblocked Projects" note is not a blocker any more.
- The C2 banner (batch ①, s344) is live, so the NOTES "build order ①" is done.
- NOTES § Board ideas still lists C1/C2/C5/C6 as "CARRY" although all are built.
- The Decision A and B questions in the s298 prep doc (status "open") are answerable now as above.
- The group-C audit calls OpsDashboard "paused", but the board is live and warm.
- Revisit date 12-08 is tied to the Notion Dashboard plan, a different thread.

## Questions for Shaun
1. Close decision A as "static kiosk plus artifact, both fed by one payload"? Lean: yes.
2. Should the cue also light on `watch` (a "Most attention" line plus tile highlight), not only `act`? Lean: yes. Otherwise it is silent most weeks.
3. Build order: cue first, then reservoir, then Projects, with the reaching-outside hook last? Lean: yes.
