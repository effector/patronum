import { combine, Domain, Effect, is, Store } from 'effector';

export type Strategy = 'some' | 'every';

const strategies = {
  some: <T>(list: T[]) => list.some(Boolean),
  every: <T>(list: T[]) => list.every(Boolean),
};

export function pending(config: {
  effects: Array<Effect<any, any, any>>;
  of?: Strategy;
}): Store<boolean>;
export function pending(config: { domain: Domain; of?: Strategy }): Store<boolean>;
export function pending({
  effects: rawEffects,
  domain,
  of = 'some',
}: {
  effects?: Array<Effect<any, any, any>>;
  of?: Strategy;
  domain?: Domain;
}): Store<boolean> {
  if (!is.domain(domain) && !rawEffects)
    throw new TypeError('domain or effects should be passed');

  if (of !== 'some' && of !== 'every')
    throw new TypeError(
      `strategy parameter "of" can be "every" or "some". Passed: "${of}"`,
    );

  let effects = rawEffects ?? [];
  const strategy = strategies[of];

  if (domain) {
    effects = [];
    domain.onCreateEffect((fx) => effects.push(fx));
  }

  return combine(
    effects.map((fx) => fx.pending),
    strategy,
  );
}
