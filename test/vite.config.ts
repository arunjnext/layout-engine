import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './test',
  resolve: {
    alias: {
      'resume-layout-engine': path.resolve(__dirname, '../lib'),
    },
  },
  build: {
    outDir: '../dist-test',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    open: true,
  },
});

