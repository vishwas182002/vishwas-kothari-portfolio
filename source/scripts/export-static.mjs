import { build } from 'esbuild';
import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const out = path.resolve(
  process.argv[2] || path.join(root, 'work/github-pages'),
);
await mkdir(out, { recursive: true });
const js = await build({
  stdin: {
    contents:
      "import React from 'react';import {createRoot} from 'react-dom/client';import Portfolio from './app/page.tsx';createRoot(document.getElementById('root')).render(<Portfolio/>);",
    resolveDir: root,
    sourcefile: 'portable-entry.tsx',
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  minify: false,
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: { '@': root },
  plugins: [
    {
      name: 'omit-css-in-js',
      setup(b) {
        b.onLoad({ filter: /\.css$/ }, () => ({
          contents: '',
          loader: 'empty',
        }));
      },
    },
  ],
});
const javascript = js.outputFiles[0].text;
const assets = path.join(root, 'dist/client/_next/static/css');
const cssFiles = (await readdir(assets)).filter((p) => p.endsWith('.css'));
if (!cssFiles.length) throw new Error('Run npm run build before exporting.');
let css = (
  await Promise.all(cssFiles.map((p) => readFile(path.join(assets, p), 'utf8')))
).join('\n');
css = css.replace(/url\((['"]?)\//g, 'url($1');
await writeFile(path.join(out, 'app.js'), javascript);
await writeFile(path.join(out, 'styles.css'), css);
for (const p of [
  'fonts',
  'portrait-directions.png',
  'portrait-directions-light.png',
  'portrait.jpg',
  'favicon.svg',
])
  await cp(path.join(root, 'public', p), path.join(out, p), {
    recursive: true,
  });
const head = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vishwas Kothari: ML Engineer &amp; Researcher</title><meta name="description" content="Vishwas Kothari. MS Computer Science at CU Boulder. Machine learning, model evaluation, document intelligence, trustworthy AI, and scientific data systems."><meta name="theme-color" content="#080808"><link rel="icon" href="favicon.svg"><script>try{const t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}</script>`;
await writeFile(
  path.join(out, 'index.html'),
  head +
    '<link rel="stylesheet" href="styles.css"><script src="app.js" defer></script></head><body><div id="root"></div><noscript>Please enable JavaScript to explore the interactive portfolio. <a href="mailto:vishwasvkothari@gmail.com">Email Vishwas</a>.</noscript></body></html>',
);
await writeFile(path.join(out, '.nojekyll'), '');
await writeFile(
  path.join(out, 'README.txt'),
  `Vishwas Kothari: interactive portfolio rebuild\n\nUpload all files in this folder to the root of your vishwas-kothari-portfolio repository. Keep your existing resume_vk.pdf. Commit to the branch used by GitHub Pages. No build step is needed for this package.\n\nOpen index.html locally to preview it. The original English descriptions are preserved; click a project cover to read the full project.\n\nFeatures: theme-specific directional portraits, Creative mode, handwritten research notes tailored to your work, project-specific questions/experiments/findings, 8 font pairings and 9 individual font families, typography/spacing/motion controls, saved preferences, project shelf, 3D previews, pointer and keyboard rotation, focus restoration, copy email, responsive layout, and reduced-motion support.\n\nPortrait frames are AI-generated adaptations of your original photo. Font licenses are included under fonts/.\n`,
);
// Self-contained HTML uses the same validated bundle, with all font and image URLs embedded.
let embeddedCss = css;
const urls = [
  ...new Set(
    [...css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)]
      .map((m) => m[2])
      .filter((s) => !s.startsWith('data:') && !s.startsWith('http')),
  ),
];
for (const url of urls) {
  const file = path.join(out, url);
  let buffer;
  try {
    buffer = await readFile(file);
  } catch {
    throw new Error('Missing exported asset: ' + url);
  }
  const mime = url.endsWith('.ttf')
    ? 'font/ttf'
    : url.endsWith('.woff2')
      ? 'font/woff2'
      : url.endsWith('.png')
        ? 'image/png'
        : 'application/octet-stream';
  embeddedCss = embeddedCss
    .split(url)
    .join('data:' + mime + ';base64,' + buffer.toString('base64'));
}
const favicon = await readFile(path.join(out, 'favicon.svg'));
const single =
  head.replace(
    'href="favicon.svg"',
    'href="data:image/svg+xml;base64,' + favicon.toString('base64') + '"',
  ) +
  '<style>' +
  embeddedCss +
  '</style></head><body><div id="root"></div><script>' +
  javascript.replace(/<\/script/gi, '<\\/script') +
  '</script></body></html>';
await writeFile(path.join(out, 'standalone.html'), single);
console.log(
  'Exported static portfolio with',
  cssFiles.length,
  'stylesheets and',
  urls.length,
  'embedded assets.',
);
