/* eslint-disable prettier/prettier */
import { Unit, Event } from 'effector';

type Tuple<T = unknown> = [T] | T[];
type Shape = { [key: string]: Event<any> } | Tuple<Event<any>>;

export function combineEvents<Events extends Shape, Target>(_: {
  events: Events;
  reset?: Unit<any>;
  target?: Target;
}): Target extends Unit<infer T>
  ? Target
  : Event<
      {
        [K in keyof Events]: Events[K] extends Event<infer U> ? U : never;
      }
    >;
