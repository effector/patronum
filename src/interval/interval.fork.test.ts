import {
  allSettled,
  createEvent,
  fork,
  createStore,
  sample,
  createWatch, createEffect, scopeBind,
} from 'effector'
import { argumentHistory, wait, watch } from '../../test-library';
import { interval, IntervalCleanupFxProps, IntervalTimeoutFxProps } from '.'

test('works in forked scope', async () => {
  const start = createEvent();
  const stop = createEvent();
  const { tick } = interval({ timeout: 10, start, stop });
  const fn = watch(tick);

  const scope = fork();
  allSettled(start, { scope });
  expect(fn).not.toBeCalled();

  await wait(28);
  expect(fn).toBeCalledTimes(2);

  allSettled(stop, { scope });

  await wait(32);
  expect(fn).toBeCalledTimes(2);
});

test('isRunning works in fork', async () => {
  const start = createEvent();
  const stop = createEvent();
  const { isRunning } = interval({ timeout: 10, start, stop });
  const fn = watch(isRunning);

  const scope = fork();
  expect(scope.getState(isRunning)).toBe(false);

  allSettled(start, { scope });
  expect(scope.getState(isRunning)).toBe(true);

  await wait(32);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      false,
      true,
    ]
  `);

  allSettled(stop, { scope });

  await wait(32);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      false,
      true,
      false,
    ]
  `);
});

test('concurrent run of interval in different scopes', async () => {
  const start = createEvent();
  const stop = createEvent();
  const { tick, isRunning } = interval({ timeout: 10, start, stop });
  const fn = watch(isRunning);

  const scopeA = fork();
  const scopeB = fork();

  allSettled(start, { scope: scopeA });
  expect(scopeA.getState(isRunning)).toBe(true);
  expect(scopeB.getState(isRunning)).toBe(false);

  allSettled(start, { scope: scopeB });
  expect(scopeA.getState(isRunning)).toBe(true);
  expect(scopeB.getState(isRunning)).toBe(true);

  allSettled(stop, { scope: scopeB });
  expect(scopeA.getState(isRunning)).toBe(true);
  expect(scopeB.getState(isRunning)).toBe(false);

  allSettled(stop, { scope: scopeA });
  expect(scopeA.getState(isRunning)).toBe(false);
  expect(scopeB.getState(isRunning)).toBe(false);
});

test('does not leaves unresolved timeout effect, if stopped', async () => {
  const start = createEvent();
  const stop = createEvent();
  const { tick } = interval({ timeout: 1, start, stop });
  const $count = createStore(0).on(tick, (s) => s + 1);
  sample({
    source: $count,
    clock: tick,
    filter: (c) => c === 6,
    target: stop,
  });

  const scope = fork();
  await allSettled(start, { scope });

  expect(scope.getState($count)).toEqual(6);
});

describe('@@trigger', () => {
  test('fire tick on start and stop after teardown', async () => {
    const listener = jest.fn();
    const intervalTrigger = interval({ timeout: 1 })['@@trigger']();

    const scope = fork();

    const unwatch = createWatch({
      unit: intervalTrigger.fired,
      fn: listener,
      scope,
    });

    allSettled(intervalTrigger.setup, { scope });

    await wait(1);
    expect(listener).toBeCalledTimes(1);

    await allSettled(intervalTrigger.teardown, { scope });

    await wait(10);
    expect(listener).toBeCalledTimes(1);

    unwatch();
  });
});

test('exposed timers api', async () => {
  const timeoutFx = createEffect(({ canceller, timeout, running }: IntervalTimeoutFxProps) => {
    if (!running) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      canceller.timeoutId = setTimeout(resolve, timeout / 2);
      canceller.reject = reject;
    });
  })

  const cleanupFx = createEffect(({ reject, timeoutId }: IntervalCleanupFxProps) => {
    reject();
    if (timeoutId) clearTimeout(timeoutId);
  });

  const scope = fork({
    handlers: [
      [interval.timeoutFx, timeoutFx],
      [interval.cleanupFx, cleanupFx]
    ],
  });

  const start = createEvent();
  const stop = createEvent();

  const { tick } = interval({ start, stop, timeout: 50 });

  const mockedFn = jest.fn();
  createWatch({
    unit: tick,
    fn: mockedFn,
    scope,
  });

  allSettled(start, { scope });

  await wait(20);

  expect(mockedFn).not.toBeCalled();

  await wait(5);

  expect(mockedFn).toBeCalled();

  stop();
});
