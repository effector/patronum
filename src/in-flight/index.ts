import { combine, Domain, Effect, Store } from 'effector';

export function inFlight(effects: Array<Effect<any, any, any>>): Store<number>;
export function inFlight(_: { effects: Array<Effect<any, any, any>> }): Store<number>;
export function inFlight(_: { domain: Domain }): Store<number>;
export function inFlight(
  args:
    | {
        effects?: Array<Effect<any, any, any>>;
        domain?: Domain;
      }
    | Array<Effect<any, any, any>>,
): Store<number> {
  const argsShape = Array.isArray(args) ? { effects: args } : args;
  const { effects, domain } = argsShape;
  if (domain) {
    const $inFlight = domain.createStore(0);

    domain.onCreateEffect((fx) => {
      $inFlight.on(fx, (count) => count + 1).on(fx.finally, (count) => count - 1);
    });

    return $inFlight;
  }

  return combine(
    effects!.map((fx) => fx.inFlight),
    (inFlights) => inFlights.reduce((all, current) => all + current, 0),
    { skipVoid: false },
  );
}
