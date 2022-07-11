const { performance } = require('perf_hooks');
const { is } = require('effector');

function waitFor(unit) {
  return new Promise((resolve) => {
    const unsubscribe = unit.watch((payload) => {
      resolve(payload);
      unsubscribe();
    });
  });
}

function argumentHistory(ƒ) {
  return ƒ.mock.calls.map(([value]) => value);
}

function argumentsHistory(ƒ) {
  return ƒ.mock.calls;
}

function time() {
  const start = performance.now();

  const result = {
    diff: () => {
      const end = performance.now();

      return end - start;
    },
  };
  return result;
}

function toBeCloseWithThreshold(received, expected, threshold) {
  const minimum = expected - threshold;
  const maximum = expected + threshold;

  if (received < minimum) {
    return {
      pass: false,
      message: () =>
        `expected ${received} to be close to ${expected}, but it is smaller that minimum ${minimum} with threshold ${threshold}`,
    };
  }
  if (received > maximum) {
    return {
      pass: false,
      message: () =>
        `expected ${received} to be close to ${expected}, but it is bigger that maximum ${maximum} with threshold ${threshold}`,
    };
  }
  return {
    pass: true,
    message: () => `expected ${received} to be close to ${expected}, it is ok`,
  };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function watch(unit) {
  // eslint-disable-next-line no-undef
  const fn = jest.fn();
  unit.watch(fn);
  return fn;
}

function monitor(units) {
  // eslint-disable-next-line no-undef
  const fn = jest.fn();

  units.forEach((unit) => {
    if (is.store(unit)) {
      unit.watch((value) => fn(`Store ${unit.shortName}`, value));
    }
    if (is.event(unit)) {
      unit.watch((value) => fn(`Event ${unit.shortName}`, value));
    }
    if (is.effect(unit)) {
      unit.watch((value) => fn(`Effect ${unit.shortName}`, value));
      unit.done.watch((value) => fn(`Effect ${unit.shortName}.done`, value));
      unit.fail.watch((value) => fn(`Effect ${unit.shortName}.fail`, value));
    }
  });

  return () => argumentsHistory(fn);
}

module.exports = {
  argumentHistory,
  argumentsHistory,
  time,
  toBeCloseWithThreshold,
  wait,
  waitFor,
  watch,
  monitor,
};
