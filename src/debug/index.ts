import {
  Stack,
  Node,
  Effect,
  Event,
  is,
  Store,
  Unit,
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

const defaultConfig: Config = {};

export function debug(
  ...entries:
    | [Unit<any>, ...Unit<any>[]]
    | [Config, ...Unit<any>[]]
    | [Record<string, Unit<any>>]
    | [Config, Record<string, Unit<any>>]
): void {
  const { config, units } = resolveParams(...entries);

  // log
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
    config = maybeConfig;
  } else if (!is.unit(maybeConfig)) {
    for (const [name, unit] of Object.entries(maybeConfig)) {
      customNames.set(getGraph(unit as any).id, name);
      if (is.store(unit)) debugStores.push(unit);
      units.push(unit);
    }
  } else {
    units.push(maybeConfig);
  }

  for (const maybeUnit of restUnits) {
    if (is.unit(maybeUnit)) {
      if (is.store(maybeUnit)) debugStores.push(maybeUnit);
      units.push(maybeUnit);
    } else {
      for (const [name, unit] of Object.entries(maybeUnit)) {
        customNames.set(getGraph(unit as any).id, name);
        if (is.store(unit)) debugStores.push(unit);
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

const debugStores: Store<any>[] = [];

function registerScope(scope: Scope, config: { name: string }) {
  scopes.save(scope, { name: config.name });

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

function getType(unit: Unit<any>) {
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

function getNode(node: Node | { graphite: Node }) {
  const actualNode = 'graphite' in node ? node.graphite : node;

  return actualNode;
}
