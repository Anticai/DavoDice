/**
 * Script to generate app icons and splash screens from SVG sources
 * 
 * To run: node scripts/generate-assets.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.resolve(__dirname, '../src/assets');
const SVG_DIR = path.resolve(ASSETS_DIR, 'images');
const GENERATED_DIR = path.resolve(ASSETS_DIR, 'generated');

// Ensure generated directory exists
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// App icon sizes for different platforms
const APP_ICON_SIZES = {
  android: [48, 72, 96, 144, 192, 512],
  ios: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024],
};

// Splash screen sizes
const SPLASH_SIZES = {
  android: [
    { width: 320, height: 480 },
    { width: 480, height: 800 },
    { width: 720, height: 1280 },
    { width: 960, height: 1600 },
    { width: 1280, height: 1920 },
  ],
  ios: [
    { width: 640, height: 960 },   // iPhone (retina)
    { width: 750, height: 1334 },  // iPhone 8, SE
    { width: 1125, height: 2436 }, // iPhone X, 11 Pro
    { width: 1242, height: 2688 }, // iPhone 11 Pro Max
    { width: 1536, height: 2048 }, // iPad (landscape-left)
    { width: 2048, height: 1536 }, // iPad (landscape-right)
  ],
};

/**
 * Convert SVG to PNG
 * @param {string} svgPath Path to SVG file
 * @param {string} pngPath Path for output PNG
 * @param {number} width Width in pixels
 * @param {number} height Height in pixels
 */
function convertSvgToPng(svgPath, pngPath, width, height = width) {
  try {
    // You'll need to adjust the exact command based on your environment
    // This example uses Inkscape CLI which is commonly available
    const command = `npx svgexport ${svgPath} ${pngPath} ${width}:${height}`;
    execSync(command);
    console.log(`Generated: ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath} to PNG:`, error.message);
  }
}

/**
 * Generate app icons from SVG
 */
function generateAppIcons() {
  const appIconSvg = path.resolve(SVG_DIR, 'app-icon.svg');
  const adaptiveIconSvg = path.resolve(SVG_DIR, 'adaptive-icon.svg');
  const faviconSvg = path.resolve(SVG_DIR, 'favicon.svg');
  
  // Check if SVG files exist
  if (!fs.existsSync(appIconSvg)) {
    console.error(`App icon SVG not found: ${appIconSvg}`);
    return;
  }
  
  // Generate standard app icons
  APP_ICON_SIZES.android.forEach(size => {
    const outputPath = path.resolve(GENERATED_DIR, `app-icon-android-${size}.png`);
    convertSvgToPng(appIconSvg, outputPath, size);
  });
  
  APP_ICON_SIZES.ios.forEach(size => {
    const outputPath = path.resolve(GENERATED_DIR, `app-icon-ios-${size}.png`);
    convertSvgToPng(appIconSvg, outputPath, size);
  });
  
  // Generate adaptive icon foreground (Android)
  if (fs.existsSync(adaptiveIconSvg)) {
    const adaptiveOutput = path.resolve(ASSETS_DIR, 'images', 'adaptive-icon.png');
    convertSvgToPng(adaptiveIconSvg, adaptiveOutput, 1024);
  }
  
  // Generate favicon for web
  if (fs.existsSync(faviconSvg)) {
    const faviconOutput = path.resolve(ASSETS_DIR, 'images', 'favicon.png');
    convertSvgToPng(faviconSvg, faviconOutput, 64);
  }
}

/**
 * Generate splash screens from SVG
 */
function generateSplashScreens() {
  const splashSvg = path.resolve(SVG_DIR, 'splash.svg');
  
  if (!fs.existsSync(splashSvg)) {
    console.error(`Splash screen SVG not found: ${splashSvg}`);
    return;
  }
  
  // Create splash screen PNG for app.json
  const mainSplash = path.resolve(ASSETS_DIR, 'images', 'splash.png');
  convertSvgToPng(splashSvg, mainSplash, 1242, 2436);
  
  // Create platform-specific splash screens
  SPLASH_SIZES.android.forEach(({ width, height }) => {
    const outputPath = path.resolve(GENERATED_DIR, `splash-android-${width}x${height}.png`);
    convertSvgToPng(splashSvg, outputPath, width, height);
  });
  
  SPLASH_SIZES.ios.forEach(({ width, height }) => {
    const outputPath = path.resolve(GENERATED_DIR, `splash-ios-${width}x${height}.png`);
    convertSvgToPng(splashSvg, outputPath, width, height);
  });
}

// Main execution
console.log('Generating app assets...');
generateAppIcons();
generateSplashScreens();
console.log('Asset generation complete!'); 