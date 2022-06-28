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
} from 'effector';

export function debug(
  ...units:
    | Unit<any>[]
    | [
        {
          trace: boolean;
        },
        ...Unit<any>[]
      ]
): void {
  let config: { trace: boolean } = { trace: false };
  const [maybeConfig, ...restUnits] = units;

  if (!is.unit(maybeConfig)) {
    config = maybeConfig;
  } else {
    logUnit(maybeConfig);

    if (config.trace) {
      logTrace(maybeConfig);
    }
  }

  for (const unit of restUnits) {
    if (is.unit(unit)) {
      logUnit(unit);

      if (config.trace) {
        logTrace(unit);
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

function log(
  unit: Store<any> | Event<any> | Effect<any, any, any>,
  type: string,
  prefix = '',
) {
  const name = prefix + getName(unit);

  unit.watch((payload) => {
    console.info(`[${type}] ${name}`, payload);
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

function getName(unit: any): string {
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

function logUnit(unit: Unit<any>) {
  const type = getType(unit);

  if (is.store(unit) || is.effect(unit) || is.event(unit)) {
    log(unit, type);
  }

  if (is.effect(unit)) {
    logEffect(unit);
  }

  if (is.domain(unit)) {
    unit.onCreateEvent((event) => log(event, 'event'));
    unit.onCreateStore((store) => log(store, 'store'));
    unit.onCreateEffect(logEffect);
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

function getNodeName(node?: Node) {
  if (!node) return '';

  const { meta } = node;

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
          const groupName = `[${type}] ${name} trace`;
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
              const parentStore = getNodeName(node?.next?.[0]);
              opName = `${parentStore}.${meta.op}`;
              unitName = `${parentStore}.${meta.op}(${getNodeName(
                parent?.parent?.node,
              )})`;
            }

            console.info(`<- [${opName}] ${unitName}`, value);
            parent = parent?.parent;
          }
          console.groupEnd();
        },
      }),
    ],
  });
}
