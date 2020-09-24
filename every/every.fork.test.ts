import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { every } from '.';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const change = app.createEvent();
  const $first = app.createStore(0);
  const $second = app.createStore(1).on(change, () => 0);
  const $third = app.createStore(0);

  const _$result = every({ predicate: 1, stores: [$first, $second, $third] });

  const scope = fork(app);

  await allSettled(change, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-9xrduy": 0,
      "-q07q39": 0,
      "ij1gv4": 0,
      "ryha7v": false,
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

  const _$result = every({
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
      "-jcx1ie": 0,
      "66ukpz": 2,
      "ryha7v": false,
      "yheth1": 0,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "-jcx1ie": 0,
      "66ukpz": 200,
      "ryha7v": false,
      "yheth1": 0,
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

  const $result = every({
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
      "-4ovi4b": 0,
      "-lvnp40": 0,
      "kuw442": 2,
      "ryha7v": false,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});
