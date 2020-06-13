const { createEffect, createEvent, guard, is, sample } = require('effector');
const { readConfig } = require('../library');

function throttle(argument) {
  const { source, timeout, target, sid, loc, name } = readConfig(argument, [
    'source',
    'timeout',
    'target',

    'loc',
    'name',
    'sid',
  ]);

  if (!is.unit(source))
    throw new TypeError('callee must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  const actualName = name || source.shortName || 'unknown';

  const tick =
    target ||
    createEvent({
      name: `${actualName}ThrottleTick`,
      loc,
    });

  const timer = createEffect({
    name: `${actualName}ThrottleTimer`,
    sid,
    loc,
    handler: (payload) =>
      new Promise((resolve) => setTimeout(resolve, timeout, payload)),
  });

  guard({
    source,
    filter: timer.pending.map((pending) => !pending),
    target: timer,
  });

  sample({
    source,
    clock: timer.done.map(({ result }) => result),
    target: tick,
  });

  return tick;
}

module.exports = { throttle };
