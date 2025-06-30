import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor, useAppSelector} from './Store/Store';
import ParentNavigator from './Navigator/ParentNavigator';
import {AlertProvider} from './Utils/CustomAlert/AlertContext';
import {useKeepAwake} from './Utils/useKeepAwake';

// Inner component that uses Redux state
const AppWithKeepAwake = () => {
  // Get authentication state from Redux
  const isAuthenticated = useAppSelector(
    state => state.authSlice.isAuthenticated,
  );

  // Use the custom keep awake hook with authentication state
  useKeepAwake(isAuthenticated);

  return (
    <AlertProvider>
      <ParentNavigator />
    </AlertProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWithKeepAwake />
      </PersistGate>
    </Provider>
  );
};

export default App;
