/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
// import moment from 'moment';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {BG_COLOR_BUTTON, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../Store/Store';
import {setClearTask} from '../../Store/feature/globalSlice';
import useLocation from '../../Hooks/useLocation';
import {
  useCompleteTaskMutation,
  useStartNewTaskMutation,
} from '../../Store/feature/globalApiSlice';
// import StartTaskComponent from '../StartTaskComponent/StartTaskComponent';
// import CompleteTaskComponent from '../CompleteTaskComponent/CompleteTaskComponent';
import {useFirebaseData} from '../../Hooks/useFirebaseData';
import formatElapsedTime from '../../Utils/formatElapsedTime';
// import {stopSound} from '../../Utils/Sound/Sound';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NetworkStatusContext} from '../../Provider/NetworkStatusProvider/NetworkStatusProvider';
import {setTaskPrgressingTimer} from '../../Store/feature/Auth/authSlice';
export type TaskData = {
  taskStatus: string;
  taskType: 'ParkIn' | 'ParkOut';
  description: string;
  // name: string;
  // phone: string;
  carBrand: string;
  carModel: string;
  plateNumber: string;
  pickOrDropLocation: string;
  // startTime: string;
  // duration: number;
  specialInstruction: string;
  parkingId: string;
  id: string;
  keyHolderId: string;
  priority: 'Normal' | 'High';
  parkingSlotId: string;
};

// Calculate responsive sizes
const ICON_SIZE = Math.min(SCREEN_HEIGHT * 0.035, 32);
const CARD_PADDING = Math.min(SCREEN_WIDTH * 0.04, 16);
const TITLE_FONT_SIZE = Math.min(SCREEN_WIDTH * 0.05, 20);
const INSTRUCTION_FONT_SIZE = Math.min(SCREEN_WIDTH * 0.04, 16);

