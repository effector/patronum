const { createStore } = require('effector');

function statusEffect(effect, defaultValue = 'initial') {
  const $value = createStore(defaultValue);

  $value.on(effect, () => 'pending');
  $value.on(effect.done, () => 'done');
  $value.on(effect.fail, () => 'fail');

  return $value;
}

module.exports = { statusEffect };
