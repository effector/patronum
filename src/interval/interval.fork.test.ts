import { allSettled, createEvent, fork } from 'effector';
import { argumentHistory, wait, watch } from '../../test-library';
import { interval } from '.';

test('works in forked scope', async () => {
  const start = createEvent();
  const stop = createEvent();
  const { tick } = interval({ timeout: 10, start, stop });
  const fn = watch(tick);

  const scope = fork();
  allSettled(start, { scope });
  expect(fn).not.toBeCalled();

  await wait(30);
  expect(fn).toBeCalledTimes(2);

  allSettled(stop, { scope });

  await wait(30);
  expect(fn).toBeCalledTimes(2);
});

test('isRunning works in fork', async () => {
  const start = createEvent();
  const stop = createEvent();
  const { tick, isRunning } = interval({ timeout: 10, start, stop });
  const fn = watch(isRunning);

  const scope = fork();
  expect(scope.getState(isRunning)).toBe(false);

  allSettled(start, { scope });
  expect(scope.getState(isRunning)).toBe(true);

  await wait(30);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);

  allSettled(stop, { scope });

  await wait(30);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
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
