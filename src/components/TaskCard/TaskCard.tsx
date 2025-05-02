/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Platform, Vibration} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
import moment from 'moment';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {BG_COLOR_BUTTON, SCREEN_HEIGHT} from '../../config';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import {startBlinkingFlashlight} from '../../Utils/toggleFlashlight';

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

const TaskCard: React.FC<{data: TaskData}> = ({data}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  let stopBlinking: () => void;

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

  const handleStartStopBlinking = () => {
    if (isBlinking) {
      stopBlinking(); // Stop the blinking when it's on
    } else {
      stopBlinking = startBlinkingFlashlight(); // Start blinking
    }
    setIsBlinking(!isBlinking); // Toggle the blinking state
  };

  const triggerAlertEffects = useCallback(() => {
    if (status === 'NOT_STARTED') {
      vibrateDevice();
      handleStartStopBlinking();
    }
  }, [status]);

  //this section is commented out to avoid triggering the alert effects on every render.
  //will use it when the task is not started.

  //   useEffect(() => {
  //     if (data) {
  //       triggerAlertEffects();
  //     } else {
  //       Vibration.cancel();
  //     }
  //     return () => {
  //       Vibration.cancel(); // Stop vibration when the component unmounts
  //     };
  //   }, [data, handleStartStopBlinking, triggerAlertEffects]);

  const fadeInSlide = useAnimatedStyle(() => ({
    opacity: withTiming(1, {duration: 600}),
    transform: [
      {
        translateY: withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.exp),
        }),
      },
    ],
  }));

  const progressColor = useAnimatedStyle(() => {
    const color =
      progress.value < 0.6
        ? theme.colors.primary
        : progress.value < 0.9
        ? '#FFA500'
        : theme.colors.error;
    return {backgroundColor: color};
  });

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{scale: withTiming(buttonScale.value, {duration: 150})}],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const totalDuration = end.diff(start);
      const elapsed = now.diff(start);
      progress.value = Math.min(elapsed / totalDuration, 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [data.startTime, data.duration, end, start, progress]);

  const handleStatusChange = () => {
    if (status === 'NOT_STARTED') setStatus('ONGOING');
    else if (status === 'ONGOING') setStatus('COMPLETED');
    Vibration.cancel(); // Stop vibration when status changes
  };

  const getButtonLabel = () => {
    if (data.type === 'PARK')
      return status === 'ONGOING' ? 'PARK COMPLETED' : 'PARK';
    return status === 'ONGOING' ? 'RETRIEVED COMPLETED' : 'RETRIEVED';
  };

  const getStatusLabel = () => {
    if (status === 'NOT_STARTED') return 'Task Not Started';
    if (status === 'ONGOING') return 'Task On Going';
    return 'Task Completed';
  };

  return (
    <Animated.View style={[styles.animatedContainer, fadeInSlide]}>
      <View style={styles.cardContainer}>
        <TextWrapper variant="titleMedium" style={styles.title}>
          {data.type === 'PARK' ? 'Park the Car' : 'Retrieve the Car'}
        </TextWrapper>
        <TextWrapper variant="titleMedium">{data.description}</TextWrapper>

        <View style={styles.content}>
          <TextWrapper variant="labelLarge">Special Instruction:</TextWrapper>
          <TextWrapper style={styles.instructions}>
            {data.instructions}
          </TextWrapper>

          <View style={styles.row}>
            <Avatar.Icon
              icon="account"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.name}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="phone"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.phone}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="car"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{`${data.brand}, ${data.model}`}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="numeric"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.plate}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="map-marker"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.location}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="calendar"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{start.format('DD-MMM-YYYY HH:mm')}</TextWrapper>
          </View>
          <View style={styles.row}>
            <Avatar.Icon
              icon="clock-outline"
              size={24}
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper>{data.duration} min</TextWrapper>
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
              size={24}
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

          <Animated.View style={[animatedButtonStyle]}>
            <CustomButton
              disabled={status === 'COMPLETED'}
              style={styles.button}
              label={getButtonLabel()}
              onPress={handleStatusChange}
            />
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    opacity: 0,
    transform: [{translateY: 40}],
  },
  cardContainer: {
    margin: 10,
    height: SCREEN_HEIGHT - 30,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  instructions: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  progressBarContainer: {
    height: 8,
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
