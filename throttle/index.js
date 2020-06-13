const { is, createEffect, forward, createEvent, guard } = require('effector');

function throttle({
  source,
  timeout,
  name = source.shortName || 'unknown',
  sid = `${source.sid}Z`,
  loc,
}) {
  if (!is.unit(source))
    throw new TypeError('callee must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  const tick = createEvent({
    name: `${name}ThrottleTick`,
    sid,
    loc,
  });

  const timer = createEffect({
    name: `${name}ThrottleTimer`,
    loc,
    handler: (payload) =>
      new Promise((resolve) => setTimeout(resolve, timeout, payload)),
  });

  guard({
    source,
    filter: timer.pending.map((pending) => !pending),
    target: timer,
  });

  forward({
    from: timer.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}

module.exports = { throttle };
