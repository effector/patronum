/* eslint-disable import/no-extraneous-dependencies */
const { createMacro } = require('babel-plugin-macros');
const babelPlugin = require('effector/babel-plugin');
const { factories, mapping } = require('./babel-plugin-factories.json');

module.exports = createMacro(patronum, {
  configName: 'patronum',
});

function patronum({
  references,
  state,
  babel,
  config: { importModuleName = 'patronum', importFromRoot = false, ...options } = {},
}) {
  const program = state.file.path;

  Object.keys(references).forEach((referenceName) => {
    if (!mapping[referenceName]) {
      throw new Error(`Cannot find '${referenceName}' for ${importModuleName}`);
    }
    const methodImportPath = importFromRoot
      ? importModuleName
      : importModuleName + '/' + mapping[referenceName];
    const id = addImport(babel.types, program, referenceName, methodImportPath);

    references[referenceName].forEach((referencePath) => {
      referencePath.node.name = id;
    });
  });

  const instance = babelPlugin(babel, {
    ...options,
    factories: factories.map((name) => name.replace(/^(patronum)/, importModuleName)),
    noDefaults: true,
  });

  instance.pre();
  babel.traverse(program.parent, instance.visitor, undefined, {
    ...instance,
    ...state
  });
  instance.post();
}

function addImport(t, path, specifierName, importPath) {
  const programPath = path.find(path => path.isProgram())

  const [newPath] = programPath.unshiftContainer(
    'body',
    t.importDeclaration(
      [
        t.importSpecifier(
          programPath.scope.generateUidIdentifier(specifierName),
          t.identifier(specifierName),
        ),
      ],
      t.stringLiteral(importPath),
    ),
  );

  let found;

  newPath.get('specifiers').forEach((specifier) => {
    if (specifier.node.imported.name === specifierName) {
      found = specifier;
    }
  });

  return found.node.local.name;
}
