import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './Store/Store';
import ParentNavigator from './Navigator/ParentNavigator';
import {AlertProvider} from './Utils/CustomAlert/AlertContext';
import {useKeepAwake} from './Utils/useKeepAwake';

const App = () => {
  // Use the custom keep awake hook
  useKeepAwake();

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
