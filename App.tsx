import React from 'react';
import Root from './src';
import {NavigationContainer} from '@react-navigation/native';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  );
}

export default App;
