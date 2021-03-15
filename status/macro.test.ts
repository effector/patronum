import pluginTester from 'babel-plugin-tester';

pluginTester({
  plugin: require('effector/babel-plugin'),
  pluginName: 'effector/babel-plugin',
  pluginOptions: {
    importName: 'patronum/status',
    attachCreators: ['status'],
    noDefaults: true,
    addLoc: true,
  },
  root: __dirname,
  filename: 'example.js',
  tests: {
    'adds sid': {
      code: `import { status } from "patronum/status"; const $status = status({ effect });`,
      snapshot: true,
    },
  },
});
