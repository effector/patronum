/* eslint-disable unicorn/no-process-exit, prefer-template */
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const {
  createCommonJsIndex,
  createTypingsIndex,
  createFactoriesJson,
} = require('./libraries');

const writeFile = promisify(fs.writeFile);

const packageMarker = 'index.ts';

async function main() {
  const library = 'patronum';
  const found = await globby(`./*/${packageMarker}`);

  const names = found.map((name) => name.replace(`/${packageMarker}`, ''));

  await writeFile('./index.js', createCommonJsIndex(names));
  await writeFile('./index.d.ts', createTypingsIndex(names));

  const productionMethods = names.filter((method) => method !== 'debug');
  await writeFile(
    './babel-plugin-factories.json',
    JSON.stringify(createFactoriesJson(library, productionMethods), null, 2),
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});
