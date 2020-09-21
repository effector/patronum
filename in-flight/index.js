const { combine } = require('effector');
const { readConfig } = require('../library');

function inFlight(argument) {
  const { effects } = readConfig(argument, ['effects']);

  return combine(
    effects.map((fx) => fx.inFlight),
    (inFlights) => inFlights.reduce((all, current) => all + current, 0),
  );
}

module.exports = { inFlight };
