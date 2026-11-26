import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Repository name with leading and trailing slashes. Change if the GitHub repo name differs.
  base: '/bookstore/',
  plugins: [react()],
})
