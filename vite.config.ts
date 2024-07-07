import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    watch: {
      usePolling: true // WSL moment (https://vitejs.dev/config/server-options)
    }
  }
})
