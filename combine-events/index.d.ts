import { Event, Tuple } from 'effector';

export function combineEvents<Shape extends Tuple>(_: {
  events: Shape;
}): Event<
  { [Key in keyof Shape]: Shape[Key] extends Event<infer U> ? U : Shape[Key] }
>;
export function combineEvents<Shape>(_: {
  events: Shape;
}): Event<
  { [Key in keyof Shape]: Shape[Key] extends Event<infer U> ? U : Shape[Key] }
>;
