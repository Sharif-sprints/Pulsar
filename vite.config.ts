import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: "./", // Ensures relative paths for assets
  build: {
    outDir: "dist", // Vercel serves from 'dist'
  },
});
