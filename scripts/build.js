/* eslint-disable unicorn/no-process-exit, prefer-template */
const globby = require('globby');

const {
  createCommonJsIndex,
  createTypingsIndex,
  createFactoriesJson,
  createDistribution,
  writeFile,
  createMjsIndex,
  createExportsMap,
  resolveMethods,
} = require('./libraries');
const packageJson = require('./source.package.js');

async function main() {
  const library = process.env.LIBRARY_NAME ?? 'patronum';
  const pkg = packageJson();
  pkg.name = library;
  const staticFiles = ['macro.cjs', 'babel-preset.cjs'];

  const directory = await createDistribution('./dist');
  await directory.copyList('./src', staticFiles);
  await directory.copyList('./', ['README.md', 'LICENSE']);

  const names = resolveMethods();

  pkg.exports = {
    './package.json': './package.json',
    '.': {
      require: './index.cjs',
      import: './index.js',
      default: './index.js',
    },
    './babel-preset': {
      require: './babel-preset.cjs',
    },
    './macro': {
      require: './macro.cjs',
    },
    ...createExportsMap(names),
  };

  const internalPkg = {
    type: 'module',
    main: 'index.cjs',
    module: 'index.js',
    types: 'index.d.ts',
  };

  await Promise.all(
    names.map((name) =>
      directory.write(`${name}/package.json`, JSON.stringify(internalPkg, null, 2)),
    ),
  );

  await directory.write('index.cjs', createCommonJsIndex(names));
  await directory.write('index.js', createMjsIndex(names));
  await directory.write('index.d.ts', createTypingsIndex(names));
  await directory.write('macro.d.ts', 'export * from "./index";');

  const productionMethods = names.filter((method) => method !== 'debug');
  const factoriesJson = createFactoriesJson(library, productionMethods);
  const fileName = 'babel-plugin-factories.json';
  await writeFile(`./src/${fileName}`, JSON.stringify(factoriesJson, null, 2));
  await directory.copyList('./src', [fileName]);

  await directory.write('package.json', JSON.stringify(pkg, null, 2));
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});
