---
name: verify-work-package
description: Verify a claimed/ready-for-QA Jira Work Package locally and write a Quality report.
---

# Verify work package

```
praxis quality ensure --json
praxis quality review --wp <KEY> --json
```

If unsure, `praxis quality --help`. Only execute install/build/test/coverage from `.project` `quality:` keys.
