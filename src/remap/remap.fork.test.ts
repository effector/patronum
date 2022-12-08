import {
  allSettled,
  createEvent,
  createStore,
  createEffect,
  fork,
  createDomain,
} from 'effector';
import { remap } from './index';

it('throws when only one argument passed', () => {
  const $store = createStore(0);
  // @ts-expect-error
  expect(() => remap($store)).toThrowError(/be a mapper/);
});

it('throws when first argument not a store', () => {
  // @ts-expect-error
  expect(() => remap()).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(1)).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap('str')).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(true)).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(null)).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap({})).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap([])).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(() => null)).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(Symbol())).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(createEvent())).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(createEffect())).toThrowError(/be a store/);
  // @ts-expect-error
  expect(() => remap(createDomain())).toThrowError(/be a store/);
});

describe('single mapper', () => {
  it('throws when second argument not a string', () => {
    // @ts-expect-error
    expect(() => remap(createStore(0), 1)).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), true)).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), null)).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), () => null)).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), Symbol())).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), createEvent())).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), createEffect())).toThrowError(/be a mapper/);
    // @ts-expect-error
    expect(() => remap(createStore(0), createDomain())).toThrowError(/be a mapper/);
  });

  it('throws in runtime when passed not a object from the store', () => {
    const $number = createStore(0);
    const $boolean = createStore(true);
    const $string = createStore('');

    expect(() => remap($number, 'toFixed')).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($string, 'length')).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($boolean, 'valueOf')).toThrowError(
      /should contain only objects/,
    );
  });

  it('returns value for the passed mapper', async () => {
    const update = createEvent<number>();
    const $source = createStore({ a: 1 }).on(update, (_, a) => ({ a }));
    const $result = remap($source, 'a');

    const scope = fork();
    expect(scope.getState($result)).toBe(1);

    await allSettled(update, { scope, params: 10 });
    expect(scope.getState($result)).toBe(10);
  });

  it('returns null when no property from mapper', async () => {
    const $source = createStore({ a: 1 });
    // @ts-expect-error
    const $result = remap($source, 'b');

    const scope = fork();
    expect(scope.getState($result)).toBe(null);
  });

  it('returns null when store is null', async () => {
    const $source = createStore<{ a: number } | null>(null);
    const $result = remap($source, 'a');

    const scope = fork();
    expect(scope.getState($result)).toBe(null);
  });

  it("do not updates if source store didn't changed remapped property", async () => {
    const fn = jest.fn();
    const update = createEvent<number>();
    const $source = createStore({ a: 1, b: 2 }).on(update, ({ b }, a) => ({ a, b }));
    const $resultB = remap($source, 'b');

    $resultB.watch(fn);
    expect(fn).toBeCalledTimes(1);

    const scope = fork();
    await allSettled(update, { scope, params: 10 });
    await allSettled(update, { scope, params: 11 });
    await allSettled(update, { scope, params: 12 });
    expect(scope.getState($resultB)).toBe(2);
    expect(fn).toBeCalledTimes(1);
  });
});

describe('list mapper', () => {
  it('throws when second argument not a string list', () => {
    expect(() => remap(createStore({ a: 0 }), [1])).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore({ a: 0 }), [true])).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore({ a: 0 }), [null])).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore({ a: 0 }), [Symbol()])).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore({ a: 0 }), [createEvent()])).toThrowError(
      /be a string mapper/,
    );
  });

  it('throws when string list is empty', () => {
    expect(() => remap(createStore(0), [])).toThrowError(/string mapper is empty/);
  });

  it('throws in runtime when passed not a object from the store', async () => {
    const $number = createStore(0);
    const $boolean = createStore(true);
    const $string = createStore('');

    expect(() => remap($number, ['toFixed'])).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($string, ['length'])).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($boolean, ['toLocaleString'])).toThrowError(
      /should contain only objects/,
    );
  });

  it('returns a value of the function in the mapper', async () => {
    const update = createEvent<number>();
    const $source = createStore({ a: 1 });
    $source.on(update, (_, a) => ({ a }));
    const [$result] = remap($source, [(s) => s.a]);

    const scope = fork();
    expect(scope.getState($result)).toBe(1);

    await allSettled(update, { scope, params: 10 });
    expect(scope.getState($result)).toBe(10);
  });

  it('returns value for the passed mapper', async () => {
    const update = createEvent<number>();
    const $source = createStore({ a: 1, b: 2 }).on(update, ({ b }, a) => ({ a, b }));
    const [$resultA, $resultB] = remap($source, ['a', 'b']);

    const scope = fork();
    expect(scope.getState($resultA)).toBe(1);
    expect(scope.getState($resultB)).toBe(2);

    await allSettled(update, { scope, params: 10 });
    expect(scope.getState($resultA)).toBe(10);
    expect(scope.getState($resultB)).toBe(2);
  });

  it('returns null when no property from mapper', async () => {
    const $source = createStore({ a: 1 });
    // @ts-expect-error
    const [$result] = remap($source, ['b']);

    const scope = fork();
    expect(scope.getState($result)).toBe(null);
  });

  it('returns null when store is null', async () => {
    const $source = createStore<{ a: number } | null>(null);
    const [$result] = remap($source, ['a']);

    const scope = fork();
    expect(scope.getState($result)).toBe(null);
  });

  it("do not updates if source store didn't changed remapped property", async () => {
    const fn = jest.fn();
    const update = createEvent<number>();
    const $source = createStore({ a: 1, b: 2 }).on(update, ({ b }, a) => ({ a, b }));
    const [$resultB] = remap($source, ['b']);

    $resultB.watch(fn);
    expect(fn).toBeCalledTimes(1);

    const scope = fork();
    await allSettled(update, { scope, params: 10 });
    await allSettled(update, { scope, params: 11 });
    await allSettled(update, { scope, params: 12 });
    expect(scope.getState($resultB)).toBe(2);
    expect(fn).toBeCalledTimes(1);
  });
});

