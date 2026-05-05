import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

const getHtmlEntries = () => {
  const pagesDir = path.resolve(__dirname, '');
  const entries = {};
  const files = fs.readdirSync(pagesDir);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  htmlFiles.forEach((file) => {
    const name = path.basename(file, '.html');
    entries[name] = path.resolve(pagesDir, file);
  });
  return entries;
};

const jsToBottomNoModule = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html) {
      html = html.replace(`type="module" crossorigin`, '');
      let scriptTag = html.match(/<script[^>]*>(.*?)<\/script[^>]*>/)?.[0];
      if (!scriptTag) return html;
      html = html.replace(scriptTag, '');
      html = html.replace('<!-- SCRIPT -->', scriptTag);
      return html;
    },
  };
};

const cssCrossOriginRemove = () => {
  return {
    name: 'css-cross-origin-remove',
    transformIndexHtml(html) {
      return html.replace(
        /(<link[^>]*rel=["']stylesheet["'][^>]*?)\s+crossorigin(?:=["'][^"']*["'])?/g,
        '$1'
      );
    },
  };
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    injectHTML({ tagName: 'Component' }),
    jsToBottomNoModule(),
    cssCrossOriginRemove(),
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        entryFileNames: 'assets/main.js',
        assetFileNames: (assetInfo) => `assets/${assetInfo.name || '[name].[ext]'}`,
      },
    },
    minify: false,
    modulePreload: false,
    cssMinify: false,
    assetsDir: 'assets',
  },
  server: { open: true },
  base: './',
});
