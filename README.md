# praxis-quality

Independent Praxis Quality **Skills** plugin. Distribution: **`praxis-quality.zip`**.

The Quality **HTTP worker** lives in [`praxis-runtime`](https://github.com/dfg-inc/praxis-runtime), not here.

## Clone / develop

```bash
git clone https://github.com/dfg-inc/praxis-quality.git
cd praxis-quality
npm ci
npm run verify
```

## Install

[Releases](https://github.com/dfg-inc/praxis-quality/releases): `praxis-quality.zip` + `release-meta.json`.

Core via tracked `vendor/*.tgz`. Worker gates (`accept:quality-*`) live in **praxis-runtime**.

## Release

This plugin's version is independent of Core, Runtime, and the other role plugins. `ecosystem.json` records it (`policy: independent`). Core pins change only when this plugin needs a newer Core: `node tools/scripts/set-ecosystem-version.mjs --vendor <core-version>`.

Tag `v$version` on GitLab first. After that tag pipeline passes, GitHub Actions publishes the ZIP.
