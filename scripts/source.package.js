module.exports = () => ({
  name: 'patronum',
  version: '0.0.0-real-version-will-be-set-on-ci',
  description: '☄️ Effector utility library delivering modularity and convenience',
  type: 'module',
  main: 'patronum.cjs',
  types: 'index.d.ts',
  module: 'patronum.js',
  browser: 'patronum.umd.js',
  sideEffects: false,
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
  homepage: 'https://patronum.effector.dev',
  peerDependencies: {
    effector: '^23',
  },
});
