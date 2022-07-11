const { promisify } = require('util');
const { dirname, resolve } = require('path');
const fs = require('fs');
const { camelCase } = require('camel-case');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const packageMarker = 'index.ts';

function resolveMethods() {
  const localPath = resolve(__dirname, '..', 'src');
  const found = globby.sync(`${localPath}/*/${packageMarker}`);
  const names = found.map((name) =>
    name.replace(`/${packageMarker}`, '').replace(`${localPath}/`, ''),
  );
  return names;
}

function createCommonJsIndex(names) {
  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `module.exports.${camel} = require('./${name}/index.cjs').${camel};`;
  });

  return imports.join('\n') + '\n';
}

function createMjsIndex(names) {
  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `export { ${camel} } from './${name}/index.js'`;
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

function createExportsMap(names) {
  const object = {};
  names.forEach((name) => {
    object[`./${name}/package.json`] = `./${name}/package.json`;
    object[`./${name}`] = {
      require: `./${name}/index.cjs`,
      import: `./${name}/index.js`,
    };
  });
  return object;
}

async function createDistribution(dir) {
  return {
    write: async (path, content) => {
      const directory = dirname(`${dir}/${path}`);
      if (!(await exists(directory))) {
        await mkdir(directory, { recursive: true });
      }
      return writeFile(`${dir}/${path}`, content);
    },
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
  createExportsMap,
  createFactoriesJson,
  createDistribution,
  resolveMethods,
  packageMarker,
};
