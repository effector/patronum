module.exports = () => ({
  name: 'patronum',
  version: '1.2.0-next.2',
  description: '☄️ Effector utility library delivering modularity and convenience',
  main: 'dist/patronum.cjs.js',
  types: 'index.d.ts',
  browser: 'dist/patronum.umd.js',
  files: ['*/*.d.ts', '*/*.js', '*/*.mjs', 'dist'],
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
