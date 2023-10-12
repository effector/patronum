import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEvent,
  createStore,
} from 'effector';

import { every } from './index';

test('every works in forked scope', async () => {
  const app = createDomain();
  const change = app.createEvent();
  const $first = app.createStore(0);
  const $second = app.createStore(1).on(change, () => 0);
  const $third = app.createStore(0);

  const _$result = every({ predicate: 1, stores: [$first, $second, $third] });

  const scope = fork();

  await allSettled(change, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "-tgyj53": 0,
    }
  `);
});

test('every do not affect another forks', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const _$result = every({
    predicate: (x) => x > 0,
    stores: [$first, $second, $third],
  });

  const scopeA = fork();
  const scopeB = fork();

  await allSettled(change, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(change, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(change, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(change, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    {
      "b8wyrn": 2,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    {
      "b8wyrn": 200,
    }
  `);
});

test('every do not affect original store value', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const $result = every({
    predicate: (x) => x > 0,
    stores: [$first, $second, $third],
  });

  const scope = fork();

  await allSettled(change, {
    scope,
    params: 1,
  });

  await allSettled(change, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "28peg0": 2,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});

test('allow predicate to use store', async () => {
  const setSource = createEvent<boolean>();
  const setPredicate = createEvent<boolean>();

  const $predicate = createStore(false).on(setPredicate, (_, value) => value);

  const $first = createStore(true);
  const $second = createStore(false).on(setSource, (_, value) => value);
  const $third = createStore(true);

  const $result = every({ predicate: $predicate, stores: [$first, $second, $third] });

  const scope = fork();

  expect(scope.getState($result)).toBeFalsy();

  await allSettled(setSource, { scope, params: true });
  expect(scope.getState($result)).toBeFalsy();

  await allSettled(setPredicate, { scope, params: true });
  expect(scope.getState($result)).toBeTruthy();

  await allSettled(setSource, { scope, params: false });
  expect(scope.getState($result)).toBeFalsy();
});

test('allow predicate to use store in short form', async () => {
  const setSource = createEvent<boolean>();
  const setPredicate = createEvent<boolean>();

  const $predicate = createStore(false).on(setPredicate, (_, value) => value);

  const $first = createStore(true);
  const $second = createStore(false).on(setSource, (_, value) => value);
  const $third = createStore(true);

  const $result = every([$first, $second, $third], $predicate);

  const scope = fork();

  expect(scope.getState($result)).toBeFalsy();

  await allSettled(setSource, { scope, params: true });
  expect(scope.getState($result)).toBeFalsy();

  await allSettled(setPredicate, { scope, params: true });
  expect(scope.getState($result)).toBeTruthy();

  await allSettled(setSource, { scope, params: false });
  expect(scope.getState($result)).toBeFalsy();
});
