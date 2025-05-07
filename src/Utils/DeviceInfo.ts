import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getDeviceName = async (): Promise<string> => {
  try {
    let deviceName = '';

    if (Platform.OS === 'ios') {
      deviceName = await DeviceInfo.getDeviceName();
    } else {
      deviceName = await DeviceInfo.getDeviceName();
    }

    // If device name is not available, use model name as fallback
    if (!deviceName) {
      deviceName = await DeviceInfo.getModel();
    }

    // If still no name, use a default
    if (!deviceName) {
      deviceName = `${Platform.OS} Device`;
    }

    return deviceName;
  } catch (error) {
    console.log('Error getting device name:', error);
    return `${Platform.OS} Device`;
  }
};
