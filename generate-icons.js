// Icon Generator Script for PWA
// Install dependencies: npm install sharp
// Run: node generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = './logo/logotipo.png';
const outputDir = './public/icons';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating PWA icons...\n');

// Generate icons for each size
async function generateIcons() {
    try {
        for (const size of sizes) {
            const outputFile = path.join(outputDir, `icon-${size}.png`);

            await sharp(inputFile)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(outputFile);

            console.log(`✅ Generated: icon-${size}.png (${size}x${size})`);
        }

        console.log('\n🎉 All icons generated successfully!');
        console.log(`📁 Location: ${outputDir}\n`);

    } catch (error) {
        console.error('❌ Error generating icons:', error);
    }
}

generateIcons();
