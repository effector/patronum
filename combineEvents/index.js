const {
  createStore,
  createEvent,
  guard,
  restore,
  combine,
  sample,
} = require('effector');

function combineEvents(events) {
  const target = createEvent();
  const shape = Array.isArray(events) ? [] : {};
  const keys = Object.keys(events);
  const counter = createStore(keys.length).reset(sample(target));

  for (const key of keys) {
    const done = createStore(false)
      .on(events[key], () => true)
      .reset(target);
    shape[key] = restore(events[key], null).reset(target);
    counter.on(done, (value) => value - 1);
  }

  guard({
    source: combine(shape),
    filter: counter.map((value) => value === 0),
    target,
  });

  return target;
}

module.exports = { combineEvents };
