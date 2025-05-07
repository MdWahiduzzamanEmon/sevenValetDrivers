import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {APP_NAME, GRADIENT_THEME_COLORS} from '../../../config';

const SplashFallback = () => {
  const image = require('../../../assets/car.png');

  // Create animated values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Start scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, pulseAnim, scaleAnim]);

  return (
    <LinearGradient
      colors={GRADIENT_THEME_COLORS}
      style={StyleSheet.absoluteFillObject}>
      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            transform: [{scale: scaleAnim}, {scale: pulseAnim}],
          },
        ]}>
        <ImageBackground
          source={image}
          style={styles.background}
          resizeMode="contain">
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{scale: fadeAnim}],
              },
            ]}>
            <Text style={styles.logoText}>{APP_NAME?.split(' ')[0]}</Text>
            <Text style={styles.smallLogoText}>
              {APP_NAME?.split(' ')[1]} {APP_NAME?.split(' ')[2]}
            </Text>
          </Animated.View>

          <Text style={styles.loadingText}>
            Please wait... <ActivityIndicator size="small" color="#ffffff" />
          </Text>
        </ImageBackground>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashFallback;

const styles = StyleSheet.create({
  animatedWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 50,
    alignSelf: 'flex-start',
  },
  logoText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  smallLogoText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 5,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 30,
  },
});
