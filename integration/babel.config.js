module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    '@effector/patronum/babel-preset',
  ],
  plugins: [
    [
      'macros',
      {
        patronum: { importModuleName: '@effector/patronum' },
      },
    ],
    'effector/babel-plugin',
  ],
};
