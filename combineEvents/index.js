const { createStore, createEvent, guard, merge, sample } = require('effector');

function combineEvents(events) {
  const target = createEvent();
  const isArray = Array.isArray(events);
  const keys = Object.keys(events);
  const counter = createStore(keys.length).reset(sample(target));
  const results = createStore(isArray ? [] : {}).reset(target);

  for (const key of keys) {
    const done = createStore(false)
      .on(events[key], () => true)
      .reset(target);
    counter.on(done, (value) => value - 1);
    results.on(events[key], (shape, payload) => {
      // eslint-disable-next-line no-param-reassign
      shape[key] = payload;
      return isArray ? [...shape] : { ...shape };
    });
  }

  guard({
    source: sample(results, merge(Object.values(events))),
    filter: counter.map((value) => value === 0),
    target,
  });

  return target;
}

module.exports = { combineEvents };
