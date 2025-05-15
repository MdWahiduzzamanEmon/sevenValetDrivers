/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import theme from './src/Theme/theme';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import './i18n';
import ReduxProvider from './src/Store/ReduxProvider/ReduxProvider';

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <ReduxProvider>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </ReduxProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
