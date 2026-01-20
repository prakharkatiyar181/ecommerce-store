import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
          'axios-vendor': ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: false
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
