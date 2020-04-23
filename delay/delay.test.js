const { createStore, createEvent, createEffect } = require('effector');
const { delay } = require('./index');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('delay event with number', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, 100);
  const fn = jest.fn();
  delayed.watch(fn);

  trigger(1);
  expect(fn).toBeCalledTimes(0);
  await wait(50);
  expect(fn).toBeCalledTimes(0);
  await wait(50);
  expect(fn).toBeCalledTimes(1);

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
    ]
  `);
});

test('double delay event with number', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, 100);
  const fn = jest.fn();
  delayed.watch(fn);

  trigger(1);
  expect(fn).toBeCalledTimes(0);
  await wait(50);
  expect(fn).toBeCalledTimes(0);

  trigger(2);
  await wait(50);
  expect(fn).toBeCalledTimes(1);
  await wait(50);
  expect(fn).toBeCalledTimes(2);

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
      Array [
        2,
      ],
    ]
  `);
});

test('delay event with function', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, { time: () => 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  trigger(1);
  expect(fn).toBeCalledTimes(0);
  await wait(50);
  expect(fn).toBeCalledTimes(0);
  await wait(50);
  expect(fn).toBeCalledTimes(1);

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
    ]
  `);
});

test('delay event with function of argument', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, { time: (number) => number * 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  trigger(1); // 100ms delay
  expect(fn).toBeCalledTimes(0);

  await wait(100);
  expect(fn).toBeCalledTimes(1);

  trigger(2); // 200ms delay
  await wait(100);
  expect(fn).toBeCalledTimes(1);

  await wait(100);
  expect(fn).toBeCalledTimes(2);

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
      Array [
        2,
      ],
    ]
  `);
});

test('delay store', async () => {
  const change = createEvent();
  const $source = createStore(0).on(change, (_, value) => value);
  const delayed = delay($source, 100);
  const fn = jest.fn();
  delayed.watch(fn);

  change(1);
  expect(fn).toBeCalledTimes(0);
  await wait(50);
  expect(fn).toBeCalledTimes(0);

  change(2);
  await wait(50);
  expect(fn).toBeCalledTimes(1);
  await wait(50);
  expect(fn).toBeCalledTimes(2);

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
      Array [
        2,
      ],
    ]
  `);
});

test('double delay effect', async () => {
  const effect = createEffect().use(() => 0);
  const delayed = delay(effect, 100);
  const fn = jest.fn();
  delayed.watch(fn);

  effect(1);
  expect(fn).toBeCalledTimes(0);

  await wait(50);
  expect(fn).toBeCalledTimes(0);

  effect(2);
  await wait(50);
  expect(fn).toBeCalledTimes(1);

  await wait(50);
  expect(fn).toBeCalledTimes(2);

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
      Array [
        2,
      ],
    ]
  `);
});
