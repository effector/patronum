const {
  createStore,
  createEvent,
  guard,
  merge,
  sample,
  withRegion,
} = require('effector');

function combineEvents(events) {
  const target = createEvent();

  withRegion(target, () => {
    const isArray = Array.isArray(events);
    const keys = Object.keys(events);
    const counter = createStore(keys.length).reset(sample(target));
    const defaultShape = isArray ? [...keys].fill() : {};
    const results = createStore(defaultShape).reset(target);

    for (const key of keys) {
      const done = createStore(false)
        .on(events[key], () => true)
        .reset(target);
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
  });

  return target;
}

module.exports = { combineEvents };
