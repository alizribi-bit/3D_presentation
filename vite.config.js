import { defineConfig } from 'vite';

// Two pages: the jury window (index.html, the 3D world) and the presenter window (notes only, no WebGL).
export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 5317, strictPort: true },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1200,
    rollupOptions: { input: { index: 'index.html', presenter: 'presenter.html' } },
  },
});
