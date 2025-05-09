import React, {lazy, useCallback, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
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
  setNewTaskData,
  setNewTaskNotification,
  setTaskToShow,
} from '../../Store/feature/globalSlice';
// import {PARK_TASK, RETRIEVE_TASK} from '../../Screen/OngoinTask/OngoinTask';
import {
  useGetUserProfileQuery,
  useLazyGetAssignedTaskQuery,
} from '../../Store/feature/globalApiSlice';
import {setUser} from '../../Store/feature/Auth/authSlice';
import {revertLanguageFullName} from '../../Utils/selectLanguageFullName';
// import useLocation from '../../Hooks/useLocation';
import {TASK_TYPE, TASK_TYPES} from '../../config';

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
  const [lastNotificationId, setLastNotificationId] = React.useState<number>(0);
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();

  // const {startTracking} = useLocation();
  // console.log('location', location);

  // useEffect(() => {
  //   startTracking();
  //   return () => {
  //     stopTracking();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const {newNotification, setNewNotification} = useFirebaseData() as any;

  //gte user profile data
  const {user} = useAppSelector(state => state.authSlice) as any;
  // console.log('user', user);
  const {data: userProfileData, isSuccess} = useGetUserProfileQuery(user?.id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // console.log('userProfileData', userProfileData);

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

  const handleStartBlinking = async () => {
    await startBlinkingFlashlight();
  };

  const triggerAlertEffects = useCallback(() => {
    handleStartBlinking();
    vibrateDevice();
  }, []);

  React.useEffect(() => {
    const title = newNotification?.notification?.title as TASK_TYPE;
    console.log('title', title);
    // Generate a pseudo-unique ID by timestamp
    if (TASK_TYPES.includes(title)) {
      const now = Date.now();
      setLastNotificationId(now); // trigger new state every time
    }
  }, [newNotification]);

  const [getAssignedTask] = useLazyGetAssignedTaskQuery();

  React.useEffect(() => {
    const title = newNotification?.notification?.title as TASK_TYPE;

    if (TASK_TYPES.includes(title)) {
      dispatch(setTaskToShow(title));
      playSound();
      triggerAlertEffects();
      dispatch(setNewTaskNotification(true));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lastNotificationId, triggerAlertEffects]);

  const {newTaskNotification, taskToShow} = useAppSelector(
    state => state.globalSlice,
  ) as {
    newTaskNotification: boolean;
    newTaskData: any;
    taskToShow: any;
  };

  const handleGetAssignedTask = async () => {
    try {
      const response = await getAssignedTask(user?.id).unwrap();
      // console.log('response', response);
      if (response?.result?.success) {
        dispatch(setNewTaskData(response?.result?.data));
      }
    } catch (error) {
      console.error('Error fetching assigned task:', error);
    }
  };

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
        onAccept={() => {
          dispatch(setNewTaskNotification(false));
          // dispatch(setNewTaskData(taskToShow));
          handleGetAssignedTask();
          dispatch(setTaskToShow(null));
          stopSound();
          stopVibration();
          stopBlinkingFlashlight();
          setNewNotification(null);
          // startTracking();
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
