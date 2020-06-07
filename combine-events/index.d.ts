import { Event, Tuple, Unit } from 'effector';

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
export function combineEvents<Shape extends Tuple>(
  shape: Shape,
  reset: Unit<any>,
): Event<
  { [K in keyof Shape]: Shape[K] extends Event<infer U> ? U : Shape[K] }
>;
export function combineEvents<Shape>(
  shape: Shape,
  reset: Unit<any>,
): Event<
  { [K in keyof Shape]: Shape[K] extends Event<infer U> ? U : Shape[K] }
>;
