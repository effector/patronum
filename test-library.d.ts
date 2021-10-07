export function argumentHistory(ƒ: any): any;
export function argumentsHistory(ƒ: any): any;
export function time(): {
  diff: () => number;
};
export function toBeCloseWithThreshold(
  received: any,
  expected: any,
  threshold: any,
): {
  pass: boolean;
  message: () => string;
};
export function wait(ms: any): Promise<any>;
export function waitFor(unit: any): Promise<any>;
