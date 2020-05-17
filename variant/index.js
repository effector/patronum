const { is, sample, guard } = require('effector');

function filterMap({ source, filter, fn, target }) {
  if (fn) {
    sample({
      source: guard({ source, filter }),
      fn: (state) => fn(state),
      target,
    });
  } else {
    guard({ source, filter, target });
  }
}

function variant({ source, key, fn, cases }) {
  const keyReader = {
    undefined: (value) => value,
    function: key,
    string: (value) => value[key],
    store: () => key.getState(),
    // eslint-disable-next-line consistent-return
    object: (value) => {
      for (const keyName in key) {
        if (key[keyName](value)) return keyName;
      }
    },
  }[is.store(key) ? 'store' : typeof key];
  // eslint-disable-next-line eqeqeq
  if (keyReader == undefined) {
    // or null
    throw new Error('Invalid key type!');
  }
  let defaultCase = false;
  // eslint-disable-next-line guard-for-in
  for (const caseName in cases) {
    if (caseName === '__') {
      defaultCase = true;
      // eslint-disable-next-line no-continue
      continue;
    }
    filterMap({
      source,
      filter: (value) => String(keyReader(value)) === caseName,
      fn,
      target: cases[caseName],
    });
  }
  if (defaultCase) {
    const namedCases = Object.keys(cases);
    filterMap({
      source,
      filter: (value) => !namedCases.includes(String(keyReader(value))),
      fn,
      // eslint-disable-next-line no-underscore-dangle
      target: cases.__,
    });
  }
}

module.exports = { variant };
