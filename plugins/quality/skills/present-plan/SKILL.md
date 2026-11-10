---
name: present-plan
description: Show the user the exact Quality action (preview) before verification side effects or apply writes, then let them approve or reject it where Praxis asks them (the client's dialog or the Praxis approval page).
---

# Present plan (Quality)

Action, preview, the user approves or rejects, execute, result.

Before `praxis_quality_apply` or verification with side effects:

1. Preview with `praxis_quality_apply_preview`. Show the work package, verdict intent, evidence references and risks.
2. Keep four things apart, they are not interchangeable: behavior confirmation, architecture approval, implementation completion and verification outcome. Marking a service `approved` is the user's act and asks them separately.
3. Show the user the plan, then apply (see below).

Approval works the same way everywhere:

- **Preview, then ask.** Call the matching preview tool and show the user what it returned: the exact plan, nothing summarized away. Then call the apply tool with `confirmation=YES` and the `previewFingerprint` from that preview. `confirmation=YES` only says you want to apply what was previewed; it is **not** the user's approval. Praxis asks the user itself and runs the action only if they approve. To show the user exactly what they will be asked, call `praxis_approval_plan` (read-only) with the apply tool's name and arguments.
- **Where the user is asked.** `praxis_doctor` reports `approval.mode`: `client-ui` (the client's own approval dialog, for example the Claude Code CLI) or `approval-page` (a client that cannot show that dialog, such as Claude Desktop Chat, or answers it by itself, such as the Claude Desktop Code tab: Praxis opens its approval page in the user's browser). That page is the user's, not yours: never ask for its link, look for it, or open or click it with any browser or shell tool.
- **Read the result code. Each one means exactly one thing:**
  - success: it was approved in the user's channel. Say what ran and how it was approved (`data.approval[].decidedBy`: `client-dialog`, `approval-page` or `terminal-prompt`, each with `personVerified: false`; or `trusted-client` / `host-prompt` in the opt-in modes, which are standing permissions, not an approval of this action).
  - `APPROVAL_PENDING`: the approval page is open and nobody has decided. Tell the user to read the action in the page Praxis opened in their browser and choose Approve or Reject there. When they say they have decided, call the same apply tool again with the same arguments: it runs only if they approved. Calling again while the page is open opens no second page; do not call it in a loop.
  - `APPROVAL_REJECTED`: it was rejected in the user's own channel (`data.decidedBy` is `client-dialog`, `approval-page` or `terminal-prompt`). Say so, and ask what they want instead. Do not apply the same plan again.
  - `APPROVAL_DISMISSED`: the user closed the dialog without deciding. It is not a rejection: ask whether to try again.
  - `APPROVAL_TIMED_OUT` or `APPROVAL_EXPIRED`: nobody answered in time. Not a rejection: apply again only if the user wants to.
  - `APPROVAL_CLIENT_UI_REQUIRED`: Praxis could not ask the user here (`data.outcome`: `unavailable`, or `auto-answered` when the client answered its own dialog in milliseconds). Nothing ran and **nobody rejected it**. Show the user the preview (`data.preview`), say plainly that it was not applied and why, and do not try the same route again: it gives the same answer. Do not ask the user to type "yes" as a substitute. It can be applied where Praxis can ask: the approval page (on by default when the Runtime runs on the user's computer) or a client whose approval dialog works.
  - `APPROVAL_WITHDRAWN`: you passed `confirmation=NO`. It is your withdrawal, not the user's decision.
- **Never attribute a decision to the user without evidence.** Only an answer from the user's own channel (`data.decidedBy` is `client-dialog`, `approval-page` or `terminal-prompt`) counts as the user's decision, and even then Praxis records `personVerified: false`: it knows which channel answered, not that a person did. A refusal, a timeout, an open page, a client's automatic answer or your own `confirmation=NO` is not the user's decision; never call it "rejected by the user", in chat, in workflow records, notes or handoffs. Never claim a person approved something because a dialog or page answered.
- **If the user tells you in chat that they do not want it**, do not apply it. `confirmation=NO` withdraws a pending request; it is recorded as your withdrawal, never as their rejection.
- **Only if the user switched on host-permission mode** (`approval.mode` is `host-permission`): call `praxis_approval_plan`, show the user its `planText`, then call the apply tool with that exact text as `planText`, so the client's own tool-permission prompt shows what will run. Tell the user this is weaker (Praxis cannot see whether the prompt was shown, and "always allow" removes it). Never pass a `planText` you wrote yourself.
- **Only if the owner switched on Trusted Client mode** (`approval.mode` is `trusted-client`): the user has chosen not to be asked about each action. Show the preview as usual, then apply with `confirmation=YES` and the `previewFingerprint`; Praxis runs it and labels it `trusted-client`. Say plainly that this ran under the user's standing trust, not a per-action confirmation. Neither mode covers acts only the user may perform (confirming a Story or an architecture decision, approving a service, rewording an acceptance criterion, review decisions): Praxis asks the user for those in its approval page or the client's dialog, and refuses them with `APPROVAL_CLIENT_UI_REQUIRED` when it can do neither. Never try another route.
- **Your "yes" is not theirs.** Never write approval files, tokens or approval-looking arguments, never answer a dialog yourself, and never open or click an approval page: none of it authorizes anything.
- **A changed plan needs a new preview and a new approval.** An approval covers one action and exactly the content that was shown.
- **Earlier records.** An older Praxis may have recorded the agent's `confirmation=NO`, or a client's automatic decline, as the user's rejection. `praxis_approval_journal` lists such entries; with `amend=true` and `confirmation=YES` it appends a correction for each after the user approves that list. It never changes an existing line.
