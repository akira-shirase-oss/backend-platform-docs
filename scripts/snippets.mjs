#!/usr/bin/env node
// Checks the docs' code blocks, two ways:
//
//   node scripts/snippets.mjs --coverage     every fenced block in src/content/docs carries
//                                            `run=SUITE` or `not-run="reason"` — fails on any
//                                            unmarked block, so no example sits outside a check
//   node scripts/snippets.mjs --repo PATH   runs each suite: its pages' `run=` blocks, in document
//                                            order, in one bash session inside PATH/template
//                                            (the Backend Platform checkout)
//
// A block that cannot run in a docs check (a systemd unit's shape, a million-request load run, a
// command for a droplet that doesn't exist here) marks itself `not-run="why"` — the gap is counted
// and visible, never silent.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DOCS = join(ROOT, 'src/content/docs');
const SUITES = ['quickstart']; // run in this order; each is one bash session

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
	const at = args.indexOf(`--${name}`);
	return at === -1 ? undefined : args[at + 1];
};

// The indent is spaces and tabs only; see colophon-docs' snippets.mjs for the fuller runner.
const FENCE = /^([ \t]*)(`{3,})([\w-]*)([^\n]*)\n([\s\S]*?)\n\1\2[ \t]*$/gm;

function mdxFiles(dir) {
	return readdirSync(dir)
		.flatMap((name) => {
			const path = join(dir, name);
			return statSync(path).isDirectory() ? mdxFiles(path) : path.endsWith('.mdx') ? [path] : [];
		})
		.sort();
}

const pages = mdxFiles(DOCS);
const blocks = []; // { page, lang, info, body, suite?, notRun? }
for (const page of pages) {
	for (const [, , , lang, info, body] of readFileSync(page, 'utf8').matchAll(FENCE)) {
		blocks.push({
			page: page.slice(DOCS.length + 1),
			lang,
			info: info.trim(),
			body,
			suite: info.match(/(?:^|\s)run=([a-z0-9-]+)/)?.[1],
			notRun: info.match(/not-run="([^"]+)"/)?.[1],
		});
	}
}

// ------------------------------------------------------------------ coverage

const unmarked = blocks.filter((b) => !b.suite && !b.notRun);
const unknown = blocks.filter((b) => b.suite && !SUITES.includes(b.suite));
if (flag('coverage') || unmarked.length > 0 || unknown.length > 0) {
	const counts = SUITES.map((s) => `${s}: ${blocks.filter((b) => b.suite === s).length}`).join(', ');
	const skipped = blocks.filter((b) => b.notRun).length;
	console.log(`snippets coverage: ${blocks.length} blocks (${counts}; ${skipped} not-run)`);
	for (const b of blocks.filter((b) => b.notRun)) console.log(`  not-run ${b.page}: ${b.notRun}`);
	for (const b of unmarked) console.error(`  UNMARKED ${b.page}: \`\`\`${b.lang}${b.info ? ' ' + b.info : ''}`);
	for (const b of unknown) console.error(`  UNKNOWN SUITE ${b.suite} in ${b.page}`);
	if (flag('coverage')) process.exit(unmarked.length || unknown.length ? 1 : 0);
}
if (unmarked.length || unknown.length) process.exit(1);

// ------------------------------------------------------------------ running

const repo = option('repo');
if (!repo) {
	console.log('snippets: coverage only; pass --repo PATH to run the suites');
	process.exit(0);
}
const workdir = join(resolve(repo), 'template');
if (!existsSync(join(workdir, 'scripts/dev.sh'))) {
	console.error(`snippets: ${workdir} is not the Backend Platform checkout's template/`);
	process.exit(1);
}

let failed = 0;
for (const suite of SUITES) {
	const mine = blocks.filter((b) => b.suite === suite);
	if (mine.length === 0) continue;
	const script = mkdtempSync(join(tmpdir(), 'bp-docs-')) + `/${suite}.sh`;
	writeFileSync(script, `set -euo pipefail\n${mine.map((b) => `\n# ${b.page}\n${b.body}`).join('\n')}\n`);
	const run = spawnSync('bash', [script], { cwd: workdir, stdio: 'inherit' });
	if (run.status === 0) console.log(`snippets: ${suite} — ${mine.length} blocks ran`);
	else {
		console.error(`snippets: ${suite} FAILED (exit ${run.status})`);
		failed += 1;
	}
}
process.exit(failed ? 1 : 0);
