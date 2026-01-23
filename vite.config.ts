import { defineConfig } from 'vite'
import gas from 'rollup-plugin-google-apps-script'
import { codecovVitePlugin } from '@codecov/vite-plugin'

export default defineConfig({
  plugins: [
    gas({
      manifest: {
        copy: true,
        srcDir: 'src',
      },
    }),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "gmail-to-slack",
      uploadToken: process.env.CODECOV_TOKEN,
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
