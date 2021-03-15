const { factories } = require('./babel-plugin-factories.json');

module.exports = (_api, _options, _dirname) => ({
  plugins: [
    ['effector/babel-plugin', { factories, noDefault: true }, 'patronum'],
  ],
});
