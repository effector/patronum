import { createEvent, createDomain, Effect, Unit, UnitValue, Domain } from 'effector';

class AbortedError<Key = any> extends Error {
  aborted: true = true;
  key: Key;
  constructor(key: Key) {
    super(String(key));
    this.key = key;
  }
}

interface Defer<Key = any, Result = any> {
  key: Key;
  req: Promise<Result>;
  rs: (result: Result) => void;
  rj: (error: any) => void;
}

const createDefer = <Key>({
  aborter,
  key,
}: {
  key: Key;
  aborter: { handlers: (() => void)[] };
}): Defer => {
  const defer: Defer = { key } as Defer<Key>;

  defer.req = new Promise((rs, rj) => {
    defer.rs = rs;
    defer.rj = (error: any) => {
      if (error instanceof AbortedError) {
        aborter.handlers.forEach((f) => f());
      }

      rj(error);
    };
  });

  return defer;
};

const base = createDomain('abort/internal');

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type NoAny<T> = IfAny<T, unknown, T>;

function abort<
  Params,
  Done = any,
  Fail extends Error = Error,
  Signal extends Unit<string | number> = Unit<string | number>,
>(c: {
  domain?: Domain;
  signal: Signal;
  handler(
    params: Params,
    config: { onAbort: (callback: () => void) => () => void },
  ): Promise<Done>;
  getKey(params: Parameters<typeof c['handler']>[0]): UnitValue<typeof c['signal']>;
}): Effect<
  NoAny<Parameters<typeof c['handler']>[0]>,
  NoAny<ReturnType<typeof c['handler']>>,
  Fail | AbortedError<UnitValue<typeof c['signal']>>
> {
  const { domain = base, signal, handler, getKey } = c;
  const runDeferFx = domain.createEffect({
    handler: async (
      def: Defer<UnitValue<Signal>, NoAny<ReturnType<typeof c['handler']>>>,
    ) => {
      const result = await def.req;

      return result;
    },
    sid: 'abort/runner',
  });
  const addDef = createEvent<Defer>({ sid: 'abort/add' });
  const removeDef = createEvent<Defer>({ sid: 'abort' });
  const $defs = domain
    .createStore<Defer[]>([], { serialize: 'ignore', sid: 'abort/$defs' })
    .on(addDef, (defs, def) => [...defs, def])
    .on(removeDef, (defs, def) => defs.filter((d) => d !== def));

  $defs.watch(signal, (defs, key) => {
    defs.forEach((def) => {
      if (def.key === key) def.rj(new AbortedError(key));
    });
  });

  runDeferFx.finally.watch(({ params: def }) => removeDef(def));

  const abortable = domain.createEffect<
    NoAny<Parameters<typeof c['handler']>[0]>,
    Promise<Done>,
    Fail | AbortedError<UnitValue<typeof c['signal']>>
  >({
    sid: 'abort/abortable',
    handler: async (params) => {
      const aborter: { handlers: (() => void)[] } = { handlers: [] };

      const onAbort = (fn: () => void) => {
        aborter.handlers = [...aborter.handlers, fn];

        return () => (aborter.handlers = aborter.handlers.filter((f) => f !== fn));
      };

      const key = getKey(params as any);
      const def = createDefer({ aborter, key });
      addDef(def);

      handler(params as any, { onAbort })
        .then(def.rs)
        .catch((error) => {
          def.rj(error);
        });

      const result = await runDeferFx(def);

      return result;
    },
  });

  return abortable;
}

export { abort, AbortedError };
