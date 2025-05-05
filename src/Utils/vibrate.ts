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
  }
};
export {vibrateDevice, stopVibration};
