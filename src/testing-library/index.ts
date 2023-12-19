import { createEvent, sample } from 'effector'
import { $timers, Timers } from '../timers'

export const setupTimers = createEvent<Partial<Timers>>();

sample({
  clock: setupTimers,
  source: $timers,
  fn: (timers, overrides) => ({ ...timers, ...overrides }),
  target: $timers,
});
