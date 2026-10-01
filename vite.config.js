import { defineConfig } from 'vite';
export default defineConfig({
  // Relative assets also work under a GitHub Pages repository subdirectory.
  base: './',
  // Polling keeps hot reload reliable on the shared Windows workspace.
  server: { watch: { usePolling: true, interval: 300 } },
});
