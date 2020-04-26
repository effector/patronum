/* eslint-disable unicorn/no-process-exit, prefer-template */
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const { camelCase } = require('camel-case');

const writeFile = promisify(fs.writeFile);

const packageMarker = 'index.d.ts';

async function main() {
  const found = await globby(`./*/${packageMarker}`);

  const names = found.map((name) => name.replace(`/${packageMarker}`, ''));

  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `module.exports.${camel} = require('./${name}').${camel};`;
  });

  const types = names
    .sort()
    .map((name) => `export { ${camelCase(name)} } from './${name}';`);

  await writeFile('./index.js', imports.join('\n') + '\n');
  await writeFile('./index.d.ts', types.join('\n') + '\n');
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});
