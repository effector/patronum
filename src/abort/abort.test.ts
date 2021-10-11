import { createEvent, createStore, sample } from 'effector';
import { abort, AbortedError } from './index';

test('Abort: if not aborted, works as regular effect', async () => {
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: () => 'shared',
    async handler(p: number, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const $count = createStore(0).on(fx.done, (s, { params }) => s + params);
  const fn = jest.fn();

  fx.failData.watch(fn);

  fx(1);
  fx(2);
  fx(3);

  await new Promise((r) => setTimeout(r, 10));

  expect($count.getState()).toEqual(6);
  expect(fn).toHaveBeenCalledTimes(0);
});

test('Abort: aborts all effects calls with the same key', async () => {
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: () => 'shared',
    async handler(p: number, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const $count = createStore(0).on(fx.done, (s, { params }) => s + params);
  const fn = jest.fn();

  fx.failData.watch(fn);

  setTimeout(() => {
    signal('shared');
  }, 5);

  fx(1);
  fx(2);
  fx(3);

  await new Promise((r) => setTimeout(r, 10));

  expect($count.getState()).toEqual(0);
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(
    fn.mock.calls.map(([error]) => error.aborted).every((field) => field === true),
  ).toEqual(true);
  expect(fn.mock.calls.map(([error]) => error.key)).toEqual(
    fn.mock.calls.map(() => 'shared'),
  );
});

test('Abort: aborts specific effect by key', async () => {
  const signal = createEvent<number>();

  const abortFn = jest.fn();

  const fx = abort<number>({
    signal,
    getKey: (p) => p,
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          // cleanup
          abortFn(p);
          rj();
          clearTimeout(id);
        });
      });

      return p;
    },
  });
  const $count = createStore(0).on(fx.done, (s, { params }) => s + params);
  const fn = jest.fn();

  fx.failData.watch(fn);

  setTimeout(() => {
    signal(2);
  }, 5);

  fx(1);
  fx(2);
  fx(3);

  await new Promise((r) => setTimeout(r, 10));

  expect($count.getState()).toEqual(4);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(abortFn).toHaveBeenCalledTimes(1);
  expect(abortFn.mock.calls[0][0]).toEqual(2);
  expect(
    fn.mock.calls.map(([error]) => error.aborted).every((field) => field === true),
  ).toEqual(true);
  expect(fn.mock.calls.map(([error]) => error.key)).toEqual([2]);
});

test('Abort: can register multiple abort callbacks', async () => {
  const signal = createEvent<number>();

  const abortFn = jest.fn();

  const fx = abort<number>({
    signal,
    getKey: (p) => p,
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          abortFn(p);
        });

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const $count = createStore(0).on(fx.done, (s) => s + 1);
  const fn = jest.fn();

  fx.failData.watch(fn);

  setTimeout(() => {
    signal(2);
  }, 5);

  fx(1);
  fx(2);
  fx(3);

  await new Promise((r) => setTimeout(r, 10));

  expect($count.getState()).toEqual(2);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(abortFn).toHaveBeenCalledTimes(1);
  expect(abortFn.mock.calls[0][0]).toEqual(2);
});

test('Abort: abort callback can be revoked', async () => {
  const signal = createEvent<number>();

  const abortFn = jest.fn();

  const fx = abort<number>({
    signal,
    getKey: (p) => p,
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        const revoke = onAbort(() => {
          abortFn(p);
        });

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });

        revoke();
      });
    },
  });
  const $count = createStore(0).on(fx.done, (s) => s + 1);
  const fn = jest.fn();

  fx.failData.watch(fn);

  setTimeout(() => {
    signal(2);
  }, 5);

  fx(1);
  fx(2);
  fx(3);

  await new Promise((r) => setTimeout(r, 10));

  expect($count.getState()).toEqual(2);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(abortFn).toHaveBeenCalledTimes(0);
});

test('Abort: cant revoke abort callback from other abort callback', async () => {
  const signal = createEvent<number>();

  const revokeFn = jest.fn();
  const abortFn = jest.fn();

  const fx = abort<number>({
    signal,
    getKey: (p) => p,
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 5);

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let revoke = () => {};

        onAbort(() => {
          // cleanup
          revoke();
          revokeFn();
          rj();
          clearTimeout(id);
        });

        revoke = onAbort(() => {
          abortFn(p);
        });
      });
    },
  });
  const fn = jest.fn();

  fx.failData.watch(fn);

  setTimeout(() => {
    signal(2);
  }, 2);

  fx(2);

  await new Promise((r) => setTimeout(r, 10));

  expect(revokeFn).toHaveBeenCalledTimes(1);
  expect(abortFn).toHaveBeenCalledTimes(1);
  expect(abortFn.mock.calls[0][0]).toEqual(2);
});

test('Abort: cant add abort callback from other abort callback', async () => {
  const signal = createEvent<number>();

  const abortFn = jest.fn();

  const fx = abort<number>({
    signal,
    getKey: (p) => p,
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 5);

        onAbort(() => {
          // cleanup
          onAbort(() => {
            abortFn(p);
          });
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const fn = jest.fn();

  fx.failData.watch(fn);

  setTimeout(() => {
    signal(2);
  }, 2);

  fx(2);

  await new Promise((r) => setTimeout(r, 10));

  expect(abortFn).toHaveBeenCalledTimes(0);
});

test('Abort: take last', async () => {
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: () => 'shared',
    async handler(_: void, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const $count = createStore(0).on(fx.done, (s) => s + 1);
  const fn = jest.fn();

  sample({
    clock: fx,
    greedy: true,
    target: signal.prepend(() => 'shared'),
  });

  fx.failData.watch(fn);

  fx();
  fx();
  fx();

  await new Promise((r) => setTimeout(r, 10));

  expect($count.getState()).toEqual(1);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(
    fn.mock.calls.map(([error]) => error.aborted).every((field) => field === true),
  ).toEqual(true);
  expect(fn.mock.calls.map(([error]) => error.key)).toEqual(
    fn.mock.calls.map(() => 'shared'),
  );
});

test('Abort: race', async () => {
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: () => 'shared',
    async handler(p: number, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, p * 10);

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const $count = createStore(0).on(fx.done, (s) => s + 1);
  const $first = createStore<null | number>(null).on(
    fx.done,
    (_, { params }) => params,
  );
  const fn = jest.fn();

  sample({
    clock: fx.finally,
    greedy: true,
    target: signal.prepend(() => 'shared'),
  });

  fx.failData.watch(fn);

  fx(3);
  fx(2);
  fx(1); // will be first

  await new Promise((r) => setTimeout(r, 50));

  expect($count.getState()).toEqual(1);
  expect($first.getState()).toEqual(1);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(
    fn.mock.calls.map(([error]) => error.aborted).every((field) => field === true),
  ).toEqual(true);
  expect(fn.mock.calls.map(([error]) => error.key)).toEqual(
    fn.mock.calls.map(() => 'shared'),
  );
});
