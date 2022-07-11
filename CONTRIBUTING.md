## How to run integration tests locally

1. Change working directory to patronum sources `cd patronum`
2. Install dependencies for patronum via yarn v1: `yarn`
3. Build patronum with specific name: `LIBRARY_NAME=@effector/patronum yarn build`
4. Remove all dependencies: `rm -rf node_modules`
5. Go to the integration directory (cra or custom): `cd integration/cra`
6. Install dependencies for this package: `yarn`
7. Add prebuilt patronum to local package: `yarn add ../../dist`
8. Run tests `yarn test`

> Note: be careful NOT to commit `babel-plugin-factories.json` with changed library name `@effector/patronum`

When work is done, please remove `@effector/patronum` from integration packages via `yarn remove @effector/patronum`, else CI can be broken.
