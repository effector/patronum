const { createStore } = require('effector');

function status(effect, initialValue = 'initial') {
  const $status = createStore(initialValue);

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}

module.exports = { status };
