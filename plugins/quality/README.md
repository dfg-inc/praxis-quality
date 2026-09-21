# praxis-quality

Company-internal **QA** plugin. **UNLICENSED**. Uses `@praxis/jira` orchestration and `apps/quality-service` for persisted reviews.

**Claude UI / Cowork:** install Praxis Runtime, then import `claude-plugins/praxis-quality.zip`. Call `praxis_quality_ensure` / `praxis_quality_review` / `praxis_quality_apply_preview` / `praxis_quality_apply` via the shared Runtime MCP. Do not tell the user to run `make quality-up`.

**Claude Code / CI:** `praxis quality --help` or `make qa`.

Role `qa`, stage `quality`.

```bash
node plugins/quality/tools/session-bootstrap.mjs .
make qa WP=PRX-2 REPO=/path/to/product
```
