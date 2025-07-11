import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   
  plugins: [
     tailwindcss(),
    react()],
    server:{
      proxy:{
        '/users':'http://localhost:3000',
      },
      headers:{
        "Cross-Origin-Embedder-Policy": "require-corp",
       "Cross-Origin-Opener-Policy": "same-origin"
      }
    },
});

