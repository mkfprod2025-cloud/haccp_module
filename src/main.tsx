import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(), 
    react(),
    {
      name: 'add-nojekyll',
      writeBundle() {
        const fs = require('fs');
        const path = require('path');
        fs.writeFileSync(path.resolve(__dirname, 'dist/.nojekyll'), '');
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
