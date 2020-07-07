import { Event } from 'effector';

type Tuple<T = unknown> = [T] | T[];

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
