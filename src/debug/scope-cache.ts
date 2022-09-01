import type { Scope } from 'effector';

interface Meta {
  name: string;
}

const cache = new Map<Scope, Meta>();

let unknownScopes = 0;
function getDefaultName() {
  unknownScopes += 1;
  return `unknown_scope_${unknownScopes}`;
}
export const scopes = {
  save(scope: Scope, meta?: Meta) {
    if (!scopes.get(scope)) {
      cache.set(scope, meta ?? { name: getDefaultName() });
    }
  },
  get(scope?: Scope): Meta | null {
    if (!scope) return null;
    return cache.get(scope) ?? null;
  },
  delete(scope: Scope) {
    cache.delete(scope);
  },
  forEach(callback: (scope: Scope, meta: Meta) => void) {
    cache.forEach((meta, scope) => callback(scope, meta));
  },
  clear() {
    cache.clear();
  },
} as const;

