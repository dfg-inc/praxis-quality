# praxis-quality

Independent Praxis Quality **Skills** plugin. Distribution: **`praxis-quality.zip`**.

The Quality **HTTP worker** lives in `praxis-runtime`, not here.

```bash
npm ci
npm run verify
```

CI: `validate`, `acceptance` (Skills ZIP + claude-plugins), `pack_zip`.

Core via tracked `vendor/*.tgz`. Quality **HTTP worker** gates (`accept:quality-*`) live in **praxis-runtime**, not here.

Optional worker governance (needs Runtime checkout):

```bash
export PRAXIS_RUNTIME_ROOT=/path/to/praxis-runtime
npm run accept:quality-governance
```
