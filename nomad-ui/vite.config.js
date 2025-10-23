// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NomadUI',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'nomad-ui.esm.js';
        if (format === 'umd') return 'nomad-ui.js';
        return `nomad-ui.${format}.js`;
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    target: 'es2020',
    minify: 'terser'
  }
});