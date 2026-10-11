import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import talwindCss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), talwindCss()],
})
