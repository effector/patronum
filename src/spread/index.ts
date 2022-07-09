import { createEvent, Event, guard, sample, Unit } from 'effector';

const hasPropBase = {}.hasOwnProperty;
const hasOwnProp = <O extends { [k: string]: unknown }>(object: O, key: string) =>
  hasPropBase.call(object, key);

type NoInfer<T> = [T][T extends any ? 0 : never];
type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function spread<Payload>(config: {
  targets: {
    [Key in keyof Payload]?: Unit<Payload[Key]>;
  };
}): EventAsReturnType<Partial<Payload>>;

export function spread<
  Source,
  Payload extends Source extends Unit<infer S> ? S : never,
>(config: {
  source: Source;
  targets: {
    [Key in keyof Payload]?:
      | EventAsReturnType<Partial<Payload[Key]>>
      | Unit<NoInfer<Payload[Key]>>;
  };
}): Source;

/**
 * @example
 * spread({ source: dataObject, targets: { first: targetA, second: targetB } })
 * forward({
 *   to: spread({targets: { first: targetA, second: targetB } })
 * })
 */
export function spread<P>({
  targets,
  source = createEvent<P>(),
}: {
  targets: {
    [Key in keyof P]?: Unit<P[Key]>;
  };
  source?: Unit<P>;
}): EventAsReturnType<P> {
  for (const targetKey in targets) {
    if (hasOwnProp(targets, targetKey)) {
      const currentTarget = targets[targetKey];

      const hasTargetKey = guard({
        source,
        greedy: true,
        filter: (object): object is any =>
          typeof object === 'object' && object !== null && targetKey in object,
      });

      sample({
        greedy: true,
        clock: hasTargetKey,
        fn: (object: P) => object[targetKey],
        target: currentTarget as Unit<any>,
      });
    }
  }

  return source as any;
}
