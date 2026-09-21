#!/usr/bin/env node
console.error(
  "qa-verify.mjs no longer writes Jira. Use `praxis quality review` then `praxis quality apply-preview` / `praxis quality apply`.",
);
process.stdout.write(
  `${JSON.stringify({
    ok: false,
    command: "qa-verify",
    code: "INVALID_INPUT",
    errors: [
      "Deprecated: Quality Review does not mutate Jira. Use praxis quality review / apply-preview / apply.",
    ],
  })}\n`,
);
process.exit(2);
