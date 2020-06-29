const {
  createStore,
  createEvent,
  guard,
  merge,
  sample,
  withRegion,
} = require('effector');
const { readConfig } = require('../library');

function combineEvents(argument) {
  const { events, loc, name = 'unknown' } = readConfig(argument, [
    'events',

    'sid',
    'loc',
    'name',
  ]);

  const target = createEvent();

  withRegion(target, () => {
    const isArray = Array.isArray(events);
    const keys = Object.keys(events);
    const defaultShape = isArray ? [...keys].fill() : {};

    const $counter = createStore(keys.length, { name: `${name}Counter`, loc });
    const $results = createStore(defaultShape, {
      name: `${name}Results`,
      loc,
    });

    $counter.reset(sample(target));
    $results.reset(sample(target));

    for (const key of keys) {
      const $isDone = createStore(false)
        .on(events[key], () => true)
        .reset(target);

      $counter.on($isDone, (value) => value - 1);
      $results.on(events[key], (shape, payload) => {
        const newShape = isArray ? [...shape] : { ...shape };
        newShape[key] = payload;
        return newShape;
      });
    }

    guard({
      source: sample($results, merge(Object.values(events))),
      filter: $counter.map((value) => value === 0),
      target,
    });
  });

  return target;
}

module.exports = { combineEvents };
