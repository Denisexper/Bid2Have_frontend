import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

function src(path: string): string {
  return fileURLToPath(new URL(`./src/${path}`, import.meta.url))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@api': src('api'),
      '@auth': src('auth'),
      '@categories': src('categories'),
      '@chat': src('chat'),
      '@components': src('components'),
      '@follows': src('follows'),
      '@listings': src('listings'),
      '@notifications': src('notifications'),
      '@offers': src('offers'),
      '@pages': src('pages'),
      '@ratings': src('ratings'),
      '@reports': src('reports'),
      '@theme': src('theme'),
      '@users': src('users'),
    },
  },
})
