# praxis-quality

**QA** plugin, licensed under Apache-2.0 (see LICENSE). Uses `@praxis/jira` orchestration and `apps/quality-service` for persisted reviews.

**Install:** Claude → Customize → Plugins → Add marketplace → `dfg-inc/praxis-marketplace` → choose this plugin (or **Praxis** for the full set); the Runtime is installed with it. Terminal: `/plugin install praxis-quality --marketplace dfg-inc/praxis-marketplace`. Claude Desktop **Chat** has no plugin Runtime: install the separate `praxis-runtime.mcpb`, then upload `claude-plugins/praxis-quality.zip`.. Call `praxis_quality_ensure` / `praxis_quality_review` / `praxis_quality_apply_preview` / `praxis_quality_apply` via the shared Runtime MCP. Do not tell the user to run `make quality-up`.

**Claude Code / CI:** `praxis quality --help` or `make qa`.

Role `qa`, stage `quality`.

```bash
node plugins/quality/tools/session-bootstrap.mjs .
make qa WP=PRX-2 REPO=/path/to/product
```
