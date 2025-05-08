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

test('strings', async () => {
  const set = createEvent<string>();
  const $str = createStore<string>('').on(set, (_, str) => str);
  const $empty = empty($str);

  const scope = fork();

  expect(scope.getState($empty)).toBe(false);

  allSettled(set, { scope, params: 'hello' });

  expect(scope.getState($empty)).toBe(false);
});

test('void', async () => {
  const set = createEvent<any>();
  const $str = createStore<null | undefined>(null, { skipVoid: false }).on(
    set,
    (_, str) => str,
  );
  const $empty = empty($str);

  const scope = fork();

  expect(scope.getState($empty)).toBe(true);

  allSettled(set, { scope, params: undefined });

  expect(scope.getState($empty)).toBe(true);
});
