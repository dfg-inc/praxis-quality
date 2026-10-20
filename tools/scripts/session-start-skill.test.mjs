import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const skill = readFileSync(join(here, "../../plugins/quality/skills/session-start/SKILL.md"), "utf8");

describe("Quality session-start skill text", () => {
  it("uses the Runtime tool, which works where local scripts cannot run", () => {
    expect(skill).toContain("praxis_session_start");
    expect(skill).toContain('role: "quality"');
  });

  it("does not tell the agent to wait for a Jira Work Package key or to run only a script", () => {
    expect(skill).not.toMatch(/wait for a Work Package key/i);
    expect(skill).not.toMatch(/CLAUDE_PLUGIN_ROOT/);
  });

  it("names the knowledge role correctly: Quality is `qa` in the dataset and takes no stage override", () => {
    expect(skill).toMatch(/`qa`/);
    expect(skill).toMatch(/Quality takes no `stage`/);
    expect(skill).not.toMatch(/override with `stage`; not for quality/);
  });
});
