import 'regenerator-runtime/runtime';
import {
  createEvent,
  fork,
  serialize,
  allSettled,
  createEffect
} from 'effector'

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
      "-6rqdme|-40cfpr": 2,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    {
      "-6rqdme|-40cfpr": 3,
    }
  `);
});

test('exposed timers api', async () => {
  let now = 10000;

  const readNowFx = createEffect<void, number>(() => now);

  const scope = fork({
    handlers: [[time.readNowFx, readNowFx]],
  });

  const clock = createEvent();
  const $time = time(clock);

  await allSettled(clock, { scope });

  expect(scope.getState($time)).toBe(10000);

  now = 20000;

  await allSettled(clock, { scope });

  expect(scope.getState($time)).toBe(20000);
});
