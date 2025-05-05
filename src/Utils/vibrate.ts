import {Platform, Vibration} from 'react-native';

const vibrateDevice = () => {
  if (Platform.OS === 'android') {
    Vibration.vibrate([0, 500, 1000], true);
  } else if (Platform.OS === 'ios') {
    Vibration.vibrate();
  }
};

const stopVibration = () => {
  if (Platform.OS === 'android') {
    Vibration.cancel();
  } else if (Platform.OS === 'ios') {
    // iOS does not have a direct way to stop vibration
    // but we can use a short vibration to stop it
    Vibration.vibrate(0);
  }
};
export {vibrateDevice, stopVibration};
