const { createEffect } = require('effector');
const { status } = require('patronum/status');

test('change status: initial -> pending -> done', async () => {
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const $status = status({ effect });
  const fn = jest.fn();

  $status.watch(fn);
  expect(fn).lastCalledWith('initial');

  effect();
  expect(fn).lastCalledWith('pending');

  await waitFor(effect.finally);
  expect(fn).lastCalledWith('done');
});

function waitFor(unit) {
  return new Promise((resolve) => {
    const unsubscribe = unit.watch((payload) => {
      resolve(payload);
      unsubscribe();
    });
  });
}
