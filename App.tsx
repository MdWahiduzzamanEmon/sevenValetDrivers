import React from 'react';
import Root from './src';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FirebaseProvider from './src/Provider/FirebaseProvider/FirebaseProvider';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <FirebaseProvider>
          <Root />
        </FirebaseProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
