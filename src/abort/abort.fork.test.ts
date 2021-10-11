import { createDomain } from 'effector';
import { fork, allSettled, scopeBind } from 'effector/fork';
import { abort, AbortedError } from './index';

test('Abort: if not aborted, works as regular effect', async () => {
  const app = createDomain();
  const signal = app.createEvent<string>();
  const fx = abort({
    domain: app,
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

      return p;
    },
  });
  const $count = app.createStore(0).on(fx.done, (s, { params }) => s + params);
  const fn = jest.fn();

  fx.failData.watch(fn);

  const start = app.createEvent();

  start.watch(() => {
    fx(1);
    fx(2);
    fx(3);
  });

  const scope = fork(app);

  await allSettled(start, { scope });

  expect(scope.getState($count)).toEqual(6);
  expect(fn).toHaveBeenCalledTimes(0);
});

test('Abort: aborts all effects calls with the same key', async () => {
  const app = createDomain();
  const signal = app.createEvent<string>();
  const fx = abort({
    domain: app,
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

      return p;
    },
  });
  const $count = app.createStore(0).on(fx.done, (s, { params }) => s + params);
  const fn = jest.fn();

  fx.failData.watch(fn);

  const start = app.createEvent();

  start.watch(() => {
    const stop = scopeBind(signal);

    setTimeout(() => {
      stop('shared');
    }, 5);

    fx(1);
    fx(2);
    fx(3);
  });

  const scope = fork(app);

  await allSettled(start, { scope });

  expect(scope.getState($count)).toEqual(0);
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

test('Abort: aborts effect calls with specific key', async () => {
  const app = createDomain();
  const signal = app.createEvent<string>();
  const fx = abort({
    domain: app,
    signal,
    getKey: (p: number) => p.toString(),
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });

      return p;
    },
  });
  const $count = app.createStore(0).on(fx.done, (s, { params }) => s + params);
  const fn = jest.fn();

  fx.failData.watch(fn);

  const start = app.createEvent();

  start.watch(() => {
    const stop = scopeBind(signal);

    setTimeout(() => {
      stop('2');
    }, 5);

    fx(1);
    fx(2);
    fx(3);
  });

  const scope = fork(app);

  await allSettled(start, { scope });

  expect(scope.getState($count)).toEqual(4);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn.mock.calls.every(([error]) => error instanceof AbortedError)).toEqual(
    true,
  );
  expect(
    fn.mock.calls.map(([error]) => error.aborted).every((field) => field === true),
  ).toEqual(true);
  expect(fn.mock.calls.map(([error]) => error.key)).toEqual(
    fn.mock.calls.map(() => '2'),
  );
});

test('Abort: abort in one scope does not affect the other', async () => {
  const app = createDomain();
  const signal = app.createEvent<string>();
  const fx = abort({
    domain: app,
    signal,
    getKey: (p: number) => p.toString(),
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          // cleanup
          rj();
          clearTimeout(id);
        });
      });

      return p;
    },
  });
  const $count = app.createStore(0).on(fx.done, (s, { params }) => s + params);

  const start = app.createEvent<boolean>();

  start.watch((abort) => {
    const stop = scopeBind(signal);

    setTimeout(() => {
      if (abort) stop('2');
    }, 5);

    fx(1);
    fx(2);
    fx(3);
  });

  const scopeA = fork(app);
  const scopeB = fork(app);

  allSettled(start, { scope: scopeA, params: false });
  await allSettled(start, { scope: scopeB, params: true });

  expect(scopeB.getState($count)).toEqual(4);
  expect(scopeA.getState($count)).toEqual(6);
});

test('Abort: abort callbacks are called in scope', async () => {
  const app = createDomain();
  const trackAbort = app.createEvent();
  const signal = app.createEvent<string>();
  const fx = abort({
    domain: app,
    signal,
    getKey: (p: number) => p.toString(),
    async handler(p, { onAbort }) {
      await new Promise((r, rj) => {
        const id = setTimeout(r, 10);

        onAbort(() => {
          trackAbort();
          // cleanup
          rj();
          clearTimeout(id);
        });
      });
    },
  });
  const $aborted = app.createStore(false).on(trackAbort, () => true);

  const start = app.createEvent<boolean>();

  start.watch((abort) => {
    const stop = scopeBind(signal);

    setTimeout(() => {
      if (abort) stop('2');
    }, 5);

    fx(1);
    fx(2);
    fx(3);
  });

  const scopeA = fork(app);
  const scopeB = fork(app);

  allSettled(start, { scope: scopeA, params: false });
  await allSettled(start, { scope: scopeB, params: true });

  expect(scopeB.getState($aborted)).toEqual(true);
  expect(scopeA.getState($aborted)).toEqual(false);
});
