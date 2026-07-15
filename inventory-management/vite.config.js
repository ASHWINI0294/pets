import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'

function jsAsJsx() {
  return {
    name: 'vite-js-as-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\/src\/.*\.js$/)) {
        return null
      }

      return transformWithOxc(code, id, { lang: 'jsx' })
    },
    config() {
      return {
        oxc: {
          jsx: { runtime: 'automatic' },
        },
        build: {
          rolldownOptions: {
            moduleTypes: {
              '.js': 'jsx',
            },
          },
        },
        optimizeDeps: {
          rolldownOptions: {
            moduleTypes: {
              '.js': 'jsx',
            },
          },
        },
      }
    },
  }
}

export default defineConfig({
  plugins: [jsAsJsx(), react({ include: /\.(jsx|js)$/ })],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
})
