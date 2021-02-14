const { combine, is } = require('effector');
const { readConfig } = require('../library');

function pending(argument) {
  const { effects: rawEffects, domain } = readConfig(argument, [
    'effects',
    'domain',
  ]);

  if (!is.domain(domain) && !rawEffects)
    throw new TypeError('domain or effects should be passed');

  let effects = rawEffects;

  if (domain) {
    effects = [];
    domain.onCreateEffect((fx) => effects.push(fx));
  }

  return combine(
    effects.map((fx) => fx.pending),
    (pendings) => pendings.some(Boolean),
  );
}

module.exports = { pending };
