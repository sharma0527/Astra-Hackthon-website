import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/register': {
        target: 'https://script.google.com/macros/s/AKfycbzppQJykXlE2bViMdEbzUn8PZ0yx6tDUtbfIiVBMnRriwWVbLW2lrytJhyoiWxAezpG/exec',
        changeOrigin: true,
        followRedirects: true,
        rewrite: () => ''
      }
    }
  }
})
