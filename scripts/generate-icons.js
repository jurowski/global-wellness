const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const sizes = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-touch-icon.png' }
  ];

  const svgBuffer = await fs.readFile(path.join(__dirname, '../public/icon.svg'));

  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '../public', name));
    
    console.log(`Generated ${name}`);
  }
}

generateIcons().catch(console.error); 