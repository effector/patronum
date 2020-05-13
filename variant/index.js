const { is, sample, guard } = require('effector');

function reduce({ source, filter, fn, clock, target }) {
  let clockValue;
  if (clock) {
    // eslint-disable-next-line no-param-reassign
    source = sample({
      source,
      clock,
      fn: (state, parameter) => {
        clockValue = parameter;
        return state;
      },
    });
  }
  if (fn) {
    sample({
      source: guard({ source, filter }),
      fn: (state) => fn(state, clockValue),
      target,
    });
  } else {
    guard({ source, filter, target });
  }
}

function variant({ source, key, cases, clock, fn }) {
  const keyType = is.store(key) ? 'store' : typeof key;
  const defaultKeyReader = (value) => value[key];
  const keyReader =
    {
      undefined: (value) => value,
      function: key,
      store: () => key.getState(),
    }[keyType] || defaultKeyReader;
  let defaultCase = false;
  // eslint-disable-next-line guard-for-in
  for (const caseName in cases) {
    if (caseName === '__') {
      defaultCase = true;
      // eslint-disable-next-line no-continue
      continue;
    }
    reduce({
      source,
      clock,
      filter: (value) => String(keyReader(value)) === caseName,
      fn,
      target: cases[caseName],
    });
  }
  if (defaultCase) {
    const namedCases = Object.keys(cases);
    reduce({
      source,
      clock,
      filter: (value) => !namedCases.includes(String(keyReader(value))),
      fn,
      // eslint-disable-next-line no-underscore-dangle
      target: cases.__,
    });
  }
}

module.exports = { variant };
