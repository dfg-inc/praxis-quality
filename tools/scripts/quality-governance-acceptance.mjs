#!/usr/bin/env node
/**
 * Packed/offline Quality governance acceptance (WBS 6.2 local, 6.3, 6.6, 6.7, 6.8).
 * No live GitHub/GitLab, no production rollback, no network.
 *
 *   node tools/scripts/quality-governance-acceptance.mjs [--rebuild]
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildAllPluginArtifacts } from "./package-plugins.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const rebuild = process.argv.includes("--rebuild");
const proven = [];
const pending = ["6.2 live remote CI/MR provider"];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function run(cmd, cwd, extra = {}) {
  const r = spawnSync(cmd, {
    cwd,
    shell: true,
    encoding: "utf8",
    ...extra,
  });
  return {
    ok: (r.status ?? 1) === 0,
    status: r.status ?? 1,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
  };
}

function write(path, body) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    typeof body === "string" ? body : `${JSON.stringify(body, null, 2)}\n`,
  );
}

function parseJson(stdout) {
  const obj = stdout.indexOf("{");
  const arr = stdout.indexOf("[");
  const start =
    obj < 0 ? arr : arr < 0 ? obj : Math.min(obj, arr);
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}

function git(repo, args) {
  const r = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
  if ((r.status ?? 1) !== 0) fail(`git ${args.join(" ")}: ${r.stderr || r.stdout}`);
  return (r.stdout ?? "").trim();
}

if (rebuild) {
  const b = run(
    "npm run build --workspaces --if-present",
    root,
  );
  if (!b.ok) fail(`build failed:\n${b.stderr}\n${b.stdout}`);
  console.log("building plugin artifacts…");
  buildAllPluginArtifacts(join(root, "dist/release-mirror"));
}

const packBase = mkdtempSync(join(tmpdir(), "praxis-q-gov-pack-"));
function packWorkspace(name, src) {
  const dest = join(packBase, name);
  cpSync(src, dest, { recursive: true });
  const pkgPath = join(dest, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (name === "quality") pkg.files = ["dist", "bin", "package.json"];
    if (name === "contracts" || name === "knowledge") pkg.files = ["dist", "bin", "package.json"];
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
  const pack = run("npm pack", dest);
  if (!pack.ok) fail(`npm pack ${name}: ${pack.stderr}`);
  const tgz = readdirSync(dest).find((f) => f.endsWith(".tgz"));
  if (!tgz) fail(`no tgz for ${name}`);
  return join(dest, tgz);
}

const tgzs = [
  packWorkspace("contracts", join(root, "packages/contracts")),
  packWorkspace("knowledge", join(root, "packages/knowledge")),
  packWorkspace("quality", join(root, "apps/quality-service")),
];
const mirrorDev = join(root, "dist/release-mirror/plugins/developer");
if (existsSync(mirrorDev)) {
  tgzs.push(packWorkspace("developer", mirrorDev));
}

const consumer = mkdtempSync(join(tmpdir(), "praxis-q-gov-"));
write(join(consumer, "package.json"), { name: "praxis-q-gov", private: true });
const install = run(`npm install ${tgzs.map((p) => `"${p}"`).join(" ")}`, consumer);
if (!install.ok) fail(`npm install failed:\n${install.stderr}`);

const qbin = join(consumer, "node_modules/@praxis/quality-service/bin/praxis-quality.mjs");
if (!existsSync(qbin)) fail("packed praxis-quality missing");
const db = join(consumer, "quality.sqlite");

function q(args) {
  return run(`node "${qbin}" ${args}`, consumer, {
    env: { ...process.env, PRAXIS_QUALITY_DB: db },
  });
}

function writeProduct(dir, broken) {
  mkdirSync(join(dir, "src"), { recursive: true });
  write(
    join(dir, "package.json"),
    {
      name: "q-acc",
      type: "module",
      scripts: { test: "node --test src/*.test.js" },
    },
  );
  write(
    join(dir, "src/widget.js"),
    broken
      ? "export function scale(v) { return v * 2 } // FIXME-CRITICAL\n"
      : "export function scale(v) { return v * 2 }\n",
  );
  write(
    join(dir, "src/widget.test.js"),
    `import test from 'node:test';
import assert from 'node:assert/strict';
import { scale } from './widget.js';
test('scale', () => assert.equal(scale(5), 10));
`,
  );
}

const handoff = {
  contract: "developer.quality.handoff",
  version: "0.1.0",
  workPackageId: "WP-1",
  mergeRequestRef: "local/WP-1",
  intention: "ship widget",
  requirementIds: ["FR-1"],
  decisionIds: ["ADR-1"],
  verification: {
    build: { status: "skipped", required: false },
    tests: { status: "passed", required: true },
    lint: { status: "skipped", required: false },
    packageCriteria: { status: "passed", required: true },
  },
};

// --- 6.2 ---
{
  const repo = join(consumer, "mr-repo");
  mkdirSync(repo, { recursive: true });
  git(repo, ["init", "-b", "main"]);
  git(repo, ["config", "user.email", "t@t.t"]);
  git(repo, ["config", "user.name", "t"]);
  write(join(repo, "README.md"), "base\n");
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", "base"]);
  git(repo, ["checkout", "-b", "feat"]);
  writeProduct(repo, false);
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", "feat"]);
  const baseSha = git(repo, ["rev-parse", "main"]);
  const headSha = git(repo, ["rev-parse", "HEAD"]);
  const changed = git(repo, ["diff", "--name-only", "main...HEAD"])
    .split("\n")
    .filter(Boolean);
  const ctx = {
    contract: "quality.mr.context",
    version: "0.1.0",
    projectId: "p62",
    workPackageId: "WP-1",
    mergeRequestRef: "local/WP-1",
    repositoryPath: repo,
    baseBranch: "main",
    headBranch: "feat",
    baseSha,
    headSha,
    changedFiles: changed,
    requirementIds: ["FR-1"],
    decisionIds: ["ADR-1"],
  };
  write(join(consumer, "ctx.json"), ctx);
  write(join(consumer, "handoff.json"), handoff);
  const a = q(`review-mr --context "${join(consumer, "ctx.json")}" --handoff "${join(consumer, "handoff.json")}"`);
  const aj = parseJson(a.stdout);
  if (!a.ok || aj.verdict !== "pass") fail(`6.2 A: ${a.stderr}\n${a.stdout}`);
  write(join(consumer, "ctx-mismatch.json"), { ...ctx, changedFiles: ["nope.js"] });
  const b = q(
    `review-mr --context "${join(consumer, "ctx-mismatch.json")}" --handoff "${join(consumer, "handoff.json")}" --skip-tests`,
  );
  const bj = parseJson(b.stdout);
  if (bj?.verdict !== "fail" || !bj.findings?.some((f) => f.id === "changed-files-mismatch" && !f.ok)) {
    fail(`6.2 B: ${b.stdout}`);
  }
  write(join(consumer, "ctx-sha.json"), {
    ...ctx,
    headSha: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  });
  const c = q(
    `review-mr --context "${join(consumer, "ctx-sha.json")}" --handoff "${join(consumer, "handoff.json")}"`,
  );
  const cj = parseJson(c.stdout);
  if (cj?.verdict !== "fail" || cj.testExecution) fail(`6.2 C: ${c.stdout}`);
  write(join(consumer, "ctx-wp.json"), { ...ctx, workPackageId: "WP-OTHER" });
  const d = q(
    `review-mr --context "${join(consumer, "ctx-wp.json")}" --handoff "${join(consumer, "handoff.json")}" --skip-tests`,
  );
  const dj = parseJson(d.stdout);
  if (!dj?.findings?.some((f) => f.id === "mr-workPackageId" && !f.ok)) fail(`6.2 D: ${d.stdout}`);
  proven.push("6.2 local CI/MR integration");
}

// --- 6.3 ---
{
  const clean = join(consumer, "audit-clean");
  writeProduct(clean, false);
  const before = readFileSync(join(clean, "src/widget.js"), "utf8");
  const outDir = join(consumer, "audit-out");
  const a = q(`audit --path "${clean}" --project p63 --out-dir "${outDir}"`);
  const aj = parseJson(a.stdout);
  if (!aj?.report || aj.report.verdict !== "pass" || aj.report.summary.blocking !== 0) {
    fail(`6.3 A: ${a.stdout}\n${a.stderr}`);
  }
  if (!existsSync(join(outDir, `audit-${aj.auditId}.json`)) || !existsSync(join(outDir, `audit-${aj.auditId}.md`))) {
    fail("6.3 missing report files");
  }
  const dirty = join(consumer, "audit-dirty");
  writeProduct(dirty, true);
  const b = q(`audit --path "${dirty}" --project p63b`);
  const bj = parseJson(b.stdout);
  if (bj?.report?.verdict !== "fail" || !bj.report.summary.blocking) fail(`6.3 B: ${b.stdout}`);
  if (readFileSync(join(clean, "src/widget.js"), "utf8") !== before) fail("6.3 C mutated source");
  const id = aj.auditId;
  const db2 = join(consumer, "quality.sqlite");
  const reread = run(`node "${qbin}" audit-report --id ${id}`, consumer, {
    env: { ...process.env, PRAXIS_QUALITY_DB: db2 },
  });
  const rj = parseJson(reread.stdout);
  if (!rj?.report || rj.report.auditId !== id) fail(`6.3 D: ${reread.stdout}`);
  proven.push("6.3 formal codebase audit report");
}

// --- 6.6 ---
{
  const repo = join(consumer, "rb-repo");
  mkdirSync(repo, { recursive: true });
  git(repo, ["init", "-b", "main"]);
  git(repo, ["config", "user.email", "t@t.t"]);
  git(repo, ["config", "user.name", "t"]);
  writeProduct(repo, false);
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", "all"]);
  const sha = git(repo, ["rev-parse", "HEAD"]);
  write(join(consumer, "handoff66.json"), { ...handoff, mergeRequestRef: "local/WP-66" });
  const rev = q(
    `review-path --path "${repo}" --handoff "${join(consumer, "handoff66.json")}" --project p66`,
  );
  const revj = parseJson(rev.stdout);
  if (revj?.verdict !== "pass") fail(`6.6 review: ${rev.stdout}`);
  write(join(consumer, "rb.json"), {
    contract: "quality.rollback.event",
    version: "0.1.0",
    projectId: "p66",
    workPackageId: "WP-1",
    mergeRequestRef: "local/WP-66",
    affectedRef: sha,
    reason: "incident",
    trigger: "ops",
    reviewId: revj.reviewId,
    status: "recorded",
    evidence: "sev1",
  });
  const rb = q(`record-rollback --in "${join(consumer, "rb.json")}" --repo "${repo}"`);
  const rbj = parseJson(rb.stdout);
  if (!rb.ok || rbj.review_id !== revj.reviewId) fail(`6.6 A: ${rb.stdout}`);
  const m = q(`metrics --project p66`);
  const mj = parseJson(m.stdout);
  if (!(mj.rollbackRate > 0) || mj.rollbacks < 1) fail(`6.6 metrics ${m.stdout}`);
  write(join(consumer, "hf.json"), {
    contract: "quality.hotfix.event",
    version: "0.1.0",
    projectId: "p66",
    rollbackId: rbj.id,
    hotfixRef: sha,
    reason: "patch",
    verification: "pass",
  });
  const hf = q(`record-hotfix --in "${join(consumer, "hf.json")}" --repo "${repo}"`);
  if (!hf.ok) fail(`6.6 B: ${hf.stderr}`);
  const listed = q(`list-rollbacks --project p66`);
  const lj = parseJson(listed.stdout);
  if (lj.hotfixes?.length !== 1 || lj.rollbacks?.length !== 1) fail(`6.6 history ${listed.stdout}`);
  write(join(consumer, "rb-bad.json"), {
    contract: "quality.rollback.event",
    version: "0.1.0",
    projectId: "p66",
    mergeRequestRef: "x",
    affectedRef: sha,
    reason: "x",
    trigger: "ops",
    reviewId: 999999,
    status: "recorded",
    evidence: "x",
  });
  const bad = q(`record-rollback --in "${join(consumer, "rb-bad.json")}" --repo "${repo}"`);
  if (bad.ok) fail("6.6 C should reject unknown review");
  proven.push("6.6 rollback/hotfix event workflow");
}

// --- 6.7 ---
{
  const prod = join(consumer, "ret-prod");
  writeProduct(prod, true);
  write(join(consumer, "handoff67.json"), handoff);
  const failRev = q(
    `review-path --path "${prod}" --handoff "${join(consumer, "handoff67.json")}" --project p67 --skip-tests`,
  );
  const fj = parseJson(failRev.stdout);
  const bid = fj.findings.find((f) => !f.ok && f.severity === "error")?.id;
  if (!bid) fail(`6.7 no blocking ${failRev.stdout}`);
  const qa = q(
    `create-return --review ${fj.reviewId} --source qa --findings ${bid} --reason "qa"`,
  );
  const qaj = parseJson(qa.stdout);
  if (qaj.source !== "qa" || qaj.status !== "open") fail(`6.7 A ${qa.stdout}`);
  const cr = q(
    `create-return --review ${fj.reviewId} --source code-review --findings ${bid} --reason "cr"`,
  );
  if (parseJson(cr.stdout).source !== "code-review") fail("6.7 code-review source");
  const badf = q(`create-return --review ${fj.reviewId} --source qa --findings no-such --reason x`);
  if (badf.ok) fail("6.7 B should reject");
  writeProduct(prod, false);
  const pass = q(
    `review-path --path "${prod}" --handoff "${join(consumer, "handoff67.json")}" --project p67 --skip-tests`,
  );
  const pj = parseJson(pass.stdout);
  const resolved = q(`resolve-return --id ${qaj.id} --follow-up ${pj.reviewId}`);
  if (parseJson(resolved.stdout).status !== "resolved") fail(`6.7 C ${resolved.stdout}`);
  const met = parseJson(q(`metrics --project p67`).stdout);
  if (!(met.returnRate > 0)) fail("6.7 D metrics");
  const listed = parseJson(q(`list-returns --project p67`).stdout);
  if (!listed.some((r) => r.status === "resolved")) fail("6.7 E persist");
  proven.push("6.7 QA/code-review return workflow");
}

// --- 6.8 ---
{
  const prod = join(consumer, "norm-prod");
  writeProduct(prod, true);
  const ks = join(consumer, "knowledge-findings.json");
  write(ks, { proposals: [], rejections: [] });
  for (let i = 0; i < 2; i += 1) {
    q(`review-path --path "${prod}" --project p68 --skip-tests`);
  }
  let an = q(`propose-norms --project p68 --knowledge-store "${ks}"`);
  let aj = parseJson(an.stdout);
  if (aj.proposals?.length) fail("6.8 A should have no proposal yet");
  q(`review-path --path "${prod}" --project p68 --skip-tests`);
  an = q(`propose-norms --project p68 --knowledge-store "${ks}"`);
  aj = parseJson(an.stdout);
  if (aj.proposals?.length !== 1) fail(`6.8 B ${an.stdout}`);
  if (aj.proposals[0].status !== "proposed" || aj.proposals[0].binding !== false) {
    fail("6.8 E binding");
  }
  if (!aj.proposals[0].sourceIds?.length) fail("6.8 D sources");
  q(`review-path --path "${prod}" --project p68 --skip-tests`);
  const dup = parseJson(q(`propose-norms --project p68 --knowledge-store "${ks}"`).stdout);
  if (dup.proposals?.length) fail("6.8 C duplicate");
  const kbin = join(consumer, "node_modules/@praxis/knowledge/bin/praxis-knowledge.mjs");
  const rule = aj.proposals[0].proposedRuleId;
  const rej = run(
    `node "${kbin}" finding reject --store "${ks}" --id "${rule}" --reason "not a company norm"`,
    consumer,
  );
  if (!rej.ok) fail(`knowledge reject: ${rej.stderr}\n${rej.stdout}`);
  const after = parseJson(q(`propose-norms --project p68 --knowledge-store "${ks}"`).stdout);
  if (after.proposals?.length) fail("6.8 F recreated");

  const prod2 = join(consumer, "norm-acc");
  writeProduct(prod2, true);
  const ks2 = join(consumer, "knowledge-findings-2.json");
  write(ks2, { proposals: [], rejections: [] });
  for (let i = 0; i < 3; i += 1) {
    q(`review-path --path "${prod2}" --project p68b --skip-tests`);
  }
  const p2 = parseJson(q(`propose-norms --project p68b --knowledge-store "${ks2}"`).stdout);
  const rule2 = p2.proposals[0].proposedRuleId;
  const acc = run(
    `node "${kbin}" finding accept --store "${ks2}" --id "${rule2}"`,
    consumer,
  );
  if (!acc.ok) fail(`knowledge accept: ${acc.stderr}`);
  const saved = JSON.parse(readFileSync(ks2, "utf8"));
  if (!saved.proposals.some((p) => p.status === "accepted")) fail("6.8 G accept");
  proven.push("6.8 repeated findings to norm proposal");
}

rmSync(packBase, { recursive: true, force: true });

console.log(
  JSON.stringify(
    {
      ok: true,
      source: "external/release-artifacts",
      proven,
      pending,
    },
    null,
    2,
  ),
);
