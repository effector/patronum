import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://patronum.effector.dev',
  integrations: [
    starlight({
      title: 'effector patronum ✨',
      description: 'Operators library delivering modularity and convenience.',
      logo: {
        src: './src/assets/comet.png',
      },
      editLink: {
        baseUrl: 'https://github.com/effector/patronum/edit/main/documentation',
      },
      social: {
        github: 'https://github.com/effector/patronum',
        telegram: 'https://t.me/effector_en',
        'x.com': 'https://x.com/effectorjs',
        reddit: 'https://www.reddit.com/r/effectorjs/',
        discord: 'https://discord.gg/yHcMcuRWeC',
        youtube: 'https://youtube.com/@effectorjs',
      },
      sidebar: [
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Reference',
          items: [
            {
              label: 'Operators',
              link: '/operators',
            },
          ],
        },
      ],
    }),
  ],
  experimental: {
    contentLayer: true,
  },
});
