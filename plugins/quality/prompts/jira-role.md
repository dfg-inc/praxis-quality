Работаем через Praxis Quality.

Work Package:
{{WP}}

Repository:
{{REPO}}

Use `praxis quality ensure --json` then `praxis quality review --wp {{WP}} --json`.
Review does not write Jira. Then `praxis quality apply-preview --wp {{WP}} --json`.
Apply only with `--confirm YES --fingerprint` from that preview.
If unsure: `praxis quality --help`.
Canonical tickets only. Blocking bugs use resolved bug type id, not a display name.
