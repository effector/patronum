module.exports = () => ({
  name: 'patronum',
  version: '1.2.0-next.2',
  description: '☄️ Effector utility library delivering modularity and convenience',
  type: 'module',
  main: 'patronum.cjs.js',
  types: 'index.d.ts',
  module: 'patronum.mjs',
  browser: 'patronum.umd.js',
  repository: {
    type: 'git',
    url: 'git+https://github.com/effector/patronum.git',
  },
  keywords: ['babel-preset', 'effector', 'lib', 'modules', 'stdlib', 'util', 'macro'],
  author: `Sergey Sova <mail@sergeysova.com> (https://sergeysova.com/)`,
  license: 'MIT',
  bugs: {
    url: 'https://github.com/effector/patronum/issues',
  },
  homepage: 'https://github.com/effector/patronum#readme',
});
