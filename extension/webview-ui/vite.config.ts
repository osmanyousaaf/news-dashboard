import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../dist/webview'),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/index.js',
        assetFileNames: 'assets/[name][extname]',
        name: 'NewsDashWebview',
      },
    },
  },
  base: './',
});
