import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {useGetDriverLocationAreaQuery} from '../../Store/feature/globalApiSlice';
import {useAppSelector} from '../../Store/Store';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../config';

const WaitingForTask: React.FC<{
  isConnected: boolean;
  onRefresh: () => void;
  isRefreshing?: boolean | undefined;
}> = ({isConnected, onRefresh, isRefreshing = false}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {user} = useAppSelector(state => state.authSlice);

  const {
    data: locationData,
    isLoading: isLoadingLocation,
    error: locationError,
    refetch: refetchLocation,
  } = useGetDriverLocationAreaQuery(user?.id || '', {
    skip: !user?.id || !isConnected,
    pollingInterval: isConnected ? 30000 : 0, // Poll every 30 seconds when connected
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  console.log('locationData new', locationData);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Pulse animation
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [pulse]);

  // Animated border style
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      pulse.value,
      [1, 1.15],
      [theme.colors.primary, '#FFA500'],
    );

    return {
      borderColor,
      borderWidth: withTiming(pulse.value > 1.05 ? 2 : 1),
    };
  });

  // Pulsing style for main icon
  const pulsingStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: pulse.value}],
      backgroundColor: isConnected ? theme.colors.primary : theme.colors.error,
      borderRadius: 100,
      padding: Math.min(SCREEN_WIDTH * 0.03, 15),
      opacity: 0.9,
      marginBottom: 20,
    };
  });

  // Location card animation
  const locationCardPulse = useSharedValue(1);

  useEffect(() => {
    locationCardPulse.value = withRepeat(
      withTiming(1.02, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [locationCardPulse]);

  const locationCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: locationCardPulse.value}],
    };
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatText = (str: string) => {
    return str
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getLocationDisplayName = () => {
    if (isLoadingLocation) {
      return t('loading_location');
    }
    if (locationError) {
      return t('location_unavailable');
    }
    if (!locationData?.result?.data) {
      return t('location_not_set');
    }

    const location = locationData.result.data;
    // Show locationName, area, or location (for afghan_parking), or fallback

    return formatText(
      location.locationName ||
        location.area ||
        location.location ||
        t('unknown_location'),
    );
  };

  const getLocationDescription = () => {
    if (!locationData?.result?.data) {
      return '';
    }

    const location = locationData.result.data;
    const parts = [];

    if (location.area && location.area !== location.locationName) {
      parts.push(location.area);
    }
    if (location.city) {
      parts.push(location.city);
    }
    if (location.state) {
      parts.push(location.state);
    }

    return parts.join(', ');
  };

  return (
    <Animated.View style={[animatedBorderStyle, styles.container]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Animated.View style={[pulsingStyle, {marginBottom: 20}]}>
          <Avatar.Icon
            icon={isConnected ? 'car' : 'wifi-off'}
            size={Math.min(SCREEN_HEIGHT * 0.1, 80)}
            backgroundColor={
              isConnected ? theme.colors.primary : theme.colors.error
            }
            style={{borderRadius: 100}}
            color="#fff"
          />
        </Animated.View>

        <TextWrapper variant="headlineSmall" style={styles.mainTitle}>
          {isConnected ? t('ready_for_service') : t('connection_lost')}
        </TextWrapper>

        <TextWrapper variant="bodyMedium" style={styles.subtitle}>
          {isConnected
            ? t('waiting_for_new_task')
            : t('please_check_internet_connection')}
        </TextWrapper>
      </View>

      {/* Current Location Card */}
      {isConnected && (
        <Animated.View
          style={[
            locationCardStyle,
            styles.locationCard,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <View
            style={[
              styles.locationHeader,
              // {justifyContent: 'center', alignItems: 'center', width: '100%'},
            ]}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={theme.colors.primary}
            />
            <TextWrapper
              variant="titleMedium"
              style={[
                styles.locationTitle,
                // {textAlign: 'center', width: '100%'},
              ]}
              >
              {t('current_location')}
            </TextWrapper>
          </View>

          {/* Centered location content */}
          <View
            style={[
              styles.locationContent,
              {alignItems: 'center', justifyContent: 'center', width: '100%'},
            ]}>
            <TextWrapper
              variant="bodyLarge"
              style={[
                styles.locationName,
                // {textAlign: 'center', width: '100%'},
              ]}>
              {getLocationDisplayName()}
            </TextWrapper>

            {getLocationDescription() && (
              <TextWrapper
                variant="bodySmall"
                style={[
                  styles.locationDescription,
                  {textAlign: 'center', width: '100%'},
                ]}>
                {getLocationDescription()}
              </TextWrapper>
            )}

            {isLoadingLocation && (
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                style={styles.locationLoader}
              />
            )}
          </View>

          {locationError && (
            <Pressable
              onPress={refetchLocation}
              style={styles.retryButton}
              accessibilityLabel={t('retry_location')}>
              <MaterialCommunityIcons
                name="refresh"
                size={16}
                color={theme.colors.primary}
              />
              <TextWrapper variant="bodySmall" style={styles.retryText}>
                {t('retry')}
              </TextWrapper>
            </Pressable>
          )}
        </Animated.View>
      )}

      {/* Time and Date Section */}
      <View style={styles.timeSection}>
        <TextWrapper variant="headlineMedium" style={styles.timeText}>
          {formatTime(currentTime)}
        </TextWrapper>
        <TextWrapper variant="bodyMedium" style={styles.dateText}>
          {formatDate(currentTime)}
        </TextWrapper>
      </View>

      {/* Status Indicator */}
      <View style={styles.statusSection}>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: isConnected
                ? theme.colors.primary
                : theme.colors.error,
            },
          ]}
        />
        <TextWrapper variant="bodyMedium" style={styles.statusText}>
          {isConnected ? t('online_ready') : t('offline')}
        </TextWrapper>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {isConnected && (
          <Animated.View
            style={[
              pulsingStyle,
              styles.refreshButton,
              {backgroundColor: theme.colors.primary},
            ]}>
            <Pressable
              onPress={onRefresh}
              style={{flexDirection: 'row', alignItems: 'center'}}
              disabled={isRefreshing}
              accessibilityLabel={t('check_for_tasks')}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
              )}
              <TextWrapper
                variant="bodyMedium"
                style={styles.refreshButtonText}>
                {isRefreshing ? t('checking') : t('check_for_tasks')}
              </TextWrapper>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Waiting Animation */}
      {/* Removed below animation as per request */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 24,
    margin: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  locationCard: {
    backgroundColor: '#3A3A3A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  locationContent: {
    // marginLeft: 32,
  },
  locationName: {
    color: '#fff',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationDescription: {
    color: '#B0B0B0',
    lineHeight: 18,
  },
  locationLoader: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 32,
    padding: 4,
  },
  retryText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  dateText: {
    color: '#B0B0B0',
    textAlign: 'center',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  refreshButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  waitingAnimation: {
    alignItems: 'center',
  },
  animatedText: {
    textAlign: 'center',
  },
});

export default WaitingForTask;
