import { Domain, Effect, Event, is, Store, Unit } from 'effector';

export function debug(...units: Unit<any>[]): void {
  for (const unit of units) {
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

function getName(unit: any) {
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
