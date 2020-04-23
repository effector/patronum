/* eslint-disable no-param-reassign */
const { createEvent, sample } = require('effector');

function spread(source, target) {
  if (target === undefined) {
    target = source;
    source = createEvent();
  }
  for (const key in target) {
    if (key in target) {
      sample({
        source,
        fn: (data) => data[key],
        target: target[key],
      });
    }
  }

  return source;
}

module.exports = { spread };
