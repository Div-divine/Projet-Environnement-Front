import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Specify the output directory
    assetsDir: 'src/assets', // Specify the directory for static assets
    assetsInclude: ['**/*.json', '**/*.svg', '**/*.jpg', '**/*.png', '**/*.css', '**/*.js'], // Include specific file types
    rollupOptions: {
      // Additional Rollup options
    },
  },
});