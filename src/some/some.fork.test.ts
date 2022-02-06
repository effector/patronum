import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEvent,
  createStore,
} from 'effector';

import { some } from './index';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const change = app.createEvent();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, () => 1);
  const $third = app.createStore(0);

  const _$result = some({ predicate: 1, stores: [$first, $second, $third] });

  const scope = fork(app);

  await allSettled(change, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-82rbof": 1,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const _$result = some({
    predicate: (x) => x > 0,
    stores: [$first, $second, $third],
  });

  const scopeA = fork(app);
  const scopeB = fork(app);

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
    Object {
      "wn468b": 2,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "wn468b": 200,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const $result = some({
    predicate: (x) => x > 0,
    stores: [$first, $second, $third],
  });

  const scope = fork(app);

  await allSettled(change, {
    scope,
    params: 1,
  });

  await allSettled(change, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "nmwlwo": 2,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});

test('allow predicate to use store', async () => {
  const setSource = createEvent<boolean>();
  const setPredicate = createEvent<boolean>();

  const $predicate = createStore(false).on(setPredicate, (_, value) => value);

  const $first = createStore(true);
  const $second = createStore(true).on(setSource, (_, value) => value);
  const $third = createStore(true);

  const $result = some({ predicate: $predicate, stores: [$first, $second, $third] });

  const scope = fork();

  expect(scope.getState($result)).toBeFalsy();

  await allSettled(setSource, { scope, params: false });
  expect(scope.getState($result)).toBeTruthy();

  await allSettled(setPredicate, { scope, params: true });
  expect(scope.getState($result)).toBeTruthy();

  await allSettled(setSource, { scope, params: true });
  expect(scope.getState($result)).toBeTruthy();
});
