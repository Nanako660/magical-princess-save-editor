const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const iconPath = path.resolve(__dirname, '../icon.png')
const publicPath = path.resolve(__dirname, '../public')

async function generateFavicon() {
  try {
    // Generate 32x32 PNG for favicon.ico
    const buffer32 = await sharp(iconPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer()
    
    // Write as favicon.ico (browsers will accept PNG with .ico extension)
    fs.writeFileSync(path.resolve(publicPath, 'favicon.ico'), buffer32)
    
    // Generate 16x16 PNG
    const buffer16 = await sharp(iconPath)
      .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer()
    
    fs.writeFileSync(path.resolve(publicPath, 'favicon-16x16.png'), buffer16)
    
    // Generate 32x32 PNG
    fs.writeFileSync(path.resolve(publicPath, 'favicon-32x32.png'), buffer32)
    
    console.log('Favicon files generated successfully!')
  } catch (error) {
    console.error('Error generating favicon:', error)
  }
}

generateFavicon()