import pluginTester from 'babel-plugin-tester';
import factories from './babel-plugin-factories.json';

pluginTester({
  title: 'macro',
  plugin: require('effector/babel-plugin'),
  pluginName: 'effector',
  root: __dirname,
  filename: __filename,
  babelOptions: { filename: __filename, root: __dirname },
  snapshot: true,
  tests: {
    'with attachCreators': {
      code: `import { status } from "patronum/status"; const $status = status({ effect });`,
      pluginOptions: {
        importName: 'patronum/status',
        attachCreators: ['status'],
        noDefaults: true,
        addLoc: true,
      },
    },
    'with fabrics': {
      code: `import { status } from "patronum/status"; const $status = status({ effect });`,
      pluginOptions: {
        factories,
        addLoc: true,
      },
    },
    'with fabrics and root import': {
      code: `import { status } from "patronum"; const $status = status({ effect });`,
      pluginOptions: {
        factories,
        addLoc: true,
      },
    },
  },
});

const macroStatusAndDebounce = `
import { status, debounce } from "./macro";
const $status = status({ effect });
const last = debounce({ source: wow, timeout: 10 });
`;

pluginTester({
  plugin: require('babel-plugin-macros'),
  pluginName: 'macros',
  root: __dirname,
  filename: __filename,
  babelOptions: { filename: __filename },
  snapshot: true,
  tests: {
    'with macro': {
      code: macroStatusAndDebounce,
    },
    'renames import': {
      code: macroStatusAndDebounce,
      pluginOptions: {
        patronum: { importModuleName: '@effector/patronum' },
      },
    },
  },
});
