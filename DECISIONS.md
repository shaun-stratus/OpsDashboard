# OpsDashboard — decisions

| Date | Decision | Why | Replaced |
|---|---|---|---|
| 2026-06-05 | Command Centre slicing: steal the observability core; skip the dispatcher + Telegram bridge; OTel only for native emitters | A second task system collides with the board; one emitter doesn't justify a bus | building the whole community stack |
| 2026-06-09 | DLC is a thin read-only view, not a cadence engine | morning-prep + the health audit already own the polling | a DLC cadence engine |
| 2026-09-24 (s245) | PAUSED — it was public with no auth | Exposure; poor cloud fit (every data source is private) | live at ops.stratus-holdings.com |
