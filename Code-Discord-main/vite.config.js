import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
 plugins: [react(),
   tailwindcss(),
],
resolve: {
    alias: {
      // This tells Vite to intercept the broken y-monaco import 
      // and point it to the standard monaco-editor package.
      'monaco-editor/esm/vs/editor/editor.api.js': 'monaco-editor'
    }
  }
})
