import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  // The single-file preview build (VITE_ROUTER=memory) inlines fonts so it has no external files.
  build:
    process.env.VITE_ROUTER === 'memory'
      ? { assetsInlineLimit: 1_000_000, rollupOptions: { output: { inlineDynamicImports: true } } }
      : { assetsInlineLimit: 4096 },
});
