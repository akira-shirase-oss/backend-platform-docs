#!/usr/bin/env node
// What the built site must hold before it may deploy: the pages, the search index, the
// changelog and its feed, the sitemap — and no private names, paths, hosts or internal
// decision numbers anywhere in the output.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { homedir, hostname, userInfo } from 'node:os';

const dist = new URL('../dist/', import.meta.url).pathname;
const problems = [];
const need = (path, why) => {
	if (!existsSync(join(dist, path))) problems.push(`missing ${path}: ${why}`);
};

need('index.html', 'the home page');
need('quick-start/index.html', 'the quick start');
need('changelog/index.html', 'the changelog');
need('changelog/rss.xml', 'the changelog feed');
need('pagefind/pagefind.js', 'the search index');
need('sitemap-index.xml', 'the sitemap');
need('_headers', 'the security headers');

function files(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? files(path) : [path];
	});
}
const all = files(dist);
const pages = all.filter((file) => file.endsWith('.html'));
const text = all.filter((file) => /\.(html|md|txt|xml|json|js)$/.test(file));

// Public output never names the machine it was built on, its user or a home directory, an
// internal decision number, or the private planning workspace. The names come from the
// machine running the build, so this file names nobody.
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const local = [homedir(), ...(process.env.CI ? [] : [userInfo().username, hostname().split('.')[0]])].filter((name) => name && name.length >= 4);
const forbidden = [/\/Users\/[a-z]/i, /\/home\/[a-z]/, /\bD-\d{3}\b/, /\.coord\b/, /planning-and-updates/i, ...local.map((name) => new RegExp(escape(name), 'i'))];
for (const file of text) {
	const body = readFileSync(file, 'utf8');
	for (const pattern of forbidden) {
		if (pattern.test(body)) problems.push(`${relative(dist, file)} contains ${pattern}`);
	}
}

// The site contacts no third-party host: every absolute URL in the built pages is this
// site, the project's public repositories, an example domain, localhost (labelled local
// pages), or a standard namespace.
const allowedHosts = new Set([
	'backend-platform-docs.pages.dev',
	'github.com',
	'example.com',
	'www.example.com',
	'app.example.com',
	'platform.example.com',
	'localhost',
	'127.0.0.1',
	'www.w3.org',
	'schema.org',
	'validator.w3.org',
	// XML namespace identifiers in the RSS feed and sitemap: identifiers, not hosts the site contacts.
	'purl.org',
	'www.sitemaps.org',
	'www.google.com',
]);
const hosts = new Map();
for (const file of text.filter((file) => file.endsWith('.html') || file.endsWith('.xml') || file.endsWith('.txt'))) {
	const body = readFileSync(file, 'utf8');
	for (const match of body.matchAll(/https?:\/\/([a-z0-9.-]+)(?::\d+)?[/"'\\s)]/gi)) {
		const host = match[1].toLowerCase();
		if (!allowedHosts.has(host) && !host.endsWith('.example.com')) {
			hosts.set(host, [...(hosts.get(host) ?? []), relative(dist, file)]);
		}
	}
}
for (const [host, where] of hosts) {
	problems.push(`third-party host ${host} referenced by ${[...new Set(where)].slice(0, 3).join(', ')}`);
}

// The search index covers the pages.
const entry = join(dist, 'pagefind/pagefind-entry.json');
const indexed = existsSync(entry)
	? Object.values(JSON.parse(readFileSync(entry, 'utf8')).languages ?? {}).reduce((sum, language) => sum + (language.page_count ?? 0), 0)
	: 0;
if (indexed < 8) problems.push(`the search index holds ${indexed} pages; expected at least 8`);

if (problems.length > 0) {
	console.error(`check-dist: ${problems.length} problem(s)\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
	process.exit(1);
}
console.log(`check-dist: ${pages.length} HTML pages, ${indexed} in the search index; feed, sitemap and headers present; no private names, no third-party hosts`);
