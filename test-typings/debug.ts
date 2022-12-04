import { expectType } from 'tsd';
import {
  createEvent,
  createDomain,
  createEffect,
  createStore,
  type Node,
  type Scope,
} from 'effector';
import { debug } from '../src/debug';

// Allows each unit of effector
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();
  expectType<void>(debug(event, $store, fx, domain));
}

// Allows single argument
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();

  debug(event);
  debug($store);
  debug(fx);
  debug(domain);
}

// Allows config
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();

  debug({ trace: true }, event, $store, fx, domain);
}

// Does not allow config in wrong position
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();

  // @ts-expect-error
  debug(event, { trace: true }, $store, fx, domain);
}

// Allows shape of units
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();

  debug({ event, $store, fx, domain });
}

// Allows shape of units with config
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();
  debug({ trace: true }, { event, $store, fx, domain });
}

// Allows custom handler
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();

  debug(
    {
      trace: true,
      handler: (context) => {
        expectType<string>(context.name);
        expectType<Node>(context.node);
        expectType<Scope | null>(context.scope);
        expectType<string | null>(context.scopeName);
        expectType<unknown>(context.value);

        if (context.trace) {
          expectType<Array<any>>(context.trace);

          context.trace.forEach((update) => {
            expectType<Node>(update.node);
            expectType<string>(update.name);
            expectType<unknown>(update.value);
          });
        }
      },
    },
    { event, $store, fx, domain },
  );
}
