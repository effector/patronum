const { is, createEffect, forward, createEvent } = require('effector');
const { readConfig } = require('../library');

function debounce(argument) {
  const { source, timeout, target, sid, loc, name } = readConfig(argument, [
    'source',
    'timeout',
    'target',

    'loc',
    'name',
    'sid',
  ]);

  if (!is.unit(source)) throw new Error('source must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  const actualName = name || source.shortName || 'unknown';

  // eslint-disable-next-line unicorn/consistent-function-scoping
  let rejectPromise = () => undefined;
  let timeoutId;

  const tick =
    target ||
    createEvent({
      name: `${actualName}DebounceTick`,
      loc,
    });

  const timerFx = createEffect({
    name: `${actualName}ThrottleTimer`,
    sid,
    loc,
    handler: (parameter) =>
      new Promise((resolve, reject) => {
        rejectPromise = reject;
        timeoutId = setTimeout(resolve, timeout, parameter);
      }),
  });

  timerFx.watch(() => {
    clearTimeout(timeoutId);
    rejectPromise();
  });

  forward({
    from: source,
    to: timerFx,
  });

  forward({
    from: timerFx.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}

module.exports = { debounce };
