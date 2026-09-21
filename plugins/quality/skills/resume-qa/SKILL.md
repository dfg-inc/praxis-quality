---
name: resume-qa
description: Resume Quality review for a Work Package from persisted evidence.
---

# Resume QA

## Shared Praxis Runtime

This Skill uses tools from the **Praxis Runtime** Desktop Extension.

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`. Tell the user to install or enable the Praxis Runtime Desktop Extension.
2. Call `praxis_doctor`.
3. If Jira is not configured: stop with `JIRA_CONFIG_UNAVAILABLE`. Open Claude Desktop → Settings → Extensions → Praxis Runtime → Settings. Never request the token in chat.

Allowed tools: common/Jira/project + Quality. Start Quality only via `praxis_quality_ensure`.

Call `praxis_quality_status` with the Work Package, then `praxis_quality_ensure` if needed. Show the latest review, whether it is current or stale, and whether Jira approval has been applied.

If a fresh review is needed: `praxis_quality_review` (does not write Jira). Then `praxis_quality_apply_preview`. Wait for human approval before `praxis_quality_apply` with `confirmation=YES` and `previewFingerprint`.

If Apply is partial, retry the **same** fingerprint. If Jira drifted before this Apply, generate a new preview. Never reuse an older fingerprint after a new preview.
