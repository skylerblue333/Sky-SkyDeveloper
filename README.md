# SkyDeveloper Core

**Status: engineering beta / reusable developer metadata core.** This repository provides a deterministic service-manifest catalog for SKYCOIN4444 engineering components.

## Supported today

- bounded service identifiers and entrypoints;
- explicit runtime classification;
- validated environment-variable requirements without storing secret values;
- declared capability metadata;
- deterministic capability lookup;
- missing-environment analysis;
- strict TypeScript checks and tests.

## Not claimed

This component does not generate code, execute applications, provision infrastructure, deploy services, call cloud APIs, read secret values, validate that a declared capability is actually available, or establish production readiness.

## Development

```bash
npm install
npm run check
npm test
```

## Integration

SKYCOIN4444 can consume `DeveloperCatalog` as metadata for developer tooling or integration planning. Runtime health and deployment evidence must come from the actual services rather than this catalog.

## License

See `LICENSE`.
