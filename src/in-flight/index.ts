import { combine, Domain, Effect, Store } from 'effector';

export function inFlight(_: { effects: Array<Effect<any, any, any>> }): Store<number>;
export function inFlight(_: { domain: Domain }): Store<number>;
export function inFlight({
  effects,
  domain,
}: {
  effects?: Array<Effect<any, any, any>>;
  domain?: Domain;
}): Store<number> {
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
