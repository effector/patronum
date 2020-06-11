const { is, sample, guard } = require('effector');

const forIn = (object, callback) => {
  // eslint-disable-next-line guard-for-in
  for (const key in object) {
    callback(object[key], key);
  }
};

const throwError = (message) => {
  throw new Error(message);
};

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

// eslint-disable-next-line consistent-return,unicorn/prevent-abbreviations
function split(...args) {
  let source;
  let cases;
  let [config, key, fn] = args;

  if (key === undefined) {
    if (config.source == null) throwError('config.source should be defined');
    // eslint-disable-next-line prefer-destructuring
    source = config.source;
    // eslint-disable-next-line prefer-destructuring
    key = config.key;
    // eslint-disable-next-line prefer-destructuring
    fn = config.fn;
    // eslint-disable-next-line prefer-destructuring
    cases = config.cases;
  } else {
    source = config;
    config = null;
  }

  source = is.store(source) ? source.updates : source;

  if (config === null) {
    const result = {};
    forIn(key, (predicate, caseName) => {
      result[caseName] = source.filter({ fn: predicate });
      source = source.filter({
        fn: (data) => !predicate(data),
      });
    });
    // eslint-disable-next-line no-underscore-dangle
    result.__ = source;
    return result;
  }

  const keyType = is.store(key) ? 'store' : typeof key;

  if (keyType !== 'object') {
    if (source === config) {
      throwError('key should be an object');
    } else if (cases == null) {
      throwError('config.cases should be defined');
    }
  }

  const keyReader = {
    undefined: (value) => value,
    function: key,
    string: (value) => value[key],
    store: () => key.getState(),
    // eslint-disable-next-line consistent-return
    object: (value) => {
      for (const caseName in key) {
        if (key[caseName](value)) return caseName;
      }
    },
  }[keyType];

  if (keyReader == null) throwError('Invalid key type!');

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

module.exports = { split };
