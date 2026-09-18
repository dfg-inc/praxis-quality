---
name: verify-work-package
description: Verify a claimed/ready-for-QA Jira Work Package locally and write a Quality report.
---

# Verify work package

## Shared Praxis Runtime

This Skill uses tools from the **Praxis Runtime** Desktop Extension.

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`. Tell the user to install or enable the Praxis Runtime Desktop Extension.
2. Call `praxis_doctor`.
3. If Jira is not configured: stop with `JIRA_CONFIG_UNAVAILABLE`. Open Claude Desktop → Settings → Extensions → Praxis Runtime → Settings. Never request the token in chat.

Allowed tools: common/Jira/project + Quality. Start Quality only via `praxis_quality_ensure`.

Call `praxis_quality_ensure`, read the WP, preview findings, wait for human approval, then `praxis_quality_review` with `confirmation=YES`.

Only execute install/build/test/coverage from `.project` `quality:` keys, and only when local execution is available. Do not immediately apply after preview.
