/* eslint-disable import/no-extraneous-dependencies */
const { createMacro } = require('babel-plugin-macros');
const { addNamed } = require('@babel/helper-module-imports');
const { default: traverse } = require('@babel/traverse');
const babelPlugin = require('effector/babel-plugin');
const factories = require('./babel-plugin-factories.json');

module.exports = createMacro(patronum, {
  configName: 'patronum',
});

function patronum({
  references,
  state,
  babel,
  config: { importModuleName = 'patronum' } = {},
}) {
  const program = state.file.path;

  Object.keys(references).forEach((referenceName) => {
    const id = addNamed(program, referenceName, importModuleName, {
      nameHint: referenceName,
    });

    references[referenceName].forEach((referencePath) => {
      referencePath.node.name = id.name;
    });
  });

  const instance = babelPlugin(babel, {
    factories: factories.map((name) =>
      name.replace('patronum', importModuleName),
    ),
    noDefaults: true,
  });

  instance.pre();
  traverse(program.parent, instance.visitor, undefined, {
    ...state,
    ...instance,
  });
  instance.post();
}
