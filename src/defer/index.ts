import { Store, Unit, merge, sample } from 'effector';
import { combineEvents } from '../combine-events';
import { not } from '../not';

export interface DeferArgs {
  clock: Unit<any>;
  until: Store<boolean>;
}

export const defer = (args: DeferArgs) => {
  const { clock, until: condition } = args;

  const calledAfterCondition = sample({
    clock: clock,
    filter: condition,
  });

  const calledBeforeCondition = sample({
    clock: clock,
    filter: not(condition),
  });

  return merge([
    calledAfterCondition,
    combineEvents({
      events: [calledBeforeCondition, condition.updates.filter({ fn: Boolean })],
      reset: condition.updates.filter({ fn: (value) => !value }),
    }),
  ]);
};