const TaskCard: React.FC<{data: TaskData; isLoadingTask?: boolean}> = ({
  data,
  isLoadingTask = false,
}) => {
  const {newNotification} = useFirebaseData() as any;

  // const [showStartTaskDialog, setShowStartTaskDialog] = useState(false);
  // const [showCompleteTaskDialog, setShowCompleteTaskDialog] = useState(false);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {stopTracking} = useLocation();
  const networkContext = useContext(NetworkStatusContext);
  const isConnected = networkContext?.isConnected;
  const {startTracking, location} = useLocation();

  const {user} = useAppSelector(state => state.authSlice) as any;
  const {taskPrgressingTimer, taskStartTime} = useAppSelector(
    state => state.authSlice,
  ) as any;
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Ensure both times exist and are valid
    if (taskPrgressingTimer > 0 && taskStartTime > 0) {
      // Calculate immediately
      const initialElapsed = Date.now() - taskStartTime;
      setElapsedTime(initialElapsed);

      const interval = setInterval(() => {
        const elapsed = Date.now() - taskStartTime;
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [taskPrgressingTimer, taskStartTime]);

  // const [isBlinking, setIsBlinking] = useState(false);
  // let stopBlinking: () => void;

  const [status, setStatus] = useState<'NOT_STARTED' | 'ONGOING' | 'COMPLETED'>(
    'NOT_STARTED',
  );

  const theme = useTheme();
  // const start = data ? moment(data.startTime) : moment();
  // const end = data ? start.clone().add(data.duration, 'minutes') : moment();

  //this section is commented out to avoid triggering the alert effects on every render.

  // const progressColor = useAnimatedStyle(() => {
  //   const color =
  //     progress.value < 0.6
  //       ? theme.colors.primary
  //       : progress.value < 0.9
  //       ? '#FFA500'
  //       : theme.colors.error;
  //   return {backgroundColor: color};
  // });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = moment();
  //     const totalDuration = end.diff(start);
  //     const elapsed = now.diff(start);
  //     progress.value = Math.min(elapsed / totalDuration, 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [data?.startTime, data?.duration, end, start, progress]);

  useEffect(() => {
    if (newNotification) {
      setStatus('NOT_STARTED');
    }
  }, [newNotification]);

  // console.log(data.taskStatus, 'data.taskStatus');
  useEffect(() => {
    if (data) {
      if (data.taskStatus === 'Ongoing') {
        setStatus('ONGOING');
        //stopSound();
      }
      if (data.taskStatus === 'Completed') {
        setStatus('COMPLETED');
        //stopSound();
      }
      if (data.taskStatus === 'Assigned') {
        setStatus('NOT_STARTED');
      }
    }
  }, [data]);

  const [startNewTask, {isLoading: startNewTaskLoading}] =
    useStartNewTaskMutation();
  const [completeTask, {isLoading: completeTaskLoading}] =
    useCompleteTaskMutation();

  const handleStatusChange = async () => {
    if (status === 'NOT_STARTED') {
      // setShowStartTaskDialog(true);
      confirmStart();
    } else if (status === 'ONGOING') {
      // setShowCompleteTaskDialog(true);
      confirmStartComplete();
    } else if (status === 'COMPLETED') {
      //handle completed task
      dispatch(setClearTask());
      stopTracking();
      setStatus('NOT_STARTED');
    }
  };

  //handle screen lock
  useEffect(() => {
    if (status === 'ONGOING') {
      activateKeepAwake();
    } else {
      deactivateKeepAwake();
    }

    return () => {
      deactivateKeepAwake();
    };
  }, [status]);

  const getButtonLabel = () => {
    if (data?.taskType === 'ParkIn') {
      return status === 'ONGOING' ? t('park_completed') : t('park_in');
    }
    return status === 'ONGOING' ? t('park_out_completed') : t('park_out');
  };

  const getStatusLabel = () => {
    if (status === 'NOT_STARTED') {
      return `${t('task')} ${t('not_started')}`;
    }
    if (status === 'ONGOING') {
      return `${t('task')} ${t('ongoing')}`;
    }
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
      backgroundColor: isConnected ? theme.colors.primary : theme.colors.red,
      borderRadius: 100,
      padding: Math.min(SCREEN_WIDTH * 0.02, 10),
      opacity: 0.8,
      marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 10),
    };
  });

  // Check for cached completion when regaining connection
  useEffect(() => {
    const trySendCachedCompletion = async () => {
      if (isConnected) {
        const cached = await AsyncStorage.getItem('pendingCompleteTask');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            try {
              await completeTask(parsed).unwrap();
              await AsyncStorage.removeItem('pendingCompleteTask');
            } catch (e: any) {
              if (
                e?.status === 'FETCH_ERROR' ||
                e?.name === 'ApiError' ||
                e?.message?.toLowerCase().includes('network') ||
                e?.originalStatus === 0
              ) {
                // Optionally show alert here if needed
              } else {
                console.error(e);
              }
            }
          } catch (e) {
            // Optionally handle error
            console.error(e);
          }
        }
      }
    };
    trySendCachedCompletion();
  }, [isConnected, completeTask]);

  // console.log(data, 'data');
  // console.log(isLoadingTask, 'isLoadingTask');

  const confirmStart = async () => {
    // setShowDialog(false);
    dispatch(setTaskPrgressingTimer(Date.now()));
    try {
      const taskData = {
        driverId: user.id,
        latitude: location?.latitude?.toString() || '',
        longitude: location?.longitude?.toString() || '',
        speed: location?.speed || 0,
        heading: location?.heading || 0,
      };

      await startNewTask(taskData).unwrap();
      // console.log('res-start task', res);
      setStatus('ONGOING');
      startTracking();
    } catch (error: any) {
      if (
        error?.status === 'FETCH_ERROR' ||
        error?.name === 'ApiError' ||
        error?.message?.toLowerCase().includes('network') ||
        error?.originalStatus === 0
      ) {
        // Optionally show alert here if needed
      } else {
        console.error('Error starting task:', error);
      }
    }
  };

  // Calculate completionHour and completetionMin
  const completionHour = Math.floor((elapsedTime || 0) / (1000 * 60 * 60));
  const completetionMin = Math.floor(
    ((elapsedTime || 0) % (1000 * 60 * 60)) / (1000 * 60),
  );

  //handle complete task
  const confirmStartComplete = async () => {
    // setShowDialog(false);
    dispatch(setTaskPrgressingTimer(0));
    const taskData = {
      driverId: user.id,
      latitude: location?.latitude?.toString() || '',
      longitude: location?.longitude?.toString() || '',
      speed: location?.speed || 0,
      heading: location?.heading || 0,
      chachingData: false,
      completionHour: 0,
      completetionMin: 0,
    };
    if (!isConnected) {
      // Save to cache for later sync
      await AsyncStorage.setItem(
        'pendingCompleteTask',
        JSON.stringify({
          ...taskData,
          chachingData: true,
          completionHour,
          completetionMin,
        }),
      );
      setStatus('COMPLETED');
      dispatch(setClearTask());
      stopTracking();
      return;
    }
    try {
      await completeTask(taskData).unwrap();
      setStatus('COMPLETED');
      dispatch(setClearTask());
      stopTracking();
    } catch (error: any) {
      if (
        error?.status === 'FETCH_ERROR' ||
        error?.name === 'ApiError' ||
        error?.message?.toLowerCase().includes('network') ||
        error?.originalStatus === 0
      ) {
        // Optionally show alert here if needed
      } else {
        console.error('Error starting task:', error);
      }
    }
  };

  //if loading task then show loading ui

  if (isLoadingTask) {
    return (
      <Animated.View
        style={[
          animatedBorderStyle,
          styles.cardContainer,
          styles.emptyContainer,
          {justifyContent: 'center', alignItems: 'center', padding: 20},
        ]}>
        <Animated.View style={[pulsingStyle, {marginBottom: 20}]}>
          <Avatar.Icon
            icon="car"
            size={Math.min(SCREEN_HEIGHT * 0.1, 80)}
            backgroundColor={theme.colors.primary}
            style={styles.avatar}
          />
        </Animated.View>

        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{marginBottom: 15, marginTop: 10}}
          animating={true}
        />

        <AnimatedDotsLoadingText text={t('loading_your_task')} />

        <TextWrapper
          variant="bodyMedium"
          style={{textAlign: 'center', marginTop: 10}}>
          {t('please_wait_while_we_fetch_your_task')}
        </TextWrapper>
      </Animated.View>
    );
  }

  //if no data or task status is assigned then show waiting for new task
  if (!data || data?.taskStatus === 'Assigned') {
    // {
    //   /* //text : waiting for new task ,and waiting icon and content will be in center */
    // }
    return (
      <Animated.View
        style={[
          animatedBorderStyle,
          styles.cardContainer,
          styles.emptyContainer,
        ]}>
        <Animated.View
          style={[pulsingStyle, {padding: Math.min(SCREEN_WIDTH * 0.02, 10)}]}>
          <Avatar.Icon
            icon={isConnected ? 'car' : 'wifi-off'}
            size={Math.min(SCREEN_HEIGHT * 0.1, 80)}
            backgroundColor={
              isConnected ? theme.colors.primary : theme.colors.red
            }
            style={styles.avatar}
          />
        </Animated.View>
        <TextWrapper variant="titleMedium" style={styles.waitingText}>
          {/* {t('waiting_for_new_task')} */}
          {isConnected
            ? t('waiting_for_new_task')
            : t('no_internet_connection')}
        </TextWrapper>
      </Animated.View>
    );
  }

  return (
    // <Animated.View style={[styles.animatedContainer, fadeInSlide]}>

    <Animated.View
      style={[
        animatedBorderStyle,
        styles.cardContainer,
        {padding: CARD_PADDING},
      ]}>
      <Animated.View style={[styles.titleContainer, animatedHeaderStyle]}>
        <Animated.View style={[pulsingStyle]}>
          <Avatar.Icon
            icon={isConnected ? 'car' : 'wifi-off'}
            size={Math.min(SCREEN_HEIGHT * 0.1, 50)}
            backgroundColor={
              isConnected ? theme.colors.primary : theme.colors.red
            }
            style={styles.avatar}
          />
        </Animated.View>

        <TextWrapper
          variant="titleLarge"
          style={[styles.title, {fontSize: TITLE_FONT_SIZE}]}>
          {data.taskType === 'ParkIn'
            ? t('park_in_the_car')
            : t('park_out_the_car')}
        </TextWrapper>
      </Animated.View>

      {data?.specialInstruction && (
        <View style={styles.instructionsContainer}>
          <TextWrapper
            style={[styles.instructions, {fontSize: INSTRUCTION_FONT_SIZE}]}>
            {data.specialInstruction}
          </TextWrapper>
        </View>
      )}

      <View style={styles.content}>
        <VehicleDetails data={data} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.statusContainer}>
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
              }}>
              {getStatusLabel()}
            </TextWrapper>
          </View>
          {/* //show timer */}
          {status === 'ONGOING' && (
            <TextWrapper
              style={{
                ...styles.status,
                backgroundColor: '#FFA500',
                padding: Math.min(SCREEN_WIDTH * 0.01, 4),
                borderRadius: 4,
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: Math.min(SCREEN_WIDTH * 0.04, 12),
              }}>
              {formatElapsedTime(elapsedTime)}
            </TextWrapper>
          )}
        </View>
        <CustomButton
          disabled={status === 'COMPLETED'}
          style={styles.button}
          label={getButtonLabel()}
          onPress={handleStatusChange}
          loading={startNewTaskLoading || completeTaskLoading}
        />
      </View>

      {/* //modal for start task */}
      {/* <StartTaskComponent
        user={user}
        startNewTask={startNewTask}
        setStatus={setStatus}
        setShowDialog={setShowStartTaskDialog}
        showDialog={showStartTaskDialog}
      /> */}

      {/* //modal for complete task */}
      {/* <CompleteTaskComponent
        user={user}
        completeTask={completeTask}
        setStatus={setStatus}
        setShowDialog={setShowCompleteTaskDialog}
        showDialog={showCompleteTaskDialog}
        elapsedTime={elapsedTime}
      /> */}
    </Animated.View>

    // </Animated.View>
  );
};

