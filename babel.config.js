const { factories } = require('./src/babel-plugin-factories.json');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: process.env.ESMODULES === 'true' ? false : 'cjs',
        targets: {
          node: 'current',
          esmodules: process.env.ESMODULES === 'true',
        },
      },
    ],
    ['./src/babel-preset.cjs'],
  ],
  plugins: [
    [
      'effector/babel-plugin',
      {
        noDefaults: true,
        factories: factories.map(
          (item) => item.replace('patronum', 'src') + '/index',
        ),
      },
      'index',
    ],
    'effector/babel-plugin',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};
