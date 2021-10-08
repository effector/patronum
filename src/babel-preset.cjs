const { factories } = require('./babel-plugin-factories.json');

module.exports = (_api, { importModuleName } = {}, _dirname) => {
  const mappedFactories = importModuleName
    ? factories.map((item) => item.replace('patronum', importModuleName))
    : factories;
  return {
    plugins: [
      [
        'effector/babel-plugin',
        { factories: mappedFactories, noDefaults: true },
        'patronum',
      ],
    ],
  };
};
