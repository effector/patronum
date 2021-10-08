import { createEffect } from 'effector';
import { pending } from '@effector/patronum/macro';

const fx = createEffect(() => {});

export const $pending = pending({ effects: [fx] });
