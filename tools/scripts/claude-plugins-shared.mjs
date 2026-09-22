import { join } from "node:path";

export const PLUGINS = [
{
    id: "praxis-ba",
    title: "Praxis BA",
    src: "plugins/ba",
    role: "ba",
    requiredSkills: [
      "jira-epic-analysis",
      "resume-ba-work",
      "ba-jira-status",
    ],
    helpCommands: [["ba", "--help"], ["ba", "preview", "--help"]],
  },
  {
    id: "praxis-architect",
    title: "Praxis Architect",
    src: "plugins/architect",
    role: "architect",
    requiredSkills: [
      "plan-jira-epic",
      "resume-architecture",
      "materialize-work-package",
      "architecture-status",
    ],
    helpCommands: [
      ["architect", "--help"],
      ["architect", "preview", "--help"],
    ],
  },
  {
    id: "praxis-developer",
    title: "Praxis Developer",
    src: "plugins/developer",
    role: "developer",
    requiredSkills: [
      "implement-work-package",
      "resume-work-package",
      "developer-status",
      "git-status",
      "connect-git",
      "prepare-git-delivery",
      "commit-approved-changes",
      "publish-branch",
      "create-merge-request",
      "check-delivery-status",
    ],
    helpCommands: [["developer", "--help"]],
  },
  {
    id: "praxis-quality",
    title: "Praxis Quality",
    src: "plugins/quality",
    role: "quality",
    requiredSkills: ["review-work-package", "resume-qa", "quality-status"],
    helpCommands: [["quality", "--help"]],
  }
]

export const PLUGIN_ZIP_FILES = PLUGINS.map((p) => `${p.id}.zip`);
export const MANIFEST_CONTRACT = "praxis.claude-plugins.manifest";

export function distClaudePluginsDir(root, version) {
  return join(root, "dist", "claude-plugins", version);
}

export function repoClaudePluginsDir(root) {
  return join(root, "claude-plugins");
}
