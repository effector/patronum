import { expectType } from 'tsd';
import { createEvent, Event, Effect } from 'effector';

import { abort, AbortedError } from '../src/abort';

// returns an effect
{
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: () => 'all',
    async handler(p: number) {
      const result = await new Promise<number>((r) => r(p));

      return result;
    },
  });

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
}
{
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: (p: number) => p.toString(),
    async handler(p: number) {
      const result = await new Promise<number>((r) => r(p));

      return result;
    },
  });

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
}

// onAbort type is inferred
{
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    getKey: () => 'all',
    async handler(p: number, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
}
{
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    // sadly TS wont infer getKey param from handler param, only other way around
    getKey: (p: number) => String(p),
    async handler(p, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
}

// signal payload and key type mismatch is detected
{
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    // @ts-expect-error
    getKey: () => 10,
    async handler(p: number, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });
}
{
  const signal = createEvent<string>();
  const fx = abort({
    signal,
    // @ts-expect-error
    getKey: (p: number) => p,
    async handler(p, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });
}
{
  const signal = createEvent<string | number>();
  const fx = abort({
    signal,
    getKey: () => 10,
    async handler(p: number, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
}

// aborted
{
  const signal = createEvent<string | number>();
  const fx = abort({
    signal,
    getKey: () => 10,
    async handler(p: number, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });

  const aborted = fx.failData
    .filterMap((error) => (error instanceof AbortedError ? error : undefined))
    .map((error) => [error.aborted, error.key] as const);

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
  expectType<Event<readonly [true, string | number]>>(aborted);
}
{
  const signal = createEvent<number>();
  const fx = abort({
    signal,
    getKey: () => 10,
    async handler(p: number, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });

  const aborted = fx.failData
    .filterMap((error) => (error instanceof AbortedError ? error : undefined))
    .map((error) => [error.aborted, error.key] as const);

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
  expectType<Event<readonly [true, number]>>(aborted);
}

// aborted error is not overriden by generic types
{
  const signal = createEvent<number>();
  const fx = abort<number, number, Error, Event<number>>({
    signal,
    getKey: () => 10,
    async handler(p: number, { onAbort }) {
      const result = await new Promise<number>((r) => r(p));

      const unabort = onAbort(() => {});

      unabort();

      return result;
    },
  });

  const aborted = fx.failData
    .filterMap((error) => (error instanceof AbortedError ? error : undefined))
    .map((error) => [error.aborted, error.key] as const);

  expectType<Effect<number, Promise<number>, Error | AbortedError>>(fx);
  expectType<Event<readonly [true, number]>>(aborted);
}
