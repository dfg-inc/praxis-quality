---
name: review-work-package
description: Review a Work Package, ensure Quality runtime, and publish the QA result.
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

1. `praxis_quality_ensure`
2. `praxis_work_package_show`
3. Discover Developer completion from the product tree: `design/<WP>/dev/completion-evidence.json` and `design/<WP>/dev/quality-handoff.json`. Do **not** treat Jira Done as Quality readiness.
4. Read acceptance checks, requirement IDs, Story keys, and verification results from those artifacts
5. Build/test locally only when local execution is available
6. Preview Jira writes / findings. STOP. Wait for human approval where writes are required.
7. `praxis_quality_review` with `confirmation=YES`. Only Quality approval may move Jira to Done (`Готово`).

Create a blocking Bug only for a real blocker, using the resolved numeric bug type id (not the display name «Баг»/Bug). Do not immediately apply after preview.

Examples: «Проверь WP-20260914-002 и дай финальный QA результат.» / “Review WP-20260914-002 and give the QA outcome.”
