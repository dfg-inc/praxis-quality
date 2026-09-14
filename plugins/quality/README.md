# praxis-quality

Company-internal **QA** Claude Code plugin. **UNLICENSED**. Uses `@praxis/jira` orchestration and `apps/quality-service` for persisted reviews.

Role `qa`, stage `quality`.

```bash
node plugins/quality/tools/session-bootstrap.mjs .
make qa WP=PRX-2 REPO=/path/to/product
```
