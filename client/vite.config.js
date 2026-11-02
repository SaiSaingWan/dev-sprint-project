import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        student: 'index.html',
        admin: 'admin.html',
      },
    },
  },
})