module.exports = {
  env: {
    development: {
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
      ],
      plugins: ['effector/babel-plugin'],
    },
  },
};
