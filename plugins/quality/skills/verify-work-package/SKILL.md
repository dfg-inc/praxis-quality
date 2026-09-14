---
name: verify-work-package
description: Verify a claimed/ready-for-QA Jira Work Package locally and write a Quality report.
---

# Verify work package

1. Read WP key from the human.
2. Run:

```
node ${CLAUDE_PLUGIN_ROOT}/tools/qa-verify.mjs --wp <KEY> --repo <product>
```

3. Only execute install/build/test/coverage/start from `.project` `quality:` keys.
4. Do not modify production source. Tests only if `PRAXIS_QA_ALLOW_TEST_WRITES=1` and the human approved the file list.
