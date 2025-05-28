import React, {lazy, useCallback, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from 'react-native';
import SuspenseComponent from '../../Provider/Suspense/Suspense';
import Ongoin from '../../assets/ongoing.png';
import asignedTask from '../../assets/completed_task.png';
import profileIcon from '../../assets/profile.png';
import pendingtask from '../../assets/pendingtask.png';
import {useTranslation} from 'react-i18next';
import {TaskDialog} from '../../components/TaskDialog/TaskDialog';
import {useFirebaseData} from '../../Hooks/useFirebaseData';
import {stopVibration, vibrateDevice} from '../../Utils/vibrate';
import {playSound, stopSound} from '../../Utils/Sound/Sound';
import {
  startBlinkingFlashlight,
  stopBlinkingFlashlight,
} from '../../Utils/toggleFlashlight';
import {useAppDispatch, useAppSelector} from '../../Store/Store';
import {
  setLoadingTask,
  setNewTaskData,
  setNewTaskNotification,
  setTaskToShow,
} from '../../Store/feature/globalSlice';
// import {PARK_TASK, RETRIEVE_TASK} from '../../Screen/OngoinTask/OngoinTask';
import {
  useGetUserProfileQuery,
  useLazyGetAssignedTaskQuery,
  useTaskNotAcceptedMutation,
} from '../../Store/feature/globalApiSlice';
import {setUser} from '../../Store/feature/Auth/authSlice';
import {revertLanguageFullName} from '../../Utils/selectLanguageFullName';
// import useLocation from '../../Hooks/useLocation';
import {TASK_TYPE, TASK_TYPES} from '../../config';
import {useAlert} from '../../Utils/CustomAlert/AlertContext';

// Lazy-loaded screens
const OngoinTask = lazy(() => import('../../Screen/OngoinTask/OngoinTask'));
// const PendingTask = lazy(() => import('../../Screen/Pending/Pending'));
// const AsignedTask = lazy(() => import('../../Screen/AsignedTask/AsignedTask'));
const Profile = lazy(() => import('../../Screen/Profile/Profile'));

// Tab Navigator
const Tab = createBottomTabNavigator();

// Icon paths
const icons = {
  home: Ongoin,
  pending: pendingtask,
  asigned: asignedTask,
  profile: profileIcon,
};

// Reusable screen wrapper with Suspense
const withSuspense = (Component: React.ComponentType<any>) => (props: any) =>
  (
    <SuspenseComponent>
      <Component {...props} />
    </SuspenseComponent>
  );

// Tab screen config array
const tabScreens = [
  {
    name: 'ongoing',
    component: withSuspense(OngoinTask),
    icon: icons.home,
  },
  // {
  //   name: 'Pending',
  //   component: withSuspense(PendingTask),
  //   icon: icons.pending,
  // },
  // {
  //   name: 'asigned',
  //   component: withSuspense(AsignedTask),
  //   icon: icons.asigned,
  // },
  {
    name: 'profile',
    component: withSuspense(Profile),
    icon: icons.profile,
  },
];

// =========  render tab bar icon ========== //
const renderTabBarIcon = (routeName: string) => {
  const matchedTab = tabScreens.find(
    tabScreen => tabScreen.name === routeName.toLowerCase(),
  );
  return (
    <Image source={matchedTab?.icon} style={styles.icon} resizeMode="contain" />
  );
};

// type TaskType = 'PARK' | 'RETRIEVE';

// type RootTabParamList = {
//   ongoing: undefined;
//   profile: undefined;
// };

const HomeTabs = () => {
  // const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const acceptedRef = React.useRef(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const {showAlert, hideAlert} = useAlert();

  const [countdown, setCountdown] = React.useState(30);
  const [lastNotificationId, setLastNotificationId] = React.useState<number>(0);
  const {newNotification, setNewNotification} = useFirebaseData() as any;
  //gte user profile data
  const {user} = useAppSelector(state => state.authSlice) as any;

  //get newNotification from store
  const {newTaskNotification, taskToShow, newTaskData} = useAppSelector(
    state => state.globalSlice,
  ) as {
    newTaskNotification: boolean;
    newTaskData: any;
    taskToShow: any;
  };

  // get user profile data
  const {data: userProfileData, isSuccess} = useGetUserProfileQuery(user?.id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,

    skip: !user?.id,
  });

  // console.log('userProfileData', userProfileData);

  //if user profile data is success, set user data
  useEffect(() => {
    if (isSuccess) {
      const userData = {
        ...user,
        language:
          userProfileData?.result?.data?.id === user?.id
            ? userProfileData?.result?.data?.language
            : 'en',
      };
      dispatch(setUser(userData));
      i18n.changeLanguage(revertLanguageFullName(userData?.language));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    dispatch,
    i18n,
    userProfileData?.result?.data?.id,
    userProfileData?.result?.data?.language,
  ]);

  // console.log('newNotification', newNotification);

  //start blinking flashlight
  const handleStartBlinking = async () => {
    await startBlinkingFlashlight();
  };

  //start blinking flashlight and vibrate
  const triggerAlertEffects = useCallback(() => {
    // handleStartBlinking(); // Uncomment if you want to start blinking the flashlight
    vibrateDevice(); // Uncomment if you want to vibrate the device
  }, []);

  //if newNotification arrives, set lastNotificationId to trigger new state
  React.useEffect(() => {
    const title = newNotification?.notification?.title as TASK_TYPE;
    // console.log('title', title);
    // Generate a pseudo-unique ID by timestamp
    if (TASK_TYPES.includes(title)) {
      const now = Date.now();
      setLastNotificationId(now); // trigger new state every time
      hideAlert();
    }
  }, [hideAlert, newNotification]);

  // call api to get assigned task
  const [getAssignedTask, {isLoading}] = useLazyGetAssignedTaskQuery();
  const [taskNotAccepted] = useTaskNotAcceptedMutation();

  // Fetch assigned task
  const handleGetAssignedTask = useCallback(async () => {
    try {
      if (!user?.id) return;

      const response = await getAssignedTask(user?.id).unwrap();
      console.log('response', response);
      if (response?.result?.success) {
        dispatch(setNewTaskData(response?.result?.data));
      }
    } catch (error: any) {
      if (
        error?.status === 'FETCH_ERROR' ||
        error?.name === 'ApiError' ||
        error?.message?.toLowerCase().includes('network') ||
        error?.originalStatus === 0
      ) {
        showAlert(
          'No Internet Connection!',
          'Please check your internet connection and try again.',
          'error',
        );
      } else {
        console.error('Error fetching assigned task:', error);
      }
    }
  }, [dispatch, getAssignedTask, user?.id, showAlert]);

  // Trigger fallback API if task is not accepted
  const triggerFallbackApi = useCallback(
    async (isTaskAccepted: boolean = false) => {
      try {
        if (!user?.id) return;

        await taskNotAccepted({
          driverId: user?.id,
          isTaskAccepted: isTaskAccepted,
        }).unwrap();
        //want to show alert that you missed the task and it will go to the supervisor
        if (isTaskAccepted === false) {
          showAlert(
            'You missed the task',
            'A notification has send to your superviser.',
            'warning',
          );
        }
      } catch (error: any) {
        if (
          error?.status === 'FETCH_ERROR' ||
          error?.name === 'ApiError' ||
          error?.message?.toLowerCase().includes('network') ||
          error?.originalStatus === 0
        ) {
          showAlert(
            'No Internet Connection!',
            'Please check your internet connection and try again.',
            'error',
          );
        } else {
          console.error('Error fetching assigned task:', error);
        }
      } finally {
        handleGetAssignedTask();
      }
    },
    [user?.id, taskNotAccepted, showAlert, handleGetAssignedTask],
  );

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(30); // reset
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          handleAutoClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup countdown
  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  // Auto-close logic extracted to a single function
  const handleAutoClose = useCallback(() => {
    if (!acceptedRef.current) {
      dispatch(setNewTaskNotification(false));
      dispatch(setTaskToShow(null));
      stopSound();
      stopVibration();
      stopBlinkingFlashlight();
      setNewNotification(null);
      stopCountdown();
      triggerFallbackApi(false); // Call fallback API
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, stopCountdown, triggerFallbackApi]);

  // if newNotification arrives, set taskToShow to show the dialog and play sound and show timer

  // console.log('newTaskNotification', newNotification);

  React.useEffect(() => {
    const title = newNotification?.notification?.title as TASK_TYPE;

    if (TASK_TYPES.includes(title)) {
      dispatch(setTaskToShow(title));
      playSound();
      triggerAlertEffects();
      dispatch(setNewTaskNotification(true));

      acceptedRef.current = false;

      // Clear previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      stopCountdown();

      // Start countdown display
      startCountdown();

      // Set up 30-sec auto-close
      timerRef.current = setTimeout(() => {
        // Only trigger fallback if not accepted
        console.log('Auto-closing dialog and triggering fallback API...');
        handleAutoClose();
      }, 30000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    triggerAlertEffects,
    triggerFallbackApi,
    lastNotificationId,
    handleAutoClose,
  ]);

  // Handle task acceptance
  const handleAccept = () => {
    acceptedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    dispatch(setNewTaskNotification(false));
    dispatch(setTaskToShow(null));
    stopSound();
    stopVibration();
    stopBlinkingFlashlight();
    setNewNotification(null);
    stopCountdown();
    triggerFallbackApi(true); // Call fallback API
  };

  useEffect(() => {
    dispatch(setLoadingTask(isLoading));
  }, [dispatch, isLoading]);

  // Fetch assigned task when the component mounts
  useEffect(() => {
    handleGetAssignedTask();
  }, [handleGetAssignedTask]);

  // Restore AppState background/inactive logic
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          nextAppState === 'background' ||
          nextAppState === 'inactive' // Optional: consider inactive for iOS quick backgrounding
        ) {
          if (!acceptedRef.current && newTaskNotification) {
            console.log(
              'App is backgrounded before task accepted. Triggering fallback...',
            );
            dispatch(setNewTaskNotification(false));
            dispatch(setTaskToShow(null));
            stopSound();
            stopVibration();
            stopBlinkingFlashlight();
            setNewNotification(null);
            stopCountdown();
            triggerFallbackApi(false); // Notify server
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
          }
        }
      },
    );

    return () => {
      subscription.remove();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTaskNotification, triggerFallbackApi, dispatch]);

  return (
    <>
      <Tab.Navigator
        initialRouteName="ongoing"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#fff',
          tabBarIcon: ({}) => renderTabBarIcon(route.name),
          tabBarButton: CustomTabBarButton,
        })}>
        {tabScreens.map(({name, component}) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarLabel: t(name),
            }}
          />
        ))}
      </Tab.Navigator>

      <TaskDialog
        visible={newTaskNotification && !!taskToShow}
        taskType={taskToShow || 'ParkIn'}
        countdown={countdown}
        onAccept={() => {
          handleAccept();
        }}
        theme={{colors: {primary: '#FFA500'}}}
      />
    </>
  );
};

export default HomeTabs;

const CustomTabBarButton = ({children, onPress, accessibilityState}: any) => {
  const isSelected = accessibilityState?.selected;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.customButton, isSelected ? styles.activeTab : null]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
  },
  icon: {
    width: 25,
    height: 25,
  },
  customButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#1e1e1e', // Change to your desired color
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
