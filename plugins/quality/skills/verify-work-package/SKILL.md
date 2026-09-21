---
name: verify-work-package
description: Verify a claimed/ready-for-QA Work Package locally and persist a Quality review without writing Jira.
---

# Verify work package

## Shared Praxis Runtime

This Skill uses tools from the **Praxis Runtime** Desktop Extension.

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`. Tell the user to install or enable the Praxis Runtime Desktop Extension.
2. Call `praxis_doctor`.
3. If Jira is not configured: stop with `JIRA_CONFIG_UNAVAILABLE`. Open Claude Desktop → Settings → Extensions → Praxis Runtime → Settings. Never request the token in chat.

Allowed tools: common/Jira/project + Quality. Start Quality only via `praxis_quality_ensure`.

Call `praxis_quality_ensure`, then `praxis_quality_review`. Show the acceptance matrix and findings. Review does not write Jira.

If the human wants Jira updates: `praxis_quality_apply_preview`, STOP, wait for approval, then `praxis_quality_apply` with `confirmation=YES` and `previewFingerprint`.

Only execute install/build/test/coverage from `.project` `quality:` keys, and only when local execution is available. Do not immediately apply after preview.
