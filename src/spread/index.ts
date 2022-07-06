import { is, createEvent, Event, guard, sample, Unit, Store } from 'effector';

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
    [Key in keyof Payload]?: Unit<NoInfer<Payload[Key]>>;
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
    const currentTarget = targets[targetKey];

    if (currentTarget) {
      const hasTargetKey = guard({
        source,
        filter: (object): object is any =>
          typeof object === 'object' && object !== null && targetKey in object,
      });

      if (is.store(currentTarget)) {
        currentTarget.on(hasTargetKey, (prev, object) => object[targetKey]);
      } else {
        sample({
          clock: hasTargetKey,
          fn: (object: P) => object[targetKey],
          target: currentTarget as Unit<any>,
        });
      }
    }
  }

  return source as any;
}
