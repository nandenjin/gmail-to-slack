import { defineConfig } from 'vite'
import gas from 'rollup-plugin-google-apps-script'

export default defineConfig({
  plugins: [
    gas({
      manifest: {
        copy: true,
        srcDir: 'src',
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        dir: 'dist',
        entryFileNames: 'code.js',
        format: 'iife',
      },
    },
    minify: false,
  },
})
