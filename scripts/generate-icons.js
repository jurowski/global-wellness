const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const sizes = [192, 512];
  const svgBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'icon.svg'));

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(process.cwd(), 'public', `icon-${size}x${size}.png`));
  }

  // Generate Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error); 