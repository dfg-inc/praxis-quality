import { join } from "node:path";

export const PLUGINS = [
  {
    id: "praxis-quality",
    title: "Praxis Quality",
    src: "plugins/quality",
    role: "quality",
    requiredSkills: ["review-work-package", "resume-qa", "quality-status"],
    helpCommands: [["quality", "--help"]],
  },
];

export const PLUGIN_ZIP_FILES = PLUGINS.map((p) => `${p.id}.zip`);
export const MANIFEST_CONTRACT = "praxis.claude-plugins.manifest";

export function distClaudePluginsDir(root, version) {
  return join(root, "dist", "claude-plugins", version);
}

export function repoClaudePluginsDir(root) {
  return join(root, "claude-plugins");
}
