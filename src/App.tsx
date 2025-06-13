import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './Store/Store';
import ParentNavigator from './Navigator/ParentNavigator';
import {AlertProvider} from './Utils/CustomAlert/AlertContext';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {AppState, AppStateStatus} from 'react-native';

const App = () => {
  useEffect(() => {
    // Activate keep awake on mount
    activateKeepAwake();

    // Listen for app state changes
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          activateKeepAwake();
        } else if (
          nextAppState === 'background' ||
          nextAppState === 'inactive'
        ) {
          deactivateKeepAwake();
        }
      },
    );

    return () => {
      deactivateKeepAwake();
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>
          <ParentNavigator />
        </AlertProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
