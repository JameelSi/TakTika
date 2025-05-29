import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {DiscordProxy} from '@robojs/patch'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [DiscordProxy.Vite(), react()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/.proxy': {
        target: 'http://localhost:3030',
        ws: true,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/\.proxy/, ''),
      },
      '/socket.io': {
        target: 'http://localhost:3030',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Enable Discord SDK integration
  resolve: {
    alias: {
      '@discord': '@discord'
    }
  }
})