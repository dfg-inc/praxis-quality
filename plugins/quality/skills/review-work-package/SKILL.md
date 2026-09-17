---
name: review-work-package
description: Review a Work Package, ensure Quality runtime, and publish the QA result.
---

# Review Work Package

Do not ask the user to run `make quality-up`.

## Capability detection

Detect repo. `${CLAUDE_PLUGIN_ROOT}/bin/praxis doctor --json`. If it cannot run: `LOCAL_RUNTIME_UNAVAILABLE`.

If unsure: `praxis quality --help`.

## Flow

```
praxis quality ensure --json
praxis work-package show --wp <WP> --json
praxis quality review --wp <WP> --json
```

Read canonical members and design. Build/test locally. Create a blocking Bug only for a real blocker, using the resolved bug type id (not the display name «Баг»/Bug).

Examples: «Проверь WP-20260914-002 и дай финальный QA результат.» / “Review WP-20260914-002 and give the QA outcome.”
