---
name: local-workflow
description: Independently verify requirements, including partial success and cross-service behavior, without treating Developer notes or green unit tests as proof. Use for verdicts, requirement violations, consistency, and returning findings.
---

# Local Quality workflow

## Shared Praxis Runtime

1. If `praxis_doctor` is not available: stop with `PRAXIS_RUNTIME_UNAVAILABLE`.
2. Call `praxis_workflow_status` and read requirement statements yourself.
3. Jira is optional. Report `JIRA_CONFIG_UNAVAILABLE` only when a Jira status write was requested. Local verification still runs.
4. Report Runtime `code` and `errors` exactly.

## Behavior

A service-level pass is not a feature pass. Green unit tests are not sufficient for PASS.

For "Invalid CSV rows must not prevent valid users from being imported" (`REQ-BUI-001`), all-or-nothing transaction behavior is a FAIL even when existing tests are green. Record the requirement id, the observed behavior, and evidence.

Return the finding to the owner with `praxis_workflow_preview` action `quality-check`, show it, and wait for approval before `praxis_workflow_apply` (`confirmation=YES`, matching `previewFingerprint`).

Verdicts are `PASS`, `PASS_WITH_RISKS`, or `FAIL`. A revised requirement makes older verdicts stale.

Call `praxis_capabilities` when the failure is a business or architecture decision. Do not execute external mutations from guidance.