export default TaskCard;

const VehicleDetails: React.FC<{data: TaskData}> = ({data}) => {
  return (
    <View style={styles.vehicleDetailsContainer}>
      <View>
        <View style={styles.detailItem}>
          {/* <View style={styles.textContainer}>  */}
          <Avatar.Icon
            icon="car"
            size={ICON_SIZE}
            style={styles.icon}
            color="#fff"
            backgroundColor={BG_COLOR_BUTTON}
          />
          <TextWrapper style={styles.label}>Vehicle</TextWrapper>
          {/* </View> */}
        </View>
        <TextWrapper style={styles.value}>
          {`${data.carBrand}, ${data.carModel}`}
        </TextWrapper>
      </View>

      <View style={styles.plateDetailsContainer}>
        <View style={styles.detailItem}>
          <Avatar.Icon
            icon="numeric"
            size={ICON_SIZE}
            style={styles.icon}
            color="#fff"
            backgroundColor={BG_COLOR_BUTTON}
          />
          <TextWrapper style={styles.label}>Plate Number</TextWrapper>
        </View>
        <View style={styles.plateContainer}>
          <TextWrapper style={styles.plateText}>{data.plateNumber}</TextWrapper>
        </View>
      </View>

      {data.pickOrDropLocation && (
        <View>
          <View style={styles.detailItem}>
            <Avatar.Icon
              icon="map-marker"
              size={ICON_SIZE}
              style={styles.icon}
              color="#fff"
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper style={styles.label}>Drop Location</TextWrapper>
          </View>
          {/* <View style={styles.textContainer}> */}
          <TextWrapper style={styles.value}>
            {data.pickOrDropLocation}
          </TextWrapper>
          {/* </View> */}
        </View>
      )}

      {/* Key Holder and Parking Slot ID */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          width: '100%', // ensure full width
        }}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <View style={styles.detailItem}>
            <Avatar.Icon
              icon="parking"
              size={Math.min(SCREEN_HEIGHT * 0.1, 20)}
              style={styles.icon}
              color="#fff"
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper style={styles.label}>Parking Slot</TextWrapper>
          </View>
          <TextWrapper style={styles.parkinOutContainer}>
            <TextWrapper style={styles.parkinOutText}>
              {data.parkingSlotId || '-'}
            </TextWrapper>
          </TextWrapper>
        </View>

        <View style={{flex: 1, alignItems: 'flex-end'}}>
          {/* <TextWrapper style={styles.label}>Key Holder</TextWrapper> */}
          <View style={styles.detailItem}>
            <Avatar.Icon
              icon="key"
              size={Math.min(SCREEN_HEIGHT * 0.1, 20)}
              style={styles.icon}
              color="#fff"
              backgroundColor={BG_COLOR_BUTTON}
            />
            <TextWrapper style={styles.label}>Key Holder</TextWrapper>
          </View>
          <TextWrapper style={styles.parkinOutContainer}>
            <TextWrapper style={styles.parkinOutText}>
              {data.keyHolderId || '-'}
            </TextWrapper>
          </TextWrapper>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: Math.min(SCREEN_HEIGHT * 0.01, 10),
    flex: 1,
    borderRadius: 12,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingTop: Math.min(SCREEN_HEIGHT * 0.02, 15),
    paddingBottom: Math.min(SCREEN_HEIGHT * 0.005, 5),
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 10),
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    marginTop: Math.min(SCREEN_HEIGHT * 0.02, 0),
  },
  instructionsContainer: {
    marginVertical: Math.min(SCREEN_HEIGHT * 0.01, 10),
  },
  instructions: {
    color: '#fff',
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.7)',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    fontWeight: 'bold',
  },
  vehicleDetailsContainer: {
    marginVertical: Math.min(SCREEN_HEIGHT * 0.01, 10),
    gap: Math.min(SCREEN_HEIGHT * 0.015, 10),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.007, 6),
  },
  plateDetailsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: Math.min(SCREEN_HEIGHT * 0.01, 10),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 0),
  },
  icon: {
    marginRight: Math.min(SCREEN_WIDTH * 0.03, 12),
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: Math.min(SCREEN_WIDTH * 0.035, 13),
    color: '#777',
    marginBottom: 2,
  },
  value: {
    fontSize: Math.min(SCREEN_WIDTH * 1, 20),
    fontWeight: '600',
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
    marginTop: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  status: {
    marginLeft: Math.min(SCREEN_WIDTH * 0.03, 12),
    fontWeight: 'bold',
    color: '#fff',
    padding: Math.min(SCREEN_WIDTH * 0.01, 4),
    borderRadius: 4,
  },
  button: {
    marginTop: Math.min(SCREEN_HEIGHT * 0.02, 16),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  avatar: {
    borderRadius: 100,
  },
  waitingText: {
    marginVertical: Math.min(SCREEN_HEIGHT * 0.01, 10),
    textAlign: 'center',
  },

  plateContainer: {
    backgroundColor: '#fff', // or '#f1c40f' for yellow
    borderColor: '#e67e22', // or '#e67e22' for orange
    borderWidth: 3,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3, // for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  plateText: {
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace', // or custom license plate font
  },

  parkinOutContainer: {
    backgroundColor: '#fff', // or '#f1c40f' for yellow
    borderColor: '#e67e22', // or '#e67e22' for orange
    borderWidth: 3,
    borderRadius: 6,
    paddingTop: 3,
    paddingHorizontal: 14,
    alignItems: 'center', // center horizontally
    justifyContent: 'center', // center vertically
    marginTop: 10,
    elevation: 3, // for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // alignSelf: 'stretch', // ensure container stretches to parent width
  },
  parkinOutText: {
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace', // or custom license plate font
    textAlign: 'center', // center text horizontally
    width: '100%', // ensure text takes full width of container
  },
});

const AnimatedDotsLoadingText = ({text}: {text: string}) => {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <TextWrapper variant="titleLarge" style={{textAlign: 'center'}}>
      {text}
      {dots}
    </TextWrapper>
  );
};
