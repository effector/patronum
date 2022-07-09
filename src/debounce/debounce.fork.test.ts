import 'regenerator-runtime/runtime';
import { createDomain, fork, serialize, allSettled } from 'effector';

import { debounce } from './index';

test('debounce works in forked scope', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value) => value + 1);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-m5qxcs": 1,
    }
  `);
});

test('debounce do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scopeA = fork(app);
  const scopeB = fork(app);

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    Object {
      "o0molj": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "o0molj": 200,
    }
  `);
});

test('debounce do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "ejdhvp": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});

test('debounce does not break parallel scopes', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const dummy = app.createEvent();
  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scopeA = fork(app);
  const scopeB = fork(app);

  allSettled(trigger, {
    scope: scopeA,
    params: 10,
  });

  allSettled(trigger, {
    scope: scopeB,
    params: 20,
  });

  await new Promise((r) => setTimeout(r, 20));

  allSettled(trigger, {
    scope: scopeA,
    params: 10,
  });

  allSettled(trigger, {
    scope: scopeB,
    params: 20,
  });

  await Promise.all([
    allSettled(dummy, { scope: scopeA }),
    allSettled(dummy, { scope: scopeB }),
  ]);

  expect(serialize(scopeA)).toEqual({
    [$counter.sid!]: 10,
  });

  expect(serialize(scopeB)).toEqual({
    [$counter.sid!]: 20,
  });
});
