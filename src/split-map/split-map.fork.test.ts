import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  allSettled,
  createEvent,
  createStore,
  createApi,
  serialize,
} from 'effector';

import { splitMap } from './index';

test('works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first?: number; another?: boolean }>();
  const out = splitMap({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });

  const $data = app.createStore(0);

  $data
    .on(out.first, (state, payload) => state + payload)
    .on(out.__, (state, payload) => (payload ? -state : 0));

  const scope = fork();

  await allSettled(source, {
    scope,
    params: { first: 15 },
  });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "xwy4bm": 15,
    }
  `);

  await allSettled(source, {
    scope,
    params: { another: true },
  });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "xwy4bm": -15,
    }
  `);
});

test('do not affect another fork', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first?: number; another?: boolean }>();
  const out = splitMap({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });

  const $data = app.createStore(0);

  $data
    .on(out.first, (state, payload) => state + payload)
    .on(out.__, (state, payload) => (payload ? -state : 0));

  const scopeA = fork();
  const scopeB = fork();

  await allSettled(source, {
    scope: scopeA,
    params: { first: 200 },
  });
  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    {
      "l4dkuf": 200,
    }
  `);

  await allSettled(source, {
    scope: scopeB,
    params: { first: -5 },
  });
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    {
      "l4dkuf": -5,
    }
  `);
});

test('do not affect original store value', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first?: number; another?: boolean }>();
  const out = splitMap({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });

  const $data = app.createStore(0);

  $data
    .on(out.first, (state, payload) => state + payload)
    .on(out.__, (state, payload) => (payload ? -state : 0));

  const scope = fork();

  await allSettled(source, {
    scope,
    params: { first: 15 },
  });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "8sunrf": 15,
    }
  `);
  expect($data.getState()).toBe($data.defaultState);
});

describe('splitMap with targets', () => {
  test('works in forked scope', async () => {
    const $target = createStore(0);

    const source = createEvent<{ first?: number; another?: boolean }>();
    const out = splitMap({
      source,
      cases: {
        first: (payload) => payload.first,
      },
      targets: {
        first: $target,
        __: createApi($target, { another: (state) => -state }).another,
      },
    });

    const $data = createStore(0);

    $data
      .on(out.first, (state, payload) => state + payload)
      .on(out.__, (state, payload) => (payload ? -state : 0));

    const scope = fork();

    await allSettled(source, {
      scope,
      params: { first: 15 },
    });
    expect(scope.getState($data)).toBe(15);
    expect(scope.getState($target)).toBe(15);

    await allSettled(source, {
      scope,
      params: { another: true },
    });
    expect(scope.getState($data)).toBe(-15);
    expect(scope.getState($target)).toBe(-15);
  });

  test('do not affect another fork', async () => {
    const $target = createStore(0);

    const app = createDomain();
    const source = app.createEvent<{ first?: number; another?: boolean }>();
    const out = splitMap({
      source,
      cases: {
        first: (payload) => payload.first,
      },
      targets: {
        first: $target,
      },
    });

    const $data = app.createStore(0);

    $data
      .on(out.first, (state, payload) => state + payload)
      .on(out.__, (state, payload) => (payload ? -state : 0));

    const scopeA = fork();
    const scopeB = fork();

    await allSettled(source, {
      scope: scopeA,
      params: { first: 200 },
    });
    expect(scopeA.getState($data)).toBe(200);
    expect(scopeA.getState($target)).toBe(200);

    await allSettled(source, {
      scope: scopeB,
      params: { first: -5 },
    });
    expect(scopeB.getState($data)).toBe(-5);
    expect(scopeB.getState($target)).toBe(-5);
  });

  test('do not affect original store value', async () => {
    const $target = createStore(0);

    const app = createDomain();
    const source = app.createEvent<{ first?: number; another?: boolean }>();
    const out = splitMap({
      source,
      cases: {
        first: (payload) => payload.first,
      },
      targets: {
        first: $target,
      },
    });

    const $data = app.createStore(0);

    $data
      .on(out.first, (state, payload) => state + payload)
      .on(out.__, (state, payload) => (payload ? -state : 0));

    const scope = fork();

    await allSettled(source, {
      scope,
      params: { first: 15 },
    });

    expect(scope.getState($data)).toBe(15);
    expect($data.getState()).toBe($data.defaultState);

    expect(scope.getState($target)).toBe(15);
    expect($target.getState()).toBe($target.defaultState);
  });
});
