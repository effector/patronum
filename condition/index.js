const { is, guard, createEvent } = require('effector');

/**
 * if — (payload: T) => boolean,
 * if — Store<boolean>
 * if — T
 */
function condition({
  source,
  if: test,
  then: thenBranch = createEvent(),
  else: elseBranch = createEvent(),
}) {
  const checker =
    is.unit(test) || isFunction(test) ? test : (value) => value === test;

  guard({
    source,
    filter: checker,
    target: thenBranch,
  });

  guard({
    source,
    filter: inverse(checker),
    target: elseBranch,
  });
}

function isFunction(value) {
  return typeof value === 'function';
}

function inverse(fnOrUnit) {
  if (is.unit(fnOrUnit)) {
    return fnOrUnit.map((value) => !value);
  }
  return (value) => !fnOrUnit(value);
}

module.exports = { condition };
