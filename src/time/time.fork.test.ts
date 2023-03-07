import 'regenerator-runtime/runtime';
import { createEvent, fork, serialize, allSettled } from 'effector';

import { time } from './index';

test('time with custom timing reading fn should not affect different scopes', async () => {
  let counter = 0;
  const clock = createEvent();
  const $time = time({ clock, getNow: () => ++counter });

  const scopeA = fork();
  const scopeB = fork();

  expect(scopeA.getState($time)).toBe(1);
  expect(scopeB.getState($time)).toBe(1);

  await allSettled(clock, { scope: scopeA });
  expect(scopeA.getState($time)).toBe(2); // changed only scopeA
  expect(scopeB.getState($time)).toBe(1);

  await allSettled(clock, { scope: scopeA });
  expect(scopeA.getState($time)).toBe(3); // changed only scopeA
  expect(scopeB.getState($time)).toBe(1);

  await allSettled(clock, { scope: scopeB });
  expect(scopeA.getState($time)).toBe(3);
  expect(scopeB.getState($time)).toBe(4); // changed only scopeB with the gap
});

test('store must correctly serializes', async () => {
  let counter = 0;
  const clock = createEvent();
  const $time = time({ clock, getNow: () => ++counter });

  const scopeA = fork();
  const scopeB = fork();

  expect(serialize(scopeA)).toMatchInlineSnapshot(`{}`);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`{}`);

  await allSettled(clock, { scope: scopeA });
  await allSettled(clock, { scope: scopeB });
  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    {
      "-9m03zk|-xu6mk0": 2,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    {
      "-9m03zk|-xu6mk0": 3,
    }
  `);
});
