const { combine, is } = require('effector');
const { readConfig } = require('../library');

const strategies = {
  some: (list) => list.some(Boolean),
  every: (list) => list.every(Boolean),
};

function pending(argument) {
  const { effects: rawEffects, domain, of = 'some' } = readConfig(argument, [
    'effects',
    'domain',
    'of',
  ]);

  if (!is.domain(domain) && !rawEffects)
    throw new TypeError('domain or effects should be passed');

  if (of !== 'some' && of !== 'every')
    throw new TypeError(
      `strategy parameter "of" can be "every" or "some". Passed: "${of}"`,
    );

  let effects = rawEffects;
  const strategy = strategies[of];

  if (domain) {
    effects = [];
    domain.onCreateEffect((fx) => effects.push(fx));
  }

  return combine(
    effects.map((fx) => fx.pending),
    strategy,
  );
}

module.exports = { pending };
