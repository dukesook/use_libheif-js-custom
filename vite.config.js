import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs', // Set the root to the docs directory
  build: {
    outDir: '../dist', // Output directory for the build (adjust as needed)
  },
});
