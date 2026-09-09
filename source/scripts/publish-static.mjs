import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const source = fileURLToPath(new URL('..', import.meta.url));
const root = path.dirname(source.replace(/\/$/, ''));
const scratch = path.join(source, 'work');
await mkdir(scratch, { recursive: true });
execFileSync(
  process.execPath,
  [path.join(source, 'scripts/export-static.mjs'), root],
  { stdio: 'inherit' },
);

// Render initial content so index.html is readable and useful before JavaScript loads.
const renderScript = path.join(scratch, 'render-page.cjs');
const bodyFile = path.join(scratch, 'page-body.html');
await build({
  stdin: {
    contents:
      "import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {writeFileSync} from 'node:fs'; import Portfolio from './app/page.tsx'; writeFileSync(process.argv[2], renderToStaticMarkup(<Portfolio/>));",
    resolveDir: source,
    sourcefile: 'render-page.tsx',
    loader: 'tsx',
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: { '@': source },
  plugins: [
    {
      name: 'separate-styles',
      setup(builder) {
        builder.onLoad({ filter: /\.css$/ }, () => ({
          contents: '',
          loader: 'empty',
        }));
      },
    },
  ],
  outfile: renderScript,
});
execFileSync(process.execPath, [renderScript, bodyFile]);
let body = await readFile(bodyFile, 'utf8');
for (const [id, label] of Object.entries({
  top: 'Introduction',
  research: 'Projects and Research',
  experience: 'Experience',
  education: 'Education',
  recognition: 'Recognition',
  skills: 'Skills',
  contact: 'Contact and email',
})) {
  body = body.replace(
    new RegExp(`(<(?:header|section)\\b[^>]*\\bid="${id}"[^>]*>)`),
    `\n<!-- ${label} -->\n$1`,
  );
}
let html = await readFile(path.join(root, 'index.html'), 'utf8');
html = html.replace(
  '<div id="root"></div>',
  `<!-- Generated from source/app/page.tsx. Make lasting edits in source/. -->\n<div id="root">${body}</div>`,
);
html = html.replace(/<script>([\s\S]*?)<\/script>/, (_, script) => {
  body = script;
  return '<script src="theme.js"></script>';
});
await writeFile(path.join(root, 'theme.js'), body);
await writeFile(path.join(root, 'index.html'), html);
const formatConfig = path.join(scratch, 'format.json');
await writeFile(
  formatConfig,
  JSON.stringify({ htmlWhitespaceSensitivity: 'ignore', printWidth: 100 }),
);
execFileSync(
  path.join(source, 'node_modules/.bin/oxfmt'),
  [
    '-c',
    formatConfig,
    ...['index.html', 'styles.css', 'app.js', 'theme.js'].map((name) =>
      path.join(root, name),
    ),
  ],
  { stdio: 'inherit' },
);
// Refresh cached assets whenever their contents change.
html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const name of ['styles.css', 'app.js', 'theme.js']) {
  const contents = await readFile(path.join(root, name));
  const version = createHash('sha256').update(contents).digest('hex').slice(0, 12);
  html = html.replace(`"${name}"`, `"${name}?v=${version}"`);
}
await writeFile(path.join(root, 'index.html'), html);
console.log('Published readable static files to the repository root.');
