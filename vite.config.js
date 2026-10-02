import { defineConfig } from 'vite';
export default defineConfig({
  // Relative assets also work under a GitHub Pages repository subdirectory.
  base: './',
  build: { rollupOptions: { input: { game: 'index.html', catalogue: 'catalogue.html' } } },
  // Polling keeps hot reload reliable on the shared Windows workspace.
  server: { watch: { usePolling: true, interval: 300 } },
});
