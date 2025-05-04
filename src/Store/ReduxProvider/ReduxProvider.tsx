import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {injectStore} from '../../common/api';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {persistor, store} from '../Store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider = ({children}: ReduxProviderProps) => {
  injectStore(store);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#000',
            }}>
            <ActivityIndicator />
          </View>
        }
        persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
