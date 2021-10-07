/* eslint-disable unicorn/no-process-exit, prefer-template */
const globby = require('globby');

const {
  createCommonJsIndex,
  createTypingsIndex,
  createFactoriesJson,
  createDistribution,
} = require('./libraries');
const packageJson = require('./source.package.js');

const packageMarker = 'index.ts';

async function main() {
  const library = 'patronum';
  const package = packageJson();
  const staticFiles = ['macro.d.ts', 'macro.js', 'babel-preset.js'];

  const directory = await createDistribution('./dist');
  await directory.copyList('.', staticFiles);

  package.files.push(...staticFiles);

  const found = await globby(`./src/*/${packageMarker}`);
  const names = found.map((name) =>
    name.replace(`/${packageMarker}`, '').replace('./src/', ''),
  );

  await directory.write('index.js', createCommonJsIndex(names));
  await directory.write('index.d.ts', createTypingsIndex(names));

  const productionMethods = names.filter((method) => method !== 'debug');
  await directory.write(
    'babel-plugin-factories.json',
    JSON.stringify(createFactoriesJson(library, productionMethods), null, 2),
  );

  await directory.write('package.json', JSON.stringify(package));
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});
