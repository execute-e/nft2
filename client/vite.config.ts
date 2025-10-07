/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore-next-line
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ts-ignore-next-line
      '@': path.resolve(__dirname, './src')
    }
  }
})
