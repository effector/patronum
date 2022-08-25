import { allSettled, createEvent, createStore, fork } from 'effector';
import { equals } from './index';

it('should compare booleans', async () => {
  const toggle = createEvent();
  const $a = createStore(true).on(toggle, (a) => !a);
  const $b = createStore(true);
  const $result = equals($a, $b);

  const scope = fork();
  expect(scope.getState($result)).toBe(true);

  await allSettled(toggle, { scope });
  expect(scope.getState($result)).toBe(false);
});

it('should compare numbers', async () => {
  const increment = createEvent();
  const $a = createStore(1).on(increment, (a) => a + 1);
  const $b = createStore(2);
  const $result = equals($a, $b);

  const scope = fork();
  expect(scope.getState($result)).toBe(false);

  await allSettled(increment, { scope });
  expect(scope.getState($result)).toBe(true);
});

it('should compare with literals', async () => {
  const increment = createEvent();
  const $a = createStore(1).on(increment, (a) => a + 1);
  const $result = equals($a, 2);

  const scope = fork();
  expect(scope.getState($result)).toBe(false);

  await allSettled(increment, { scope });
  expect(scope.getState($result)).toBe(true);
});
