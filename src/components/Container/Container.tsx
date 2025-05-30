import {Show} from 'easy-beauty-components---react';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {GRADIENT_THEME_COLORS} from '../../config';
interface props {
  children: React.ReactNode;
  keyboardAware?: boolean;
}

const DURATION = 500;
const DELAY = 100;

const Container = ({keyboardAware, children}: props) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(DELAY, withTiming(1, {duration: DURATION}));
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacity,
        },
      ]}>
      <Show when={keyboardAware}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          shouldRasterizeIOS
          scrollEnabled={true}
          resetScrollToCoords={{x: 0, y: 0}}
          extraScrollHeight={50}
          enableResetScrollToCoords={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <LinearGradient
            colors={GRADIENT_THEME_COLORS} // black to brown
            style={[styles.gradient]}>
            {children}
          </LinearGradient>
        </KeyboardAwareScrollView>
      </Show>
      <Show when={!keyboardAware}>
        <LinearGradient
          colors={GRADIENT_THEME_COLORS} // black to brown
          style={[styles.gradient]}>
          {children}
        </LinearGradient>
      </Show>
    </Animated.View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,

    // width: SCREEN_WIDTH,
  },
});
