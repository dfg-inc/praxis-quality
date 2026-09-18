---
name: resume-qa
description: Resume Quality review for a Work Package.
---

# Resume QA

## Shared Praxis Runtime

This Skill uses tools from the **Praxis Runtime** Desktop Extension.

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`. Tell the user to install or enable the Praxis Runtime Desktop Extension.
2. Call `praxis_doctor`.
3. If Jira is not configured: stop with `JIRA_CONFIG_UNAVAILABLE`. Open Claude Desktop → Settings → Extensions → Praxis Runtime → Settings. Never request the token in chat.

Allowed tools: common/Jira/project + Quality. Start Quality only via `praxis_quality_ensure`.

Call `praxis_quality_ensure` then show findings. Wait for human approval before writes.

Then `praxis_quality_review` with `confirmation=YES`.
