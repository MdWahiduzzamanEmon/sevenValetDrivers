/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {GRADIENT_THEME_COLORS} from './config';
import ParentNavigator from './Navigator/ParentNavigator';
import SplashFallback from './Provider/Suspense/SplashFallback/SplashFallback';
import Animated, {LightSpeedInRight} from 'react-native-reanimated';

const Root = () => {
  const insets = useSafeAreaInsets();

  //   ===================================  state for splash screen =========================
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 2000); // 4 seconds
    return () => clearTimeout(timeout);
  }, []);

  //   ===================================  state for splash screen end =========================

  return (
    <GestureHandlerRootView
      style={[
        styles.root,

        {
          // ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <StatusBar
        animated={true}
        backgroundColor="#000"
        barStyle="light-content"
        showHideTransition="fade"
        hidden={false}
      />
      <LinearGradient
        colors={GRADIENT_THEME_COLORS} // black to brown
        style={{
          flex: 1,
        }}>
        {showSplash ? (
          <SplashFallback />
        ) : (
          <Animated.View
            entering={LightSpeedInRight.duration(500)}
            style={{
              flex: 1,
            }}>
            <ParentNavigator />
          </Animated.View>
        )}

        {/* =================== bottom sheet content start ===================== */}
        {/* <BottomSheetContent /> */}
        {/* =================== bottom sheet content end ===================== */}
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default Root;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
