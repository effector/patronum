import { Store, Effect, Domain } from 'effector';

export function pending(config: {
  effects: Array<Effect<any, any, any>>;
}): Store<boolean>;
export function pending(config: { domain: Domain }): Store<boolean>;
