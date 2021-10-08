import pluginTester from 'babel-plugin-tester';
import settings from './babel-plugin-factories.json';

const { factories } = settings as any;

const statusUsage = `
import { status } from "patronum/status";
const $status = status({ effect });`;

const statusUsageRoot = `
import { status } from "patronum";
const $status = status({ effect });`;

pluginTester({
  title: 'effector plugin',
  plugin: require('effector/babel-plugin'),
  pluginName: 'effector',
  root: __dirname,
  filename: __filename,
  babelOptions: { filename: __filename, root: __dirname },
  snapshot: true,
  tests: {
    'with attachCreators': {
      code: statusUsage,
      pluginOptions: {
        importName: 'patronum/status',
        attachCreators: ['status'],
        noDefaults: true,
        addLoc: true,
      },
    },
    'with fabrics': {
      code: statusUsage,
      pluginOptions: {
        factories,
        addLoc: true,
      },
    },
    'with fabrics and root import': {
      code: statusUsageRoot,
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

const pendingTesting = `
import { pending } from './macro';
import { status } from './macro';
const effect = createEffect();
const $pending = pending({ effects: [effect] });
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
    'import from root': {
      code: macroStatusAndDebounce,
      pluginOptions: {
        patronum: { importFromRoot: true },
      },
    },
    'import from root and rename import': {
      code: macroStatusAndDebounce,
      pluginOptions: {
        patronum: {
          importModuleName: '@effector/patronum',
          importFromRoot: true,
          addNames: true,
        },
      },
    },
    'import from root, rename import and add loc': {
      code: macroStatusAndDebounce,
      pluginOptions: {
        patronum: {
          importModuleName: '@effector/patronum',
          importFromRoot: true,
          addLoc: true,
        },
      },
    },
    'macro for pending': {
      code: pendingTesting,
      pluginOptions: {
        patronum: {
          importModuleName: '@effector/patronum',
          importFromRoot: true,
          addNames: true,
        },
      },
    },
  },
});
