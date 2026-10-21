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

- **Preview, then ask.** Call the matching preview tool and show the user what it returned: the exact plan, nothing summarized away. Then call the apply tool with `confirmation=YES` and the `previewFingerprint` from that preview. Praxis asks the user in the MCP client's own approval dialog, which shows the same plan. **Approve** runs exactly that action. **Reject** or dismissing the dialog runs nothing and the tool returns `APPROVAL_REJECTED`.
- **A client without that dialog.** `praxis_doctor` reports `approval.mode`. When it is `unverified-fallback`, ask the user in chat and call apply with `confirmation=YES` only after they said yes; if they said no, call it with `confirmation=NO` (it records the rejection and runs nothing). Praxis marks such an approval `unverified` and says so in the result: repeat that in your report, never present it as verified.
- **Your "yes" is not theirs.** Never write approval files, tokens or approval-looking arguments, and never answer a dialog yourself: they authorize nothing.
- **A changed plan needs a new preview and a new approval.** An approval covers one action and exactly the content that was shown.
