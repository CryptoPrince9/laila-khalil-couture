import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    host: true,
    open: true
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
