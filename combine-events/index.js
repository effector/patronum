const { createStore, createEvent, guard, merge, sample } = require('effector');

function combineEvents(events, reset) {
  const target = createEvent();
  const isArray = Array.isArray(events);
  const keys = Object.keys(events);
  const counter = createStore(keys.length).reset(sample(target));
  const results = createStore(isArray ? [] : {}).reset(target);

  if (reset) {
    counter.reset(sample(reset));
    results.reset(reset);
  }

  for (const key of keys) {
    const done = createStore(false)
      .on(events[key], () => true)
      .reset(target);
    if (reset) done.reset(reset);
    counter.on(done, (value) => value - 1);
    results.on(events[key], (shape, payload) => {
      const newShape = isArray ? [...shape] : { ...shape };
      newShape[key] = payload;
      return newShape;
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
