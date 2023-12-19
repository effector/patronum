import { setupTimers } from '../dist/testing-library';

// Should not receive setTimeout which returns not number or NodeJS.Timeout
{
  // @ts-expect-error
  setupTimers({ setTimeout: () => '' });

  // @ts-expect-error
  setupTimers({ setTimeout: () => [] });

  // @ts-expect-error
  setupTimers({ setTimeout: () => {} });

  // @ts-expect-error
  setupTimers({ setTimeout: () => ({}) });

  // @ts-expect-error
  setupTimers({ setTimeout: () => true });
}

// Should not receive now which returns not number
{
  // @ts-expect-error
  setupTimers({ now: () => '' });

  // @ts-expect-error
  setupTimers({ now: () => [] });

  // @ts-expect-error
  setupTimers({ now: () => {} });

  // @ts-expect-error
  setupTimers({ now: () => ({}) });

  // @ts-expect-error
  setupTimers({ now: () => true });
}
