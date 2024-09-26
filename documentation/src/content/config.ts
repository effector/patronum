import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const operators = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '*/*.md', base: '../src' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string(),
    group: z.enum(['predicate', 'effect', 'timeouts', 'combination', 'debug']),
    badge: z
      .object({
        variant: z
          .enum(['note', 'danger', 'success', 'caution', 'tip', 'default'])
          .default('default'),
        text: z.string(),
      })
      .optional(),
  }),
});

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  operators,
};
