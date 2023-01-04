import {
  Stack,
  Node,
  Effect,
  Event,
  is,
  Store,
  Unit,
  Domain,
  createNode,
  step,
  Scope,
} from 'effector';

type LogContext = {
  scope: Scope | null;
  scopeName: string | null;
  /** node, kind, value, name - common fields for logs and traces */
  node: Node;
  kind: string;
  value: unknown;
  name: string;
  trace?: {
    node: Node;
    name: string;
    kind: string;
    value: unknown;
  }[];
};

interface Config {
  trace?: boolean;
  handler?: (context: LogContext) => void;
}

const defaultConfig: Config = {
  trace: false,
  handler: console.log,
};

export function debug(
  ...entries:
    | [Unit<any>, ...Unit<any>[]]
    | [Config, ...Unit<any>[]]
    | [Record<string, Unit<any>>]
    | [Config, Record<string, Unit<any>>]
): void {
  const { config, units } = resolveParams(...entries);

  units.forEach((unit) => {
    if (is.store(unit) || is.event(unit) || is.effect(unit)) {
      watchUnit(unit, config);
    } else if (is.domain(unit)) {
      watchDomain(unit, config);
    } else {
      /**
       * Let unknown stuff pass through as noop
       *
       * It's useful for debug of custom entities:
       * debug(myFarfetchedQuery)
       */
    }
  });

  watchScopeRegister((newScope) => {
    debugStores.forEach((store) => watchStoreInitialInScope(store, config, newScope));
  });
}

// Log node
function watchDomain(domain: Domain, config: Config) {
  domain.onCreateStore((store) => watchUnit(store, config));
  domain.onCreateEvent((event) => watchUnit(event, config));
  domain.onCreateEffect((effect) => watchUnit(effect, config));
  domain.onCreateDomain((domain) => watchDomain(domain, config));
}

function watchUnit(
  unit: Store<any> | Event<any> | Effect<any, any, any>,
  config: Config,
) {
  if (is.store(unit)) {
    watchStoreInitial(unit, config);
    watch(unit, config);
  } else if (is.event(unit)) {
    watch(unit, config);
  } else if (is.effect(unit)) {
    watch(unit, config);
    watch(unit.done, config);
    watch(unit.fail, config);
  }
}

function watch(unit: Unit<any>, config: Config) {
  createNode({
    parent: [unit],
    // debug watchers should behave like normal watchers
    meta: { op: 'watch' },
    family: { owners: unit },
    regional: true,
    // node only gets all required data
    node: [
      step.run({
        fn(value: unknown, _internal: unknown, stack: Stack) {
          const scope = stack?.scope ?? null;

          if (scope && !scopes.get(scope)) {
            scopes.save(scope);
          }

          const context: LogContext = {
            scope,
            scopeName: getScopeName(scope),
            node: getNode(unit),
            kind: getType(unit),
            value,
            name: getName(unit),
            trace: config.trace ? collectTrace(stack) : undefined,
          };

          if (!config.handler) {
            throw Error('patronum/debug must have the handler');
          }

          config.handler(context);
        },
      }),
    ],
  });
}

type Trace = NonNullable<LogContext['trace']>;
type TraceEntry = Trace[number];

function collectTrace(stack: Stack): Trace {
  const trace: Trace = [];

  let parent = stack?.parent;

  while (parent) {
    const { node, value } = parent;

    const entry: TraceEntry = {
      node,
      value,
      name: getNodeName(node),
      kind: getType(node),
    };

    trace.push(entry);

    parent = parent.parent;
  }

  return trace;
}

const debugStores: Set<Store<any>> = new Set();

function watchStoreInitial(store: Store<any>, config: Config) {
  if (!config.handler) {
    throw Error('patronum/debug must have the handler');
  }

  debugStores.add(store);

  const node = getNode(store);

  // current state
  const context: LogContext = {
    scope: null,
    scopeName: null,
    node,
    kind: getType(store),
    value: store.getState(),
    name: getName(store),
    trace: config.trace ? [] : undefined,
  };

  config.handler(context);

  // current state in every known scope
  scopes.forEach((scope) => watchStoreInitialInScope(store, config, scope));
}

function watchStoreInitialInScope(store: Store<any>, config: Config, scope: Scope) {
  if (!config.handler) {
    throw Error('patronum/debug must have the handler');
  }

  const node = getNode(store);

  // current state
  const context: LogContext = {
    scope,
    scopeName: getScopeName(scope),
    node,
    kind: getType(store),
    value: scope.getState(store),
    name: getName(store),
    trace: config.trace ? [] : undefined,
  };

  config.handler(context);
}

// Config

