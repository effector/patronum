import { expectType } from 'tsd';
import { Event, createEvent } from 'effector';
import { combineEvents } from '../combine-events';

// Check simple combine of different events
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
  }

  const target = combineEvents({
    events: { foo, bar, baz },
  });

  expectType<Event<Target>>(target);

  // @ts-expect-error
  const _fail1: Event<{ foo: string; bar: number }> = target;

  // @ts-expect-error
  const _fail2: Event<{ foo: string; bar: number; baz: number }> = target;
}

// With object
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();
  const bai = createEvent<{ foo: string }>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
    bai: { foo: string };
  }

  const target = combineEvents({
    events: { foo, bar, baz, bai },
  });

  expectType<Event<Target>>(target);

  // @ts-expect-error
  const _fail1: Event<{ foo: string; bar: number }> = target;

  // @ts-expect-error
  const _fail2: Event<{ foo: string; bar: number; baz: number }> = target;

  // @ts-expect-error
  const _fail2: Event<{
    foo: string;
    bar: number;
    baz: number;
    bai: { demo: string };
  }> = target;
}

// Array combiner
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  type Target = [string, number, boolean];

  const target = combineEvents({
    events: [foo, bar, baz],
  });

  expectType<Event<Target>>(target);

  // @ts-expect-error
  const _fail1: Event<[string, number]> = target;

  // @ts-expect-error
  const _fail2: Event<[string, number, number]> = target;
}

// With target event

// Check simple combine of different events
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  const target = createEvent<{
    foo: string;
    bar: number;
    baz: boolean;
  }>();

  combineEvents({
    events: { foo, bar, baz },
    target,
  });

  combineEvents({
    events: { foo, bar, baz },
    target: createEvent<{ foo: string; bar: number }>(),
  });

  // TODO: should throw // @ts-expect-error
  combineEvents({
    events: { foo, bar, baz },
    target: createEvent<{ foo: string; bar: number; baz: number }>(),
  });
}

// With object
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();
  const bai = createEvent<{ foo: string }>();

  const target = createEvent<{
    foo: string;
    bar: number;
    baz: boolean;
    bai: { foo: string };
  }>();

  combineEvents({
    events: { foo, bar, baz, bai },
    target,
  });

  combineEvents({
    events: { foo, bar, baz, bai },
    target: createEvent<{ foo: string; bar: number }>(),
  });

  // TODO: should throw // @ts-expect-error
  combineEvents({
    events: { foo, bar, baz, bai },
    target: createEvent<{ foo: string; bar: number; baz: number }>(),
  });

  // TODO: should throw // @ts-expect-error
  combineEvents({
    events: { foo, bar, baz, bai },
    target: createEvent<{
      foo: string;
      bar: number;
      baz: number;
      bai: { demo: string };
    }>(),
  });
}

// Array combiner
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  const target = createEvent<[string, number, boolean]>();

  combineEvents({
    events: [foo, bar, baz],
    target,
  });

  // TODO: should throw // @ts-expect-error
  combineEvents({
    events: [foo, bar, baz],
    target: createEvent<[string, number, number]>(),
  });

  // TODO: should throw ? // @ts-expect-error
  combineEvents({
    events: [foo, bar, baz],
    target: createEvent<[string]>(),
  });
}
