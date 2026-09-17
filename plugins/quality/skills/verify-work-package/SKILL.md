---
name: verify-work-package
description: Verify a claimed/ready-for-QA Jira Work Package locally and write a Quality report.
---

# Verify work package

Call `praxis_quality_ensure`, read the WP, preview findings, wait for human approval, then `praxis_quality_review` with `confirmation=YES`.

Only execute install/build/test/coverage from `.project` `quality:` keys, and only when local execution is available. Do not immediately apply after preview.
