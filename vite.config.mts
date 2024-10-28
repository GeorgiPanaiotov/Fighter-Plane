import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  root: resolve(__dirname, 'src'),
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'build'),
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },    
});