import { Store } from 'effector';

export function format<A>(
  string: TemplateStringsArray,
  a: Store<A>,
): Store<string>;
export function format<A, B>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
): Store<string>;
export function format<A, B, C>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
): Store<string>;
export function format<A, B, C, D>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
): Store<string>;
export function format<A, B, C, D, E>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
  e: Store<E>,
): Store<string>;
export function format<A, B, C, D, E, F>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
  e: Store<E>,
  f: Store<F>,
): Store<string>;
export function format<A, B, C, D, E, F, G>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
  e: Store<E>,
  f: Store<F>,
  g: Store<G>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
  e: Store<E>,
  f: Store<F>,
  g: Store<G>,
  h: Store<H>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H, I>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
  e: Store<E>,
  f: Store<F>,
  g: Store<G>,
  h: Store<H>,
  i: Store<I>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H, I, J>(
  string: TemplateStringsArray,
  a: Store<A>,
  b: Store<B>,
  c: Store<C>,
  d: Store<D>,
  e: Store<E>,
  f: Store<F>,
  g: Store<G>,
  h: Store<H>,
  i: Store<I>,
  j: Store<J>,
): Store<string>;
