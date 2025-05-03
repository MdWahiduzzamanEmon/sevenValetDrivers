/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Platform, Vibration} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
import moment from 'moment';

import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {BG_COLOR_BUTTON, SCREEN_HEIGHT} from '../../config';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import {
  startBlinkingFlashlight,
  stopBlinkingFlashlight,
} from '../../Utils/toggleFlashlight';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import {stopSound} from '../../Utils/Sound/Sound';
import {useTranslation} from 'react-i18next';
// import {stopSound} from '../../Utils/Sound/Sound';

export interface TaskData {
  type: 'PARK' | 'RETRIEVE';
  description: string;
  name: string;
  phone: string;
  brand: string;
  model: string;
  plate: string;
  location: string;
  startTime: string;
  duration: number;
  instructions: string;
}

const ICON_SIZE = SCREEN_HEIGHT * 0.035;

const TaskCard: React.FC<{data: TaskData}> = ({data}) => {
  const {t} = useTranslation();
  // const [isBlinking, setIsBlinking] = useState(false);
  // let stopBlinking: () => void;

  const [status, setStatus] = useState<'NOT_STARTED' | 'ONGOING' | 'COMPLETED'>(
    'NOT_STARTED',
  );
  const progress = useSharedValue(0);

  const theme = useTheme();
  const start = moment(data.startTime);
  const end = start.clone().add(data.duration, 'minutes');

  const vibrateDevice = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 500, 1000], true);
    } else if (Platform.OS === 'ios') {
      Vibration.vibrate();
    }
  };

  const handleStartBlinking = async () => {
    await startBlinkingFlashlight();
  };

  const triggerAlertEffects = useCallback(() => {
    if (status === 'NOT_STARTED') {
      vibrateDevice();
      handleStartBlinking();
    }
  }, [status]);

  //this section is commented out to avoid triggering the alert effects on every render.
  //will use it when the task is not started.

  useEffect(() => {
    if (data) {
      triggerAlertEffects();
    } else {
      Vibration.cancel();
    }
    return () => {
      Vibration.cancel(); // Stop vibration when the component unmounts
    };
  }, [data, triggerAlertEffects]);

  const progressColor = useAnimatedStyle(() => {
    const color =
      progress.value < 0.6
        ? theme.colors.primary
        : progress.value < 0.9
        ? '#FFA500'
        : theme.colors.error;
    return {backgroundColor: color};
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const totalDuration = end.diff(start);
      const elapsed = now.diff(start);
      progress.value = Math.min(elapsed / totalDuration, 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [data.startTime, data.duration, end, start, progress]);

  const handleStatusChange = async () => {
    if (status === 'NOT_STARTED') {
      setStatus('ONGOING');
    } else if (status === 'ONGOING') {
      setStatus('COMPLETED');
    } else {
      setStatus('NOT_STARTED');
    }

    await stopSound(); // Stop the sound when status changes
    await stopBlinkingFlashlight(); // Stop blinking when status changes
    Vibration.cancel(); // Stop vibration when status changes
  };

  const getButtonLabel = () => {
    if (data.type === 'PARK')
      return status === 'ONGOING' ? t('park_completed') : t('park');
    return status === 'ONGOING' ? t('retrieve_completed') : t('retrieve');
  };

  const getStatusLabel = () => {
    if (status === 'NOT_STARTED') return `${t('task')} ${t('not_started')}`;
    if (status === 'ONGOING') return `${t('task')} ${t('ongoing')}`;
    return `${t('task')} ${t('completed')}`;
  };

  const headerAnim = useSharedValue(0);

  useEffect(() => {
    headerAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: headerAnim.value,
        },
      ],
    };
  });

  //if not data then

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.2, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  //animate border color
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      pulse.value,
      [1, 1.2],
      //orange and primary
      ['#FFA500', theme.colors.primary],
    );

    return {
      borderColor,
      borderWidth: withTiming(pulse.value > 1 ? 2 : 1),
    };
  });
  const pulsingStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: pulse.value}],
      backgroundColor: theme.colors.primary,
      borderRadius: 100,
      padding: 10,
      opacity: 0.8,
      marginBottom: 10,
    };
  });

  if (!data) {
    // {
    //   /* //text : waiting for new task ,and waiting icon and content will be in center */
    // }
    return (
      <>
        <Animated.View
          style={[
            animatedBorderStyle,
            styles.cardContainer,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Animated.View style={[pulsingStyle, {padding: 10}]}>
            <Avatar.Icon
              icon="car"
              size={SCREEN_HEIGHT * 0.1}
              backgroundColor={theme.colors.primary}
              style={{borderRadius: 100}}
            />
          </Animated.View>
          <TextWrapper variant="titleMedium" style={{marginVertical: 10}}>
            Waiting for new task...
          </TextWrapper>
        </Animated.View>
      </>
    );
  }

  return (
    // <Animated.View style={[styles.animatedContainer, fadeInSlide]}>
    <Animated.View
      style={[animatedBorderStyle, styles.cardContainer, {padding: 15}]}>
      <Animated.View style={[styles.titleContiner, animatedHeaderStyle]}>
        <Animated.View style={[pulsingStyle]}>
          <Avatar.Icon
            icon="car"
            size={SCREEN_HEIGHT * 0.06}
            backgroundColor={theme.colors.primary}
            style={{borderRadius: 100}}
          />
        </Animated.View>

        <TextWrapper
          variant="titleLarge"
          style={{
            ...styles.title,
            color: '#fff',
            fontSize: 20,
            fontStyle: 'italic',
          }}>
          {data.type === 'PARK' ? t('park_the_car') : t('retrieve_the_car')}
        </TextWrapper>
      </Animated.View>
      <TextWrapper variant="titleSmall">{data.description}</TextWrapper>

      <View>
        {/* <TextWrapper variant="labelLarge">Special Instruction:</TextWrapper> */}
        <TextWrapper style={styles.instructions}>
          {data.instructions}
        </TextWrapper>
      </View>

      <View style={styles.content}>
        <View style={{marginBottom: 5}}>
          <View style={styles.row}>
            <Avatar.Icon
              icon="account"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.name}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="phone"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.phone}</TextWrapper>
          </View>
        </View>

        <View style={{marginVertical: 5}}>
          <View style={styles.row}>
            <Avatar.Icon
              icon="car"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{`${data.brand}, ${data.model}`}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="numeric"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.plate}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="map-marker"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.location}</TextWrapper>
          </View>
        </View>

        <View
          style={{
            marginVertical: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={styles.row}>
            <Avatar.Icon
              icon="calendar"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{start.format('DD,MMM,YYYY HH:mm')}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="clock-outline"
              size={ICON_SIZE}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.duration} min</TextWrapper>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarFill,
              progressColor,
              {width: `${progress.value * 100}%`},
            ]}
          />
        </View>

        <View style={styles.row}>
          <Avatar.Icon
            icon="information-outline"
            size={ICON_SIZE}
            backgroundColor={BG_COLOR_BUTTON}
          />
          <TextWrapper
            style={{
              ...styles.status,
              backgroundColor:
                status === 'COMPLETED'
                  ? '#4CAF50'
                  : status === 'ONGOING'
                  ? '#87CEEB'
                  : '#FFA500',
              color: '#fff',
              padding: 4,
              borderRadius: 4,
              fontWeight: 'bold',
            }}>
            {getStatusLabel()}
          </TextWrapper>
        </View>
        <CustomButton
          disabled={status === 'COMPLETED'}
          style={styles.button}
          label={getButtonLabel()}
          onPress={handleStatusChange}
        />
      </View>
    </Animated.View>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  titleContiner: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 20,
  },
  instructions: {
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.7)', //light red
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  status: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
  },
});

export default TaskCard;
