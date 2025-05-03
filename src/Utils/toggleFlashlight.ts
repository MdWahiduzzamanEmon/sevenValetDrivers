import {PermissionsAndroid, Platform} from 'react-native';
import Torch from 'react-native-torch';

const toggleFlashlight = async (on: boolean) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('Camera permission denied');
      return;
    }
  }

  Torch.switchState(on); // Switch the flashlight on/off based on the `on` parameter
};

let blinkInterval: NodeJS.Timeout;
export const startBlinkingFlashlight = async () => {
  let isOn = false;

  const toggle = async () => {
    try {
      // Start blinking by switching flashlight on and off
      blinkInterval = setInterval(() => {
        isOn = !isOn; // Toggle between on and off
        toggleFlashlight(isOn); // Toggle flashlight state
      }, 500); // Blink every 500ms (adjust as necessary)
    } catch (error) {
      console.warn('Error starting the blinking:', error);
    }
  };

  toggle(); // Start the blinking
};

// Return a function to stop the blinking when needed
const stopBlinking = () => {
  clearInterval(blinkInterval); // Stop the blinking interval
  toggleFlashlight(false); // Ensure flashlight is off when blinking stops
};

export const stopBlinkingFlashlight = async () => {
  stopBlinking(); // Call the function to stop blinking
};
