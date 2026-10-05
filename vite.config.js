import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'HidekoCodeBlock',
      fileName: (format) => `hideko-code-block.${format === 'es' ? 'js' : 'umd.js'}`,
      formats: ['es', 'umd']
    },
    emptyOutDir: false,
    rollupOptions: {
      external: (id) => id.includes('file-converter') || id.endsWith('.js') && id.includes('/node/') || ['fs', 'path', 'url', 'perf_hooks'].includes(id),
      output: {
        exports: 'named',
        banner: `/**\n * hideko-code-block\n * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>\n * @license MIT License\n */`
      }
    }
  },
  server: {
    port: 3005,
    open: '/demo/index.html'
  }
});
