---
name: review-work-package
description: Review a Work Package, ensure Quality runtime, and publish the QA result.
---

# Review Work Package

Do not ask the user to run `make quality-up`. Use MCP tools.

## Capability detection

Call `praxis_doctor`. If it cannot run: `LOCAL_RUNTIME_UNAVAILABLE`. Never paste tokens into chat.

## Flow

1. `praxis_quality_ensure`
2. `praxis_work_package_show`
3. Read design/dev evidence
4. Build/test locally only when local execution is available
5. Preview Jira writes / findings. STOP. Wait for human approval where writes are required.
6. `praxis_quality_review` with `confirmation=YES`

Create a blocking Bug only for a real blocker, using the resolved numeric bug type id (not the display name «Баг»/Bug). Do not immediately apply after preview.

Examples: «Проверь WP-20260914-002 и дай финальный QA результат.» / “Review WP-20260914-002 and give the QA outcome.”
