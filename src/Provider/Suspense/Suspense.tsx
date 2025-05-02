import React, {Suspense} from 'react';
// import SplashFallback from './SplashFallback/SplashFallback';
import {ActivityIndicator, View} from 'react-native';

interface Props {
  children: React.ReactNode;
}

const SuspenseComponent = ({children}: Props) => {
  return (
    <Suspense
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#000',
          }}>
          <ActivityIndicator />
        </View>
      }>
      {children}
    </Suspense>
  );
};

export default SuspenseComponent;
