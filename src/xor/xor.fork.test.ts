import { createStore, createEvent, fork, allSettled } from 'effector';
import { xor } from './index';

test('xor in forked scope', async () => {
  const $a = createStore(false);
  const $b = createStore(false);
  const $c = createStore(false);
  const changeA = createEvent<boolean>();
  const changeB = createEvent<boolean>();
  const changeC = createEvent<boolean>();

  $a.on(changeA, (_, value) => value);
  $b.on(changeB, (_, value) => value);
  $c.on(changeC, (_, value) => value);

  const $result = xor($a, $b, $c);

  const scope = fork();

  expect(scope.getState($result)).toBe(false);

  await allSettled(changeA, { scope, params: true });
  expect(scope.getState($result)).toBe(true);

  await allSettled(changeB, { scope, params: true });
  expect(scope.getState($result)).toBe(false);

  await allSettled(changeB, { scope, params: false });
  expect(scope.getState($result)).toBe(true);

  await allSettled(changeC, { scope, params: true });
  expect(scope.getState($result)).toBe(false);

  await allSettled(changeA, { scope, params: false });
  expect(scope.getState($result)).toBe(true);

  await allSettled(changeC, { scope, params: false });
  expect(scope.getState($result)).toBe(false);
});
