---
name: present-plan
description: Build and display the exact Quality action plan before verification side effects or apply writes.
---

# Present plan (Quality)

Before `praxis_quality_apply` or verification with side effects:

1. Build a `praxis.action.plan` with `decisionKind=quality_verdict`.
2. Show work package, verdict intent, evidence refs, and risks.
3. Distinguish behavior confirmation, architecture approval, implementation completion, and verification outcome — they are not interchangeable.
4. Submit to the broker; do not treat Claude confirmation as authorization.
