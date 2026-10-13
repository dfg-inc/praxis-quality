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

A service-level pass is not a feature pass. Green unit tests are not sufficient for PASS. `verify-stories` returns both `serviceVerdicts` and the feature `verdict`.

Inspect the repositories Quality was given. Read languages, frameworks, tests, and source files from the verification profile. Ask for a repository only when `locate-repositories` still lists it. Do not treat a module import or a local function call as deployed end-to-end coverage. `deployedEndToEnd` stays false unless a real deployed environment was executed.

Executable checks belong to the project in `.praxis/quality/checks.json`. A project may also supply `.praxis/quality/adapter.mjs`. Praxis Runtime does not embed a product-specific code fix. When a check fails, record the finding with expected and observed behavior.

For a partial-success requirement, `quality-check` still reads the implementation file. Pass `implementationPath`. Do not pass `observedBehavior` as proof. All-or-nothing behavior is a FAIL even when existing tests are green and the developer claims partial success.

A feature verdict (`feature-verdict`) fails when any requirement lacks a current PASS or any service lacks a current implementation and approval. A revised requirement makes older verdicts and implementation records stale.

Return the finding to the owner with `praxis_workflow_preview` action `quality-check`, show it, and wait for approval before `praxis_workflow_apply` (`confirmation=YES`, matching `previewFingerprint`).

Verdicts are `PASS`, `PASS_WITH_RISKS`, or `FAIL`. A revised requirement makes older verdicts stale.

Verify User Stories with `verify-stories`. Quality executes the implementation. Do not pass a behavior label, and do not treat green unit tests or a Developer handoff as proof. Happy-path steps that cannot be executed stay `NOT_VERIFIED` or `BLOCKED` and the feature verdict is `FAIL`. Scenario statuses are `PASS`, `FAIL`, `PASS_WITH_RISKS`, `BLOCKED`, and `NOT_VERIFIED`. The final verdict stays `PASS`, `PASS_WITH_RISKS`, or `FAIL`.

Call `locate-repositories` before asking the user for a checkout. Ask only for services that have neither `localPath` nor `remoteUrl`.

When a fix is authorized, write the coding agent's patch to `.praxis/quality/proposals/<serviceId>.json` (`files[].after` or `files[].diff`). `prepare-fix` applies that patch on a working branch or an existing feature branch and may open a review request. If no patch is available, stop with `HOST_EDIT_UNAVAILABLE` and leave the repository unchanged. Do not merge, do not push to `main` or `master`, and do not force-push. Run `verify-stories` again with `independentRerun: true` after the fix. Generating or applying a patch is not a passing verdict.

Call `praxis_capabilities` when the failure is a business or architecture decision. Do not execute external mutations from guidance.
