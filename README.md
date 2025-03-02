# Blood Bowl Dice Calculator

A mobile application for Blood Bowl players to calculate dice probabilities and track roll statistics.

## Features

- Calculate success probabilities for Blood Bowl dice rolls
- Roll virtual dice with realistic animations
- Track roll statistics and success rates
- Customize app settings (animations, sound, haptic feedback)
- Dark and light mode support

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```
git clone https://github.com/andydavo/blood-bowl-dice-calculator.git
cd blood-bowl-dice-calculator
```

2. Install dependencies:
```
npm install
```

3. Start the Metro bundler:
```
npm start
```

4. Run on Android or iOS:
```
npm run android
```
or
```
npm run ios
```

## Deployment Instructions

### Generate Assets

App icons and splash screens are defined as SVG files in `src/assets/images/`. To generate PNG assets for deployment:

1. Install the SVG export tool:
```
npm install -g svgexport
```

2. Run the asset generation script:
```
node scripts/generate-assets.js
```

### Android Deployment

1. Setup signing key:
   - Create a keystore file by following the React Native documentation
   - Update `android/keystore.properties` with your keystore information
   - Never commit the actual keystore to version control

2. Build a release APK:
```
npm run build:android
```

3. Build a release AAB for Play Store:
```
npm run build:android-bundle
```

4. Deploy to Play Store:
```
npm run deploy:android
```

### iOS Deployment

1. Setup signing certificates in Xcode:
   - Open the iOS project in Xcode
   - Configure signing certificates and provisioning profiles

2. Build a release iOS build:
```
npm run build:ios
```

3. Deploy to App Store:
```
npm run deploy:ios
```

## Development

### Project Structure

- `/src` - Application source code
  - `/assets` - Images, sounds and other static assets
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/hooks` - Custom React hooks
  - `/navigation` - Navigation configuration
  - `/screens` - App screens
  - `/services` - Business logic services
  - `/styles` - Theme and global styles
  - `/utils` - Utility functions

### Scripts

- `npm start` - Start the Metro bundler
- `npm run android` - Run the app on Android
- `npm run ios` - Run the app on iOS
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run clean` - Clean project cache

## License

This project is licensed under the MIT License.
"# DavoDice" 
