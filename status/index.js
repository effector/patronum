const { createStore } = require('effector');
const { readConfig } = require('../library');

function status(argument) {
  const { effect, defaultValue = 'initial' } = readConfig(argument, [
    'effect',
    'defaultValue',
  ]);
  const $status = createStore(defaultValue);

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}

module.exports = { status };
