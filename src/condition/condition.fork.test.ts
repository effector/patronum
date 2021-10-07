import { createDomain, fork, serialize, allSettled } from 'effector';

import { condition } from './index';

test('condition works in forked scope', async () => {
  const app = createDomain();

  const source = app.createEvent<string>();
  const $if = app.createStore(true);
  const $then = app.createStore('');
  const $else = app.createStore('');
  const fn = jest.fn();
  $then.watch(fn);

  condition({
    source,
    if: $if,
    then: $then,
    else: $else,
  });

  const scope = fork(app);

  await allSettled(source, {
    scope,
    params: 'Demo',
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "tdeurd": "Demo",
    }
  `);
});

test('do not affect another forks', async () => {
  const app = createDomain();

  const source = app.createEvent<string>();
  const $then = app.createStore('');
  const $else = app.createStore('');
  const fn = jest.fn();
  $then.watch(fn);

  condition({
    source,
    if: (string) => string.length > 5,
    then: $then,
    else: $else,
  });

  const scope1 = fork(app);
  const scope2 = fork(app);
  const scope3 = fork(app);

  const promise1 = allSettled(source, {
    scope: scope1,
    params: 'First',
  });

  const promise2 = allSettled(source, {
    scope: scope2,
    params: 'Second',
  });

  const promise3 = allSettled(source, {
    scope: scope3,
    params: 'Third',
  });

  await Promise.all([promise1, promise2, promise3]);

  expect(serialize(scope1)).toMatchInlineSnapshot(`
    Object {
      "-e3rnr5": "First",
    }
  `);
  expect(serialize(scope2)).toMatchInlineSnapshot(`
    Object {
      "2dhngc": "Second",
    }
  `);
  expect(serialize(scope3)).toMatchInlineSnapshot(`
    Object {
      "-e3rnr5": "Third",
    }
  `);
});
