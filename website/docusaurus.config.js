// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'effector patronum',
  tagline: 'Operators library delivering modularity and convenience.',
  url: 'https://patronum.effector.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'effector', // Usually your GitHub org/user name.
  projectName: 'patronum', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../src/',
          routeBasePath: '/methods',
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: true,
          editUrl: 'https://github.com/effector/patronum/tree/main/src/',
        },
        pages: {},
        blog: false,
        theme: {
          customCss: require.resolve('./src/main.css'),
        },
      }),
    ],
  ],

  plugins: [
    async function tailwindPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'effector patronum ✨',
        logo: {
          alt: 'effector patronum',
          src: 'img/comet.png',
        },
        items: [
          {
            to: 'docs/installation',
            position: 'left',
            label: 'Installation',
          },
          {
            type: 'doc',
            docId: 'methods',
            position: 'left',
            label: 'Methods',
          },
          {
            href: 'https://share.effector.dev/YC6TiqYW',
            label: 'Try',
            position: 'left',
          },
          {
            href: 'https://github.com/effector/patronum',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Installation',
                to: '/docs/installation',
              },
              {
                label: 'Migration guide',
                to: '/docs/migration-guide',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/effector_ru',
              },
              {
                label: 'Telegram EN',
                href: 'https://t.me/effector_en',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/effectorjs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Dev.to',
                to: 'https://dev.to/effector',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/effector',
              },
            ],
          },
        ],
        copyright: `Copyright © 2020-${new Date().getFullYear()} Effector Core Team`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'OEOSWK083U',
        apiKey: 'd14c8069434613d33755df5cd29c3ded',
        indexName: 'crawler_Patronum',
        contextualSearch: true,
        searchPagePath: 'search',
      },
    }),
};

module.exports = config;
