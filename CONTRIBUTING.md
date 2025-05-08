## How to run integration tests locally

1. Change working directory to patronum sources `cd patronum`
2. Install dependencies for patronum via pnpm: `pnpm install`
3. Build patronum with specific name: `LIBRARY_NAME=@effector/patronum pnpm build`
4. Remove all dependencies: `rm -rf node_modules`
5. Go to the integration directory (cra or custom): `cd integration/cra`
6. Install dependencies for this package: `pnpm install`
7. Add prebuilt patronum to local package: `pnpm add ../../dist`
8. Run tests `pnpm test`

> Note: be careful NOT to commit `babel-plugin-factories.json` with changed library name `@effector/patronum`

When work is done, please remove `@effector/patronum` from integration packages via `pnpm remove @effector/patronum`, else CI can be broken.

## Documentation

All the documentation source code placed in `./documentation`. It is uses [astro](https://astro.build) and [starlight](https://starlight.astro.build) on top of it.

Documentation for operators placed right in the operator directory:

```
./src/
├── and/
│   ├── and.fork.test.ts
│   ├── and.test.ts
│   ├── index.ts
│   └── readme.md
├── combine-events/
│   ├── combine-events.fork.test.ts
│   ├── combine-events.test.ts
│   ├── index.ts
│   └── readme.md
...
```

Documentation uses [Content Layer API](https://docs.astro.build/en/reference/configuration-reference/#querying-and-rendering-with-the-content-layer-api). You may want to [read this discussion](https://github.com/withastro/starlight/discussions/2268).
