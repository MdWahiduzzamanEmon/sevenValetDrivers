import React from 'react';
import Root from './src';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FirebaseProvider from './src/Provider/FirebaseProvider/FirebaseProvider';
import {AlertProvider} from './src/Utils/CustomAlert/AlertContext';
import { LocationTrackerProvider } from './src/Provider/LocationTrackerProvider/LocationTrackerProvider';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <LocationTrackerProvider>
        <NavigationContainer>
          <FirebaseProvider>
            <AlertProvider>
              <Root />
            </AlertProvider>
          </FirebaseProvider>
        </NavigationContainer>
      </LocationTrackerProvider>
    </SafeAreaProvider>
  );
}

export default App;
