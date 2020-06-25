import { expectType, expectError } from 'tsd';
import { Event, createStore } from 'effector';
import { delay } from '../delay';

// Check invalid type for source
{
  expectType<Event<string>>(delay({ source: createStore(''), timeout: 100 }));
  expectType<Event<number>>(delay({ source: createStore(0), timeout: 100 }));

  expectError<Event<number>>(delay({ source: createStore(''), timeout: 100 }));
}

// Check timeout type for number
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: 100 }));

  expectError(delay({ source, timeout: true }));
  expectError(delay({ source, timeout: null }));
  expectError(delay({ source, timeout: '' }));
  expectError(delay({ source, timeout: Symbol() }));
  expectError(delay({ source, timeout: undefined }));
}

// Check timeout type for function
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: () => 0 }));

  expectError(delay({ source, timeout: () => true }));
  expectError(delay({ source, timeout: () => null }));
  expectError(delay({ source, timeout: () => '' }));
  expectError(delay({ source, timeout: () => Symbol() }));
  expectError(delay({ source, timeout: () => undefined }));
}

// Check timeout type for function argument
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: (p: string) => 0 }));

  expectError(delay({ source, timeout: (p: number) => 0 }));
  expectError(delay({ source, timeout: (p: null) => 0 }));
  expectError(delay({ source, timeout: (p: undefined) => 0 }));
  expectError(delay({ source, timeout: (p: symbol) => 0 }));
  expectError(delay({ source, timeout: (p: object) => 0 }));
  expectError(delay({ source, timeout: (p: Function) => 0 }));
}

// Check timeout type for store
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: createStore(0) }));

  expectError(delay({ source, timeout: createStore(true) }));
  expectError(delay({ source, timeout: createStore(null) }));
  expectError(delay({ source, timeout: createStore('') }));
  expectError(delay({ source, timeout: createStore(Symbol()) }));
  expectError(delay({ source, timeout: createStore(undefined) }));
}
