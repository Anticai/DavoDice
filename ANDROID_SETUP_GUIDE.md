# Android Development Environment Setup Guide

This guide will help you set up your Android development environment to run the Blood Bowl Dice Calculator app on your Android device.

## Prerequisites

Before you start, make sure you have enough disk space (at least 10GB free) for the Android SDK and related tools.

## Step 1: Install Node.js and npm

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install Node.js with default options
3. Verify installation by opening a command prompt and typing:
   ```
   node --version
   npm --version
   ```

## Step 2: Install Java Development Kit (JDK)

1. Download JDK 11 (recommended for React Native) from [Oracle](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or use OpenJDK
2. Run the installer and follow the prompts
3. Set JAVA_HOME environment variable:
   - Press `Win + X` and select "System"
   - Click on "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "New"
   - Variable name: `JAVA_HOME`
   - Variable value: Path to your JDK installation (e.g., `C:\Program Files\Java\jdk-11.0.12`)
   - Click "OK"
4. Add Java to PATH:
   - In "Environment Variables", find "Path" under "System variables"
   - Click "Edit"
   - Click "New"
   - Add `%JAVA_HOME%\bin`
   - Click "OK" on all dialogs
5. Verify installation by opening a new command prompt and typing:
   ```
   java -version
   javac -version
   ```

## Step 3: Install Android Studio

1. Download Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Run the installer and follow the prompts
3. During installation, make sure to select:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
4. Complete the installation and launch Android Studio

## Step 4: Install Android SDK

1. In Android Studio, go to "Tools" > "SDK Manager"
2. In the "SDK Platforms" tab, select:
   - Android 12.0 (S)
   - Android 11.0 (R)
   - Android 10.0 (Q)
3. In the "SDK Tools" tab, select:
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator
   - Android SDK Platform-Tools
4. Click "Apply" and accept any license agreements

## Step 5: Configure Environment Variables

1. Set ANDROID_HOME environment variable:
   - Press `Win + X` and select "System"
   - Click on "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: Path to Android SDK (usually `C:\Users\<Your Username>\AppData\Local\Android\Sdk`)
   - Click "OK"
2. Add platform-tools to PATH:
   - In "Environment Variables", find "Path" under "System variables"
   - Click "Edit"
   - Click "New"
   - Add `%ANDROID_HOME%\platform-tools`
   - Click "OK" on all dialogs
3. Verify installation by opening a new command prompt and typing:
   ```
   adb --version
   ```

## Step 6: Create an Android Virtual Device (Emulator)

1. In Android Studio, go to "Tools" > "AVD Manager"
2. Click "Create Virtual Device"
3. Select a device definition (e.g., "Pixel 4")
4. Select a system image (e.g., "R" API level 30)
5. Complete the wizard and click "Finish"

## Step 7: Connect Your Android Device (Physical Device)

If you prefer to use a physical device instead of an emulator:

1. On your Android device, go to "Settings" > "About phone"
2. Tap on "Build number" 7 times to enable Developer options
3. Go back to "Settings" > "System" > "Developer options"
4. Enable "USB debugging"
5. Connect your device to your computer with a USB cable
6. When prompted on your device, allow USB debugging

## Running the App

Now that your environment is set up, you can run the app:

1. Open a command prompt
2. Navigate to your project directory:
   ```
   cd "E:\Coding\Mobile Apps\Andy Davo Dice\BloodBowlDiceCalculator"
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the Metro bundler:
   ```
   npx react-native start
   ```
5. In a new command prompt, navigate to the project directory and run:
   ```
   npx react-native run-android
   ```

## Troubleshooting

### Error: JAVA_HOME is not set
- Make sure you've set the JAVA_HOME environment variable correctly
- Restart your command prompt after setting environment variables

### Error: ADB not found
- Make sure Android SDK Platform-tools are installed
- Make sure ANDROID_HOME is set correctly
- Make sure %ANDROID_HOME%\platform-tools is added to PATH

### Error: No emulators found
- Create an Android Virtual Device as described in Step 6
- Start the emulator manually from AVD Manager before running the app

### Build fails with Gradle errors
- Check if your Gradle version matches the one required by the project
- Try running `cd android && ./gradlew clean` before building again

### App crashes immediately
- Check the logs with `adb logcat`
- Make sure you've installed all required dependencies

## Additional Resources

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Documentation](https://developer.android.com/studio/intro)
- [Troubleshooting React Native](https://reactnative.dev/docs/troubleshooting) 