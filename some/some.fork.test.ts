import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { some } from '.';

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
      "-b0ikr1": 1,
      "-vkjewi": 0,
      "-wlfbo8": 0,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app
    .createStore(0)
    .on(change, (state, payload) => state + payload);
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
      "2o8sim": 0,
      "2olj7": 0,
      "kpi3o0": 2,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "2o8sim": 0,
      "2olj7": 0,
      "kpi3o0": 200,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app
    .createStore(0)
    .on(change, (state, payload) => state + payload);
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
      "6g90u8": 0,
      "dsmw4w": 0,
      "ohibzm": 2,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});
