import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';
import Torch from 'react-native-torch';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Flashlight needs camera permission to work',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        return true;
      } else {
        console.log('Camera permission denied');
        // Show alert to user about permission being required
        Alert.alert(
          'Permission Required',
          'Camera permission is required for flashlight functionality. Please enable it in Settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                // Open app settings
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      }
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
      return false;
    }
  }
  return true; // iOS doesn't need explicit camera permission for flashlight
};

const toggleFlashlight = async (on: boolean) => {
  if (Platform.OS === 'android') {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.warn('Camera permission denied');
      return;
    }
  }

  try {
    await Torch.switchState(on);
  } catch (error) {
    console.warn('Error toggling flashlight:', error);
  }
};

let blinkInterval: NodeJS.Timeout | null = null;
let isBlinking = false;

export const startBlinkingFlashlight = async () => {
  if (isBlinking) {
    await stopBlinkingFlashlight();
  }

  isBlinking = true;
  let isOn = false;

  const toggle = async () => {
    try {
      // Start blinking by switching flashlight on and off
      blinkInterval = setInterval(async () => {
        isOn = !isOn; // Toggle between on and off
        await toggleFlashlight(isOn); // Toggle flashlight state
      }, 500); // Blink every 500ms (adjust as necessary)
    } catch (error) {
      console.warn('Error starting the blinking:', error);
      isBlinking = false;
    }
  };

  await toggle(); // Start the blinking
};

export const stopBlinkingFlashlight = async () => {
  console.log('Attempting to stop flashlight...');

  // Clear the interval first
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }

  // Reset blinking state
  isBlinking = false;

  try {
    // Try multiple times to ensure flashlight is off
    for (let i = 0; i < 3; i++) {
      await Torch.switchState(false);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between attempts
    }
    console.log('Flashlight stopped successfully');
  } catch (error) {
    console.warn('Error stopping flashlight:', error);
  }
};
