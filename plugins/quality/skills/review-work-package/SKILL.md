---
name: review-work-package
description: Review a Work Package via Quality Service, persist QA evidence, then preview and apply Jira only after human approval.
---

# Review Work Package

Do not ask the user to run `make quality-up`. Use MCP tools from the **Praxis Runtime** Desktop Extension.

## Shared Praxis Runtime

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`. Tell the user to install or enable the Praxis Runtime Desktop Extension. Do not instruct them to run CLI or edit config files.
2. Call `praxis_doctor`.
3. If Jira is not configured: stop with `JIRA_CONFIG_UNAVAILABLE`. Open Claude Desktop → Settings → Extensions → Praxis Runtime → Settings. Never request the token in chat.
4. If `.project` is missing: `praxis_project_init_preview`, wait for approval, then `praxis_project_init_apply` with `confirmation=YES`.

Allowed tools: common/Jira/project + Quality tools. Start the Quality service only via `praxis_quality_ensure`. Do not run BA/Architect/Developer apply tools.

## Flow

1. Quality intake: `praxis_quality_status` then `praxis_quality_ensure` until healthy.
2. Quality review: `praxis_quality_review` for the Work Package. Review is **not** approval. It must not write Jira.
3. Show the acceptance matrix, Quality's own test results, findings, and evidence paths.
4. Quality apply preview: `praxis_quality_apply_preview`. STOP. Wait for human approval.
5. Only after the human confirms the shown plan: `praxis_quality_apply` with `confirmation=YES` and that `previewFingerprint`.
6. Check postconditions with `praxis_quality_status`.

Never call `praxis_quality_review` with `confirmation=YES` to approve Jira. Review itself is not approval. Jira Done, Bugs, comments, and properties happen only in Quality Apply.

Create a blocking Bug only from a previewed finding, using the resolved numeric bug type id (not the display name «Баг»/Bug). Do not immediately apply after preview.

Examples: “Review WP-20260914-002.” Then “Show the Quality apply preview.” Then wait. Do not start Quality Review until `praxis_quality_ensure` reports healthy. Ensure does not approve QA or move Jira to Done.
