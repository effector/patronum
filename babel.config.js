const { factories } = require('./babel-plugin-factories.json');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    ['./babel-preset'],
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
  ],
};
