const { createEvent, createEffect, forward } = require('effector');
const { statusEffect } = require('./index');

test('change status: initial -> pending -> done', async () => {
  const event = createEvent();
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const $status = statusEffect(effect);
  const fn = jest.fn();

  forward({ from: event, to: effect });

  $status.watch(fn);

  event();
  await new Promise((resolve) => effect.finally.watch(resolve));

  expect(fn.mock.calls).toEqual([['initial'], ['pending'], ['done']]);
});

test('change status: initial -> pending -> fail', async () => {
  const event = createEvent();
  const effect = createEffect({
    handler: () => new Promise((_, reject) => setTimeout(reject, 100)),
  });
  const $status = statusEffect(effect);
  const fn = jest.fn();

  forward({ from: event, to: effect });

  $status.watch(fn);

  event();
  await new Promise((resolve) => effect.finally.watch(resolve));

  expect(fn.mock.calls).toEqual([['initial'], ['pending'], ['fail']]);
});

test('change status: initial -> pending -> fail -> initial (clear)', async () => {
  const event = createEvent();
  const clear = createEvent();
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const $status = statusEffect(effect);
  const fn = jest.fn();

  forward({ from: event, to: effect });

  $status.watch(fn);
  $status.reset(clear);

  event();
  await new Promise((resolve) => effect.finally.watch(resolve));
  clear();

  expect(fn.mock.calls).toEqual([
    ['initial'],
    ['pending'],
    ['done'],
    ['initial'],
  ]);
});

test('set default status effect', async () => {
  const event = createEvent();
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const $status = statusEffect(effect, 'pending');
  const fn = jest.fn();

  forward({ from: event, to: effect });

  $status.watch(fn);

  event();
  await new Promise((resolve) => effect.finally.watch(resolve));

  expect(fn.mock.calls).toEqual([['pending'], ['done']]);
});