describe.skip('object mapper', () => {
  it('throws when second argument not a string object', () => {
    expect(() => remap(createStore(0), { a: 1 })).toThrowError(/be a string mapper/);
    expect(() => remap(createStore(0), { a: true })).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore(0), { a: null })).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore(0), { a: () => null })).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore(0), { a: Symbol() })).toThrowError(
      /be a string mapper/,
    );
    expect(() => remap(createStore(0), { a: createEvent() })).toThrowError(
      /be a string mapper/,
    );
  });

  it('throws when string object is empty', () => {
    expect(() => remap(createStore(0), [])).toThrowError(/string mapper is empty/);
  });

  it('throws in runtime when passed not a object from the store', async () => {
    const $number = createStore(0);
    const $boolean = createStore(true);
    const $string = createStore('');
    const $function = createStore(() => 1);

    expect(() => remap($number, { a: 'toFixed' })).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($string, { a: 'length' })).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($boolean, { a: 'toLocaleString' })).toThrowError(
      /should contain only objects/,
    );
    expect(() => remap($function, { a: 'length' })).toThrowError(
      /should contain only objects/,
    );
  });

  it('returns a value of the function in the mapper', async () => {
    const update = createEvent<number>();
    const $source = createStore({ a: 1 });
    $source.on(update, (_, a) => ({ a }));
    const { f: $result } = remap($source, { f: (s) => s.a });

    const scope = fork();
    expect(scope.getState($result)).toBe(1);

    await allSettled(update, { scope, params: 10 });
    expect(scope.getState($result)).toBe(10);
  });

  it('returns value for the passed mapper', async () => {
    const update = createEvent<number>();
    const $source = createStore({ a: 1, b: 2 }).on(update, ({ b }, a) => ({ a, b }));
    const { A: $resultA, B: $resultB } = remap($source, { A: 'a', B: 'b' });

    const scope = fork();
    expect(scope.getState($resultA)).toBe(1);
    expect(scope.getState($resultB)).toBe(2);

    await allSettled(update, { scope, params: 10 });
    expect(scope.getState($resultA)).toBe(10);
    expect(scope.getState($resultB)).toBe(2);
  });

  it('returns null when no property from mapper', async () => {
    const $source = createStore({ a: 1 });
    // @ts-expect-error
    const { B: $result } = remap($source, { B: 'b' });

    const scope = fork();
    expect(scope.getState($result)).toBe(null);
  });

  it('returns null when store is null', async () => {
    const $source = createStore<{ a: number } | null>(null);
    const { A: $result } = remap($source, { A: 'a' });

    const scope = fork();
    expect(scope.getState($result)).toBe(null);
  });

  it("do not updates if source store didn't changed remapped property", async () => {
    const fn = jest.fn();
    const update = createEvent<number>();
    const $source = createStore({ a: 1, b: 2 }).on(update, ({ b }, a) => ({ a, b }));
    const { B: $resultB } = remap($source, { B: 'b' });

    $resultB.watch(fn);
    expect(fn).toBeCalledTimes(1);

    const scope = fork();
    await allSettled(update, { scope, params: 10 });
    await allSettled(update, { scope, params: 11 });
    await allSettled(update, { scope, params: 12 });
    expect($resultB).toBe(2);
    expect(fn).toBeCalledTimes(1);
  });
});
