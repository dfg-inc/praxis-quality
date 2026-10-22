---
name: present-plan
description: Show the user the exact Quality action (preview) before verification side effects or apply writes, then let them approve or reject it in the MCP client.
---

# Present plan (Quality)

Action, preview, the user approves or rejects, execute, result.

Before `praxis_quality_apply` or verification with side effects:

1. Preview with `praxis_quality_apply_preview`. Show the work package, verdict intent, evidence references and risks.
2. Keep four things apart, they are not interchangeable: behavior confirmation, architecture approval, implementation completion and verification outcome. Marking a service `approved` is the user's act and asks them separately.
3. Show the user the plan, then apply (see below).

Approval works the same way everywhere:

- **Preview, then ask.** Call the matching preview tool and show the user what it returned: the exact plan, nothing summarized away. Then call the apply tool with `confirmation=YES` and the `previewFingerprint` from that preview. `confirmation=YES` only says you want to apply what was previewed; it is **not** the user's approval. Praxis asks the user in the MCP client's own approval dialog, which shows the exact action. **Approve** runs exactly that action. **Reject** or dismissing the dialog runs nothing and the tool returns `APPROVAL_REJECTED`. To show the user exactly what the dialog will say, call `praxis_approval_plan` (read-only) with the apply tool's name and arguments.
- **A client without that dialog.** `praxis_doctor` reports `approval.mode`. When it is `no-dialog`, protected actions are **not executed**: the tool returns `APPROVAL_CLIENT_UI_REQUIRED` with the preview. Show the user that preview, say plainly that nothing was applied and that it can only be applied from a client that supports approval dialogs (`approval.client.reason` says why). Do not ask the user to type "yes" as a substitute, do not retry with other wording, and do not report the action as done. Read-only tools and previews keep working.
- **Only if the user switched on host-permission mode** (`approval.mode` is `host-permission`): call `praxis_approval_plan`, show the user its `planText`, then call the apply tool with that exact text as `planText`, so the client's own tool-permission prompt shows what will run. Tell the user this is weaker (Praxis cannot see whether the prompt was shown, and "always allow" removes it). Never pass a `planText` you wrote yourself.
- **Only if the owner switched on Trusted Client mode** (`approval.mode` is `trusted-client`): the user has chosen not to be asked about each action. Show the preview as usual, then apply with `confirmation=YES` and the `previewFingerprint`; Praxis runs it and labels it `trusted-client`. Say plainly that this ran under the user's standing trust, not a per-action confirmation. Confirming a Story or decision is still the user's own act: do it only for the exact revision they told you to confirm.
- **If the user told you no**, call apply with `confirmation=NO`: it records the rejection and runs nothing.
- **Your "yes" is not theirs.** Never write approval files, tokens or approval-looking arguments, and never answer a dialog yourself: they authorize nothing.
- **A changed plan needs a new preview and a new approval.** An approval covers one action and exactly the content that was shown.
