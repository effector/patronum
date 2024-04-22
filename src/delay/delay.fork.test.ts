import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEffect, createEvent, createWatch, UnitValue
} from 'effector'

import { delay, DelayTimerFxProps } from './index'
import { wait } from '../../test-library'

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent();

  const $counter = app.createStore(0, { sid: '$counter' });

  const throttled = delay({ source, timeout: 40 });

  $counter.on(throttled, (value) => value + 1);

  const scope = fork();

  await allSettled(source, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "$counter": 1,
    }
  `);
});

test('throttle works in forked scope with target', async () => {
  const app = createDomain();
  const source = app.createEvent();
  const target = app.createEvent();

  const $counter = app.createStore(0, { sid: '$counter' });

  delay({ source, timeout: 40, target });

  $counter.on(target, (value) => value + 1);

  const scope = fork();

  await allSettled(source, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "$counter": 1,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0, { sid: '$counter' });

  const trigger = app.createEvent<number>();

  const throttled = delay({ source: trigger, timeout: 40 });

  $counter.on(throttled, (value, payload) => value + payload);

  const scopeA = fork();
  const scopeB = fork();

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    {
      "$counter": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    {
      "$counter": 200,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0, { sid: '$counter' });
  const trigger = app.createEvent<number>();

  const throttled = delay({ source: trigger, timeout: 40 });

  $counter.on(throttled, (value, payload) => value + payload);

  const scope = fork();

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "$counter": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});

test('exposed timers api', async () => {
  const timerFx = createEffect<DelayTimerFxProps, UnitValue<any>>(
    ({ payload, milliseconds }) =>
      new Promise((resolve) => {
        setTimeout(resolve, milliseconds / 2, payload);
      }),
  )

  const scope = fork({
    handlers: [[delay.timerFx, timerFx]],
  });

  const mockedFn = jest.fn();

  const clock = createEvent();
  const tick = delay(clock, 50);

  createWatch({
    unit: tick,
    fn: mockedFn,
    scope,
  });

  allSettled(clock, { scope });

  await wait(20);

  expect(mockedFn).not.toBeCalled();

  await wait(5);

  expect(mockedFn).toBeCalled();
});
