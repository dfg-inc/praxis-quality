---
name: quality-status
description: Read-only Quality runtime and Work Package QA status.
---

# Quality Status

## Shared Praxis Runtime

This Skill uses tools from the **Praxis Runtime** Desktop Extension.

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`. Tell the user to install or enable the Praxis Runtime Desktop Extension.
2. Call `praxis_doctor`.
3. If Jira is not configured: stop with `JIRA_CONFIG_UNAVAILABLE`. Open Claude Desktop → Settings → Extensions → Praxis Runtime → Settings. Never request the token in chat.

Allowed tools: common/Jira/project + Quality status. Start Quality only via `praxis_quality_ensure` when this Skill needs a live service. `praxis_quality_status` does not start Quality; `not_started` is normal before ensure.

Call MCP:

- `praxis_doctor`
- `praxis_quality_status`

When the user names a Work Package, pass it so status includes canonical `qualityState`, applied Review ID, evidence path, snapshot freshness, and whether Jira approval has been applied. Use `praxis_quality_apply_status` to inspect the managed comment and consistency. Use `praxis_quality_review_show` with `reviewId` to read Quality storage. Those tools are read-only.

Read-only. No confirmation.
