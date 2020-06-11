const { combine } = require('effector');

function every(predicate, list) {
  const checker = isFunction(predicate)
    ? predicate
    : (value) => value === predicate;

  return combine(list, (values) => values.every(checker));
}

module.exports = { every };

function isFunction(value) {
  return typeof value === 'function';
}
