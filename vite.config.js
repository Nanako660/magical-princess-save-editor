import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import sharp from 'sharp'

const pkg = require('./package.json')

function webpPlugin() {
  return {
    name: 'vite-plugin-webp',
    enforce: 'pre',
    async load(id) {
      if (/\.(png|jpe?g|gif|webp)$/i.test(id)) {
        const fs = await import('fs')
        if (!fs.existsSync(id)) return null
        const buffer = await sharp(id).resize(128, 128, { fit: 'outside' }).webp({ quality: 80 }).toBuffer()
        return `export default "data:image/webp;base64,${buffer.toString('base64')}"`
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [vue(), webpPlugin(), viteSingleFile()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    cssMinify: true,
    minify: false
  }
})
