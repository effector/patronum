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
} = require('./libraries');
const packageJson = require('./source.package.js');

const packageMarker = 'index.ts';

async function main() {
  const library = process.env.LIBRARY_NAME ?? 'patronum';
  const pkg = packageJson();
  pkg.name = library;
  const staticFiles = ['macro.cjs', 'babel-preset.cjs'];

  const directory = await createDistribution('./dist');
  await directory.copyList('./src', staticFiles);
  await directory.copyList('./', ['README.md', 'MIGRATION.md', 'LICENSE']);

  const found = await globby(`./src/*/${packageMarker}`);
  const names = found.map((name) =>
    name.replace(`/${packageMarker}`, '').replace('./src/', ''),
  );

  pkg.exports = {
    '.': {
      require: './index.js',
      import: './index.mjs',
      default: './index.mjs',
    },
    './babel-preset': {
      require: './babel-preset.cjs',
    },
    './macro': {
      require: './macro.cjs',
    },
    ...createExportsMap(names),
  };

  await directory.write('index.js', createCommonJsIndex(names));
  await directory.write('index.mjs', createMjsIndex(names));
  await directory.write('index.d.ts', createTypingsIndex(names));
  await directory.write('macro.d.ts', 'export * from "./index";');

  const productionMethods = names.filter((method) => method !== 'debug');
  const factoriesJson = createFactoriesJson(library, productionMethods);
  const fileName = 'babel-plugin-factories.json';
  await writeFile(`./src/${fileName}`, JSON.stringify(factoriesJson, null, 2));
  await directory.copyList('./src', [fileName]);

  await directory.write('package.json', JSON.stringify(pkg));
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});
