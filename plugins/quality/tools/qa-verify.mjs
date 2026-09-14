#!/usr/bin/env node
import { createJiraProvider, loadJiraConfig } from "@praxis/jira";
import { qaVerifyWorkPackage } from "@praxis/jira/workflow";

function flag(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const wp = flag("--wp");
  const repo = flag("--repo") ?? process.cwd();
  if (!wp) {
    console.error("usage: qa-verify.mjs --wp KEY --repo PATH");
    process.exit(2);
  }
  const provider = createJiraProvider({ config: loadJiraConfig() });
  const report = await qaVerifyWorkPackage({
    provider,
    wpKey: wp,
    repo,
    allowTestWrites: process.env.PRAXIS_QA_ALLOW_TEST_WRITES === "1",
  });
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
