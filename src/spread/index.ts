import { createEvent, EventCallable, sample, Unit, UnitTargetable } from 'effector';

const hasPropBase = {}.hasOwnProperty;
const hasOwnProp = <O extends { [k: string]: unknown }>(object: O, key: string) =>
  hasPropBase.call(object, key);

type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * @example
 * spread({
 *   source: dataObject,
 *   targets: { first: targetA, second: [target1, target2] },
 * })
 *
 * sample({
 *   source: dataObject,
 *   target: spread({ targets: { first: targetA, second: [target1, target2] } })
 * })
 *
 * sample({
 *   source: dataObject,
 *   target: spread({ first: targetA, second: [target1, target2] })
 * })
 */

export function spread<Payload>(config: {
  targets: {
    [Key in keyof Payload]?:
      | UnitTargetable<Payload[Key]>
      | Array<UnitTargetable<Payload[Key]>>;
  };
}): EventCallable<Partial<Payload>>;

export function spread<
  Source,
  Payload extends Source extends Unit<infer S> ? S : never,
>(config: {
  source: Source;
  targets: {
    [Key in keyof Payload]?:
      | EventCallable<Partial<Payload[Key]>>
      | Array<EventCallable<Partial<Payload[Key]>>>
      | UnitTargetable<NoInfer<Payload[Key]>>
      | Array<UnitTargetable<NoInfer<Payload[Key]>>>;
  };
}): Source;

export function spread<Payload>(targets: {
  [Key in keyof Payload]?:
    | UnitTargetable<Payload[Key]>
    | Array<UnitTargetable<Payload[Key]>>;
}): EventCallable<Partial<Payload>>;

export function spread<P>(
  args:
    | {
        targets: {
          [Key in keyof P]?: Unit<P[Key]> | Array<Unit<P[Key]>>;
        };
        source?: Unit<P>;
      }
    | {
        [Key in keyof P]?: Unit<P[Key]> | Array<Unit<P[Key]>>;
      },
): EventCallable<P> {
  const argsShape = isTargets(args) ? { targets: args } : args;
  const { targets, source = createEvent<P>() } = argsShape;
  for (const targetKey in targets) {
    if (hasOwnProp(targets, targetKey)) {
      const currentTarget = targets[targetKey];

      sample({
        source,
        filter: (object): object is any => {
          return typeof object === 'object' && object !== null && targetKey in object;
        },
        fn: (object: P) => object[targetKey],
        target: currentTarget as UnitTargetable<any>,
        batch: false,
      });
    }
  }

  return source as any;
}

function isTargets<P>(
  args:
    | {
        targets: {
          [Key in keyof P]?: Unit<P[Key]> | Array<Unit<P[Key]>>;
        };
        source?: Unit<P>;
      }
    | {
        [Key in keyof P]?: Unit<P[Key]> | Array<Unit<P[Key]>>;
      },
): args is {
  [Key in keyof P]?: Unit<P[Key]> | Array<Unit<P[Key]>>;
} {
  return !Object.keys(args).some((key) => ['targets', 'source'].includes(key));
}