function resolveParams(...entry: Parameters<typeof debug>): {
  config: Config;
  units: Unit<any>[];
} {
  let config: Config = defaultConfig;
  const [maybeConfig, ...restUnits] = entry;

  const units = [];

  if (isConfig(maybeConfig)) {
    config = { ...defaultConfig, ...maybeConfig };
  } else if (!is.unit(maybeConfig)) {
    for (const [name, unit] of Object.entries(maybeConfig)) {
      customNames.set(getGraph(unit as any).id, name);
      if (is.store(unit)) debugStores.add(unit);
      units.push(unit);
    }
  } else {
    units.push(maybeConfig);
  }

  for (const maybeUnit of restUnits) {
    if (is.unit(maybeUnit)) {
      if (is.store(maybeUnit)) debugStores.add(maybeUnit);
      units.push(maybeUnit);
    } else {
      for (const [name, unit] of Object.entries(maybeUnit)) {
        customNames.set(getGraph(unit as any).id, name);
        if (is.store(unit)) debugStores.add(unit);
        units.push(unit);
      }
    }
  }

  return { config, units };
}

function isConfig(
  maybeConfig: Unit<any> | Record<string, Unit<any>> | Config,
): maybeConfig is Config {
  if (!is.unit(maybeConfig)) {
    return !Object.values(maybeConfig).every(is.unit);
  }

  return false;
}

// Scopes
const watchers = new Set<(scope: Scope) => void>();
const watchScopeRegister = (cb: (scope: Scope) => void) => {
  watchers.add(cb);

  return () => {
    watchers.delete(cb);
  };
};

function registerScope(scope: Scope, config: { name: string }) {
  scopes.save(scope, { name: config.name });

  watchers.forEach((cb) => cb(scope));

  return () => {
    scopes.delete(scope);
  };
}

function unregisterAllScopes() {
  scopes.clear();
}

interface Meta {
  name: string;
}

const cache = new Map<Scope, Meta>();

let unknownScopes = 0;
function getDefaultName() {
  unknownScopes += 1;
  return `unknown_scope_${unknownScopes}`;
}
const scopes = {
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

debug.registerScope = registerScope;
debug.unregisterAllScopes = unregisterAllScopes;

function getScopeName(scope: Scope | null) {
  if (!scope) return null;

  const meta = scopes.get(scope);

  if (!meta) return null;

  return meta.name;
}

// Utils

function isEffectChild(node: Node | { graphite: Node }) {
  const actualNode = getNode(node);
  const { sid, named } = actualNode.meta;

  return Boolean(
    !sid &&
      (named === 'finally' ||
        named === 'done' ||
        named === 'doneData' ||
        named === 'fail' ||
        named === 'failData' ||
        named === 'inFlight' ||
        named === 'pending'),
  );
}

function getNodeName(node?: Node): string {
  if (!node) return '';

  const { meta, id } = node;

  const customName = customNames.get(id);

  if (customName) {
    return customName;
  }

  if (!isEffectChild(node)) {
    return meta.name;
  }

  const parentEffect = node.family.owners.find((n) => n.meta.op === 'effect');

  if (parentEffect) {
    return `${getNodeName(parentEffect)}.${meta.named}`;
  }

  return meta.named;
}

function getType(unit: Unit<any> | Node) {
  if (is.store(unit)) {
    return 'store';
  }
  if (is.effect(unit)) {
    return 'effect';
  }
  if (is.event(unit)) {
    return 'event';
  }
  if (is.domain(unit)) {
    return 'domain';
  }
  if (is.unit(unit)) {
    return 'unit';
  }

  const node = getNode(unit);

  if (node.meta.op) {
    return node.meta.op;
  }

  return 'unknown';
}

type NodeUnit = { graphite: Node } | Node;
const getGraph = (graph: NodeUnit): Node =>
  (graph as { graphite: Node }).graphite || graph;

const customNames = new Map<Node['id'], string>();

function getName(unit: any): string {
  const custom = customNames.get(getGraph(unit as any).id);
  if (custom) {
    return custom;
  }

  if (unit.compositeName && unit.compositeName.fullName) {
    return unit.compositeName.fullName;
  }
  if (unit.shortName) {
    return unit.shortName;
  }
  if (unit.name) {
    return unit.name;
  }
  return '';
}

function readLoc({
  meta,
}: Node): void | { file?: string; line: number; column: number } {
  const loc = 'config' in meta ? meta.config.loc : meta.loc;

  return loc;
}

function getLoc(unit: Node) {
  const loc = readLoc(unit);

  if (!loc) return null;

  return `${loc.file ?? ''}:${loc.line}:${loc.column}`;
}

function getNode(node: Node | { graphite: Node } | Unit<any>): Node {
  const actualNode = 'graphite' in node ? node.graphite : (node as Node);

  return actualNode;
}
