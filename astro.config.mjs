// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// The one place the public address lives: canonical URLs and the changelog feed derive from it.
const site = 'https://backend-platform-docs.pages.dev';
const repo = 'https://github.com/akira-shirase-oss/backend-platform-docs';

export default defineConfig({
	site,
	trailingSlash: 'always',
	output: 'static',
	integrations: [
		starlight({
			title: 'Backend Platform Docs',
			description:
				'Documentation for the Backend Platform: the copy-and-own starter template a product runs on its own droplet, the parked control plane’s design and evidence, self-hosting and operations.',
			logo: { src: './src/assets/mark.svg', alt: 'Backend Platform' },
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'Backend Platform on GitHub', href: 'https://github.com/akira-shirase-oss/backend-platform' },
			],
			editLink: { baseUrl: `${repo}/edit/main/` },
			lastUpdated: true,
			pagination: true,
			credits: false,
			titleDelimiter: '·',
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
			customCss: ['./src/styles/theme.css'],
			head: [
				{ tag: 'link', attrs: { rel: 'alternate', type: 'application/rss+xml', title: 'Backend Platform changelog', href: `${site}/changelog/rss.xml` } },
			],
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'Introduction', slug: 'index' },
						{ label: 'Quick start', slug: 'quick-start' },
						{ label: 'Concepts', slug: 'concepts' },
					],
				},
				{
					label: 'Starter template',
					items: [
						{ label: 'What it is', slug: 'template' },
						{ label: 'Copying and owning', slug: 'template/copying' },
						{ label: 'Accounts kit API', slug: 'template/accounts' },
						{ label: 'Configuration', slug: 'template/configuration' },
						{ label: 'Operating a copy', slug: 'template/operations' },
						{ label: 'The evidence kit', slug: 'template/evidence' },
					],
				},
				{
					label: 'Control plane (planned)',
					collapsed: true,
					items: [
						{ label: 'Status and design', slug: 'control-plane' },
						{ label: 'Control API', slug: 'control-plane/api' },
						{ label: 'Drills and evidence', slug: 'control-plane/drills' },
						{ label: 'Threat model', slug: 'control-plane/threat-model' },
					],
				},
				{
					label: 'Self-hosting',
					items: [{ label: 'The development stack', slug: 'self-hosting/dev-stack' }],
				},
				{ label: 'Changelog', link: '/changelog/' },
			],
			plugins: [starlightLinksValidator({ errorOnLocalLinks: true, exclude: ['/changelog/', '/changelog/**'] })],
		}),
	],
});
