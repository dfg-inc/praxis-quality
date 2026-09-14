#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  bootstrapSession,
  formatSessionBootstrap,
  parseSessionBootstrapArgs,
} from "@praxis/plugin-sdk";

const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginJson = JSON.parse(
  readFileSync(join(pluginRoot, ".claude-plugin/plugin.json"), "utf8"),
);
const { repoRoot } = parseSessionBootstrapArgs(process.argv.slice(2));
const boot = bootstrapSession({
  repoRoot,
  role: "qa",
  stage: "quality",
  pluginName: String(pluginJson.name ?? "praxis-quality"),
  pluginVersion: String(pluginJson.version ?? "0.0.0"),
});
process.stdout.write(`${formatSessionBootstrap(boot)}\n`);
