# Samarabiz Native

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

```bash

cd ~/Library/Android/sdk
npx kill-port 8081
npm cache clean --force
npm start -- --reset-cache
```

# build -(ANDROID-apk) with mac

## Step 1: find JDK path

```bash

/usr/libexec/java_home

```

## Step 2: use Keytool to generate a keystore

```bash

sudo keytool -genkey -v -keystore samarabizinvest.keystore -alias bytebridge -keyalg RSA -keysize 2048 -validity 10000


## Firstly, you need to copy the file your_key_name.keystore and paste it under the android/app directory in your React Native project folder.

mv my-release-key.keystore /android/app

```

## Step 3: Setting up Gradle variables

** Place the my-upload-key.keystore file under the android/app directory
** Edit the file android/gradle.properties and add the following (replace **\*** with the correct keystore password, alias and key password),

```bash

MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=***** // keystore password
MYAPP_UPLOAD_KEY_PASSWORD=***** // key password

```

## Step 4: Add signing config to your app's gradle config

Edit the file android/app/build.gradle in your project folder and add the signing config,

```bash
signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
      buildTypes {
         release {
               signingConfig signingConfigs.release
         }
      }
```

## Step 5: Generate the release APK

```bash
cd android
gradlew clean
gradlew assembleRelease
cd ..
```

## OR: Generate the release bundle (recommended)

```bash
cd android
gradlew clean
gradlew bundleRelease

```

## Build with bash file

```bash

bash androidBuild.sh

```

## Step 6: Find the APK

```bash
cd app/build/outputs/apk/release
```

## Step 7: Install the APK

```bash
adb install app-release.apk
```

## Step 8: Run the APK

```bash
adb shell am start -n com.uparts_native/com.uparts_native.MainActivity
```

## Step 9: Uninstall the APK

```bash
adb uninstall com.uparts_native
```

<!-- //build -(apk) with mac  -->

## open iphone simulator

```bash
 open -a Simulator
```

<!-- // For http api call in release build  -->

## android->app->src->main->AndroidManifest.xml

```bash
   <application
        .....others
         android:usesCleartextTraffic="true"
    >
     <activity
        ....others
        android:usesCleartextTraffic="true"
    >
```

<!-- npx react-native-asset  -->

## npx react-native-asset

```bash
npx react-native-asset
```

## Get signing report from gradle - SHA1, SHA256 (Android 8.0+ only)

```bash
cd android && ./gradlew signingReport && cd ..
```

```bash
 npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

```

```bash

keytool -export -rfc -keystore "/Users/emon/All Files/Work/Cellco/SAMARABIZ/samarabizinvest/android/app/samarabizinvest.keystore" -alias bytebridge -file upload_certificate.pem

```

## Get SHA1, SHA256 from pem file

```bash
cd android/app

keytool -list -v -keystore sevenvaletDrivers.keystore -alias sevenvaletDrivers

```

```bash

sudo rm -rf ~/Library/Developer/Xcode/DerivedData

```
