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

interface Config {
  trace?: boolean;
}

function isConfig(
  maybeConfig: Unit<any> | Record<string, Unit<any>> | Config,
): maybeConfig is Config {
  if (!is.unit(maybeConfig)) {
    return !Object.values(maybeConfig).every(is.unit);
  }

  return false;
}

export function debug(
  ...units:
    | [Unit<any>, ...Unit<any>[]]
    | [Config, ...Unit<any>[]]
    | [Record<string, Unit<any>>]
    | [Config, Record<string, Unit<any>>]
): void {
  let config: Config = { trace: false };
  const [maybeConfig, ...restUnits] = units;

  if (isConfig(maybeConfig)) {
    config = maybeConfig;
  } else if (!is.unit(maybeConfig)) {
    for (const [name, unit] of Object.entries(maybeConfig)) {
      customNames.set(getGraph(unit as any).id, name);
      logUnit(unit, config);
    }
  } else {
    logUnit(maybeConfig);
  }

  for (const maybeUnit of restUnits) {
    if (is.unit(maybeUnit)) {
      logUnit(maybeUnit, config);
    } else {
      for (const [name, unit] of Object.entries(maybeUnit)) {
        customNames.set(getGraph(unit as any).id, name);
        logUnit(unit, config);
      }
    }
  }
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

const debugStores: Store<any>[] = [];

function log(
  unit: Store<any> | Event<any> | Effect<any, any, any>,
  type: string,
  prefix = '',
) {
  const name = prefix + getName(unit);

  if (is.store(unit)) {
    // log initial state
    logUpdate({
      type,
      name,
      value: unit.getState(),
    });
    scopes.forEach((scope, meta) => {
      logUpdate({
        type,
        name,
        scopeName: meta.name,
        value: scope.getState(unit),
      });
    });

    debugStores.push(unit);
  }

  createNode({
    parent: [unit],
    meta: { op: 'watch' },
    family: { owners: unit },
    regional: true,
    node: [
      step.run({
        fn(_data: any, _scope: any, stack: Stack) {
          if (!stack.scope) {
            logUpdate({
              type,
              name,
              value: _data,
            });
          } else {
            if (!scopes.get(stack.scope)) {
              scopes.save(stack.scope);
            }
            const meta = scopes.get(stack.scope);
            logUpdate({
              type,
              name,
              scopeName: meta?.name,
              value: _data,
            });
          }
        },
      }),
    ],
  });
}

function logEffect(unit: Effect<any, any, any>) {
  log(unit.done, 'effect', getName(unit) + '.');
  log(unit.fail, 'effect', getName(unit) + '.');
}

function getNode(node: Node | { graphite: Node }) {
  const actualNode = 'graphite' in node ? node.graphite : node;

  return actualNode;
}

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

function logUnit(unit: Unit<any>, config?: Config) {
  const type = getType(unit);

  if (is.store(unit) || is.effect(unit) || is.event(unit)) {
    log(unit, type);

    if (config?.trace) {
      logTrace(unit);
    }
  }

  if (is.effect(unit)) {
    logEffect(unit);
  }

  if (is.domain(unit)) {
    unit.onCreateEvent((event) => {
      log(event, 'event');
      if (config?.trace) {
        logTrace(event);
      }
    });
    unit.onCreateStore((store) => {
      log(store, 'store');
      if (config?.trace) {
        logTrace(store);
      }
    });
    unit.onCreateEffect(effect => {
      logEffect(effect)
      if (config?.trace) {
        logTrace(effect);
      }
    });
  }
}

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

function logTrace(unit: Unit<any>) {
  const type = getType(unit);
  const name = getName(unit);

  createNode({
    parent: [unit],
    meta: { op: 'watch' },
    family: { owners: unit },
    regional: true,
    node: [
      step.run({
        fn(_data: any, _scope: any, stack: Stack) {
          let parent = stack?.parent;
          const scopeMeta = scopes.get(stack?.scope);
          const scopeName = scopeMeta ? ` (scope: ${scopeMeta.name})` : '';
          const groupName = `[${type}]${scopeName} ${name} trace`;
          // eslint-disable-next-line no-console
          console.groupCollapsed(groupName);
          while (parent) {
            const { node, value } = parent;
            const { meta } = node;
            let opName = meta.op;
            let unitName = getNodeName(node);
            if (!unitName) {
              unitName = getLoc(node) ?? '';
            }
            if (opName === 'on') {
              const parentStore = getNodeName(node.next[0]);
              opName = `${parentStore}.${meta.op}`;
              unitName = `${parentStore}.${meta.op}(${getNodeName(
                parent.parent?.node,
              )})`;
            }

            console.info(`<- [${opName}] ${unitName}`, value);
            parent = parent.parent;
          }
          console.groupEnd();
        },
      }),
    ],
  });
}

function registerScope(scope: Scope, config: { name: string }) {
  scopes.save(scope, { name: config.name });

  debugStores.forEach((store) => {
    logUpdate({
      type: 'store',
      name: getName(store),
      scopeName: config.name,
      value: scope.getState(store),
    });
  });

  return () => {
    scopes.delete(scope);
  };
}

function unregisterAllScopes() {
  scopes.clear();
}

debug.registerScope = registerScope;
debug.unregisterAllScopes = unregisterAllScopes;

function logUpdate({
  type,
  scopeName,
  name,
  value,
}: {
  type: string;
  scopeName?: string;
  name: string;
  value: any;
}) {
  const typeString = `[${type}]`;
  const scopeNameString = scopeName ? ` (scope: ${scopeName})` : '';
  const nameString = ` ${name}`;

  console.info(`${typeString}${scopeNameString}${nameString}`, value);
}

type NodeUnit = { graphite: Node } | Node;
const getGraph = (graph: NodeUnit): Node =>
  (graph as { graphite: Node }).graphite || graph;

/**
 * This is inlined in the index file because "./scope-cache" import
 * does not work correctly with esm imports
 * since in the resulting build scope-cache does not have explicit "js" extension
 *
 * TODO: fix this at the level of build configuration
 */
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
