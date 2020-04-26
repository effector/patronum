/* eslint-disable no-param-reassign */
const { createEvent, sample } = require('effector');

/**
 * @examle
 * spread(dataObject, { first: targetA, second: targetB })
 * forward({
 *   to: spread({ first: targetA, second: targetB })
 * })
 */
function spread(source, targetCases) {
  if (targetCases === undefined) {
    targetCases = source;
    source = createEvent();
  }
  for (const key in targetCases) {
    if (key in targetCases) {
      sample({
        source,
        fn: (data) => data[key],
        target: targetCases[key],
      });
    }
  }

  return source;
}

module.exports = { spread };
