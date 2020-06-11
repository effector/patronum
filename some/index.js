const { combine } = require('effector');

function some(predicate, list) {
  const checker = isFunction(predicate)
    ? predicate
    : (value) => value === predicate;

  return combine(list, (values) => values.some(checker));
}

module.exports = { some };

function isFunction(value) {
  return typeof value === 'function';
}
