/**
 * Script to copy SVG files to Android drawable directory
 * 
 * To run: node scripts/copy-svg-to-android.js
 */

const fs = require('fs');
const path = require('path');

const SVG_DIR = path.resolve(__dirname, '../src/assets/images');
const ANDROID_DRAWABLE_DIR = path.resolve(__dirname, '../android/app/src/main/res/drawable');

// Ensure drawable directory exists
if (!fs.existsSync(ANDROID_DRAWABLE_DIR)) {
  fs.mkdirSync(ANDROID_DRAWABLE_DIR, { recursive: true });
}

// Copy app-icon.svg to Android drawable directory
const appIconSvg = path.resolve(SVG_DIR, 'app-icon.svg');
const appIconDest = path.resolve(ANDROID_DRAWABLE_DIR, 'app_icon.xml');

// Read the SVG content
const svgContent = fs.readFileSync(appIconSvg, 'utf8');

// Convert SVG to Android vector drawable XML
const vectorDrawable = svgContent
  .replace(/<\?xml.*?\?>/, '') // Remove XML declaration
  .replace(/<svg/, '<vector xmlns:android="http://schemas.android.com/apk/res/android"') // Replace svg tag with vector
  .replace(/width="(.*?)"/, 'android:width="24dp"') // Set width
  .replace(/height="(.*?)"/, 'android:height="24dp"') // Set height
  .replace(/viewBox="(.*?)"/, 'android:viewportWidth="$1" android:viewportHeight="$1"') // Set viewBox
  .replace(/<path/g, '<path android:fillColor="@android:color/white"') // Set path color
  .replace(/<\/svg>/, '</vector>'); // Replace closing tag

// Write the vector drawable to the destination
fs.writeFileSync(appIconDest, '<?xml version="1.0" encoding="utf-8"?>\n' + vectorDrawable);

console.log(`Copied and converted ${appIconSvg} to ${appIconDest}`);

// Copy splash.svg to Android drawable directory
const splashSvg = path.resolve(SVG_DIR, 'splash.svg');
const splashDest = path.resolve(ANDROID_DRAWABLE_DIR, 'splash.xml');

if (fs.existsSync(splashSvg)) {
  // Read the SVG content
  const splashContent = fs.readFileSync(splashSvg, 'utf8');

  // Convert SVG to Android vector drawable XML
  const splashDrawable = splashContent
    .replace(/<\?xml.*?\?>/, '') // Remove XML declaration
    .replace(/<svg/, '<vector xmlns:android="http://schemas.android.com/apk/res/android"') // Replace svg tag with vector
    .replace(/width="(.*?)"/, 'android:width="24dp"') // Set width
    .replace(/height="(.*?)"/, 'android:height="24dp"') // Set height
    .replace(/viewBox="(.*?)"/, 'android:viewportWidth="$1" android:viewportHeight="$1"') // Set viewBox
    .replace(/<path/g, '<path android:fillColor="@android:color/white"') // Set path color
    .replace(/<\/svg>/, '</vector>'); // Replace closing tag

  // Write the vector drawable to the destination
  fs.writeFileSync(splashDest, '<?xml version="1.0" encoding="utf-8"?>\n' + splashDrawable);

  console.log(`Copied and converted ${splashSvg} to ${splashDest}`);
}

console.log('SVG to Android conversion complete!'); 