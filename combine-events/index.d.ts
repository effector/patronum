import { Event, Tuple } from 'effector';

export function combineEvents<Shape extends Tuple>(
  shape: Shape,
): Event<
  { [K in keyof Shape]: Shape[K] extends Event<infer U> ? U : Shape[K] }
>;
export function combineEvents<Shape>(
  shape: Shape,
): Event<
  { [K in keyof Shape]: Shape[K] extends Event<infer U> ? U : Shape[K] }
>;
