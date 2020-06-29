const { readConfig } = require('../library');

function reshape(argument) {
  const { source, shape } = readConfig(argument, ['source', 'shape']);
  const result = {};

  for (const key in shape) {
    if (key in shape) {
      result[key] = source.map(shape[key]);
    }
  }

  return result;
}

module.exports = { reshape };
