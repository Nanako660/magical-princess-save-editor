import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import sharp from 'sharp'
import { resolve } from 'path'

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

function faviconPlugin() {
  return {
    name: 'vite-plugin-favicon',
    enforce: 'post',
    async generateBundle(options, bundle) {
      const fs = await import('fs')
      const iconPath = resolve(__dirname, 'icon.png')
      
      if (!fs.existsSync(iconPath)) {
        this.warn('Icon file not found at icon.png')
        return
      }

      // Generate different sizes for favicon
      const sizes = [
        { size: 16, name: 'favicon-16x16.png', rel: 'icon' },
        { size: 32, name: 'favicon-32x32.png', rel: 'icon' }
      ]
      
      const faviconData = {}
      
      for (const { size, name, rel } of sizes) {
        const buffer = await sharp(iconPath)
          .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .png()
          .toBuffer()
        
        faviconData[name] = {
          data: `data:image/png;base64,${buffer.toString('base64')}`,
          size: size.toString(),
          rel
        }
      }
      
      // Update index.html to include inline favicon
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName === 'index.html' && chunk.type === 'asset') {
          let html = chunk.source.toString()
          
          // Remove existing favicon links
          html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '')
          html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '')
          
          // Add inline favicon links
          let faviconLinks = ''
          for (const [file, info] of Object.entries(faviconData)) {
            if (info.rel === 'icon') {
              faviconLinks += `\n    <link rel="icon" type="image/png" sizes="${info.size}x${info.size}" href="${info.data}">`
            } else if (info.rel === 'apple-touch-icon') {
              faviconLinks += `\n    <link rel="apple-touch-icon" sizes="${info.size}x${info.size}" href="${info.data}">`
            }
          }
          
          html = html.replace('</head>', `${faviconLinks}\n  </head>`)
          chunk.source = html
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), webpPlugin(), viteSingleFile(), faviconPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    cssMinify: true,
    minify: 'esbuild'
  }
})