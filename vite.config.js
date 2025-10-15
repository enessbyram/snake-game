import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/snake-game/', // GitHub Pages URL’in alt yolu
  plugins: [react()]
})