import React from 'react';
import Root from './src';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FirebaseProvider from './src/Provider/FirebaseProvider/FirebaseProvider';
import {AlertProvider} from './src/Utils/CustomAlert/AlertContext';
import {LocationTrackerProvider} from './src/Provider/LocationTrackerProvider/LocationTrackerProvider';
import NetworkConnectivityProvider from './src/Provider/NetworkStatusProvider/NetworkStatusProvider';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <AlertProvider>
        <NetworkConnectivityProvider>
          <LocationTrackerProvider>
            <NavigationContainer>
              <FirebaseProvider>
                <Root />
              </FirebaseProvider>
            </NavigationContainer>
          </LocationTrackerProvider>
        </NetworkConnectivityProvider>
      </AlertProvider>
    </SafeAreaProvider>
  );
}

export default App;
