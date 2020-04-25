/* eslint-disable unicorn/no-process-exit */
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

const packageMarker = 'index.d.ts';

async function main() {
  const found = await globby(`./*/${packageMarker}`);

  const names = found.map((name) => name.replace(`/${packageMarker}`, ''));

  const imports = names
    .sort()
    .map((name) => `module.exports.${name} = require('./${name}');`);

  await writeFile('./index.js', imports.join('\n'));
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});
