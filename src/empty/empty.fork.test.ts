import { allSettled, createEvent, createStore, fork } from 'effector';
import { empty } from './index';

test('boolean', async () => {
  const makeFalse = createEvent();
  const $a = createStore<boolean | null>(null).on(makeFalse, (_) => false);
  const $result = empty($a);

  const scope = fork();

  expect(scope.getState($result)).toBe(true);

  await allSettled(makeFalse, { scope });
  expect(scope.getState($result)).toBe(false);
});

test('numbers', async () => {
  const increment = createEvent();
  const $a = createStore<number | null>(null).on(increment, (a) => (a ?? -1) + 1);
  const $result = empty($a);

  const scope = fork();

  expect(scope.getState($result)).toBe(true);

  await allSettled(increment, { scope });
  expect(scope.getState($result)).toBe(false);
});
