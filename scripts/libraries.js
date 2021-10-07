const { promisify } = require('util');
const fs = require('fs');
const { camelCase } = require('camel-case');

const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);

function createCommonJsIndex(names) {
  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `module.exports.${camel} = require('./${name}').${camel};`;
  });

  return imports.join('\n') + '\n';
}

function createMjsIndex(names) {
  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `export { ${camel} } from './${name}/index.mjs'`;
  });

  return imports.join('\n') + '\n';
}

function createTypingsIndex(names) {
  const types = names
    .sort()
    .map((name) => `export { ${camelCase(name)} } from './${name}';`);

  return types.join('\n') + '\n';
}

function createFactoriesJson(library, names) {
  const methods = names.sort().map((method) => `${library}/${method}`);

  const factories = [library, ...methods];

  const mapping = Object.fromEntries(names.map((name) => [camelCase(name), name]));

  return { factories, mapping };
}

async function createDistribution(dir) {
  return {
    write: (path, content) => writeFile(`${dir}/${path}`, content),
    copyList: (source, list, fn = (i) => i) =>
      Promise.all(
        list.map((file) => copyFile(`${source}/${file}`, `${dir}/${fn(file)}`)),
      ),
  };
}

module.exports = {
  writeFile,
  createCommonJsIndex,
  createMjsIndex,
  createTypingsIndex,
  createFactoriesJson,
  createDistribution,
};
