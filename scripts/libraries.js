const { camelCase } = require('camel-case');

function createCommonJsIndex(names) {
  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `module.exports.${camel} = require('./${name}').${camel};`;
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

module.exports = { createCommonJsIndex, createTypingsIndex, createFactoriesJson };
