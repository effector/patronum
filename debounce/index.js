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

  if (!is.unit(source))
    throw new TypeError('source must be unit from effector');
  if (is.domain(source)) throw new TypeError('source cannot be domain');

  if (typeof timeout !== 'number' || timeout < 0 || !Number.isFinite(timeout))
    throw new Error(
      `timeout must be positive number or zero. Received: "${timeout}"`,
    );

  const actualName = name || source.shortName || 'unknown';

  let rejectPromise;
  let timeoutId;

  const tick =
    target ||
    createEvent({
      name: `${actualName}DebounceTick`,
      loc,
    });

  const timerFx = createEffect({
    name: `${actualName}DebounceTimer`,
    sid,
    loc,
    handler: (parameter) => {
      clearTimeout(timeoutId);
      if (rejectPromise) rejectPromise();
      return new Promise((resolve, reject) => {
        rejectPromise = reject;
        timeoutId = setTimeout(resolve, timeout, parameter);
      });
    },
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
