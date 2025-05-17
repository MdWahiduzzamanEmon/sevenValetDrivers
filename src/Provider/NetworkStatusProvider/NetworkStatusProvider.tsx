/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useAlert} from '../../Utils/CustomAlert/AlertContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
};

export type NetworkStatusContextType = {
  isConnected: boolean | null;
};

export const NetworkStatusContext = React.createContext<
  NetworkStatusContextType | undefined
>(undefined);

const NetworkConnectivityProvider: React.FC<Props> = ({children}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const {showAlert} = useAlert();
  const [firstCheck, setFirstCheck] = useState(true);

  const checkConnection = useCallback(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    checkConnection(); // Initial fetch
    return () => unsubscribe();
  }, [checkConnection]);

  useEffect(() => {
    if (isConnected === false && !firstCheck) {
      showAlert(
        'No Internet Connection!',
        'Please check your internet connection and try again.',
        'error',
        {
          actionLabel: 'Retry',
          onAction: checkConnection,
        },
      );
    }
    if (firstCheck && isConnected !== null) {
      setFirstCheck(false);
    }
  }, [isConnected, firstCheck, showAlert, checkConnection]);

  // Always render children
  return (
    <NetworkStatusContext.Provider value={{isConnected}}>
      <SafeAreaProvider style={{flex: 1}}>{children}</SafeAreaProvider>
    </NetworkStatusContext.Provider>
  );
};

export default NetworkConnectivityProvider;
