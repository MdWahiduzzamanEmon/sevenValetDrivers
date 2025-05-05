// For iOS, ensure auto-init is enabled.

import React, {useEffect} from 'react';
import {firebase} from '@react-native-firebase/analytics';
import {getBrand, getDeviceName} from 'react-native-device-info';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import axios from 'axios';
// import {notif} from '../../Components/PopUp';
// import moment from 'moment';
import apiUrl from '../../Base';
import {FIREBASE_APP_NAME} from '../../config';
// import {stopSound} from '../../Utils/Sound/Sound';
// import {useAppSelector} from '../../Store/Store';
// import { useUserWiseTokenFCMTokenSendMutation } from '../../Store/feature/globalApiSlice';

interface FirebaseContextType {
  firebase: typeof firebase;
  messaging: typeof messaging;
  newNotification: FirebaseMessagingTypes.RemoteMessage | null;
  setNewNotification: React.Dispatch<
    React.SetStateAction<FirebaseMessagingTypes.RemoteMessage | null>
  >;
}

export const FirebaseContext = React.createContext<FirebaseContextType | null>(
  null,
);

export const useFirebase = () => {
  const context = React.useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

const APP_NAME = FIREBASE_APP_NAME;

const FirebaseProvider = ({children}: {children: React.ReactNode}) => {
  const [newNotification, setNewNotification] =
    React.useState<FirebaseMessagingTypes.RemoteMessage | null>(null);
  // const {loginUserData} = useAppSelector(state => state.authSlice) as any;

  // const [userWiseTokenFCMTokenSend] = useUserWiseTokenFCMTokenSendMutation();

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    // console.log('authStatus', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };
  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      try {
        if (Platform.OS === 'ios') {
          await messaging().registerDeviceForRemoteMessages();
        }
        await checkApplicationPermission();
        const isAuthorized = await requestUserPermission();

        if (isAuthorized) {
          const token = await messaging().getToken();

          if (token) {
            // console.log('Get FCM Token:', token);
            await sendFcmTokenToServer(token);
          }

          //send token to the another server for push notification

          // if (token && loginUserData?.user?.id) {
          //   const res = await userWiseTokenFCMTokenSend({
          //     user: loginUserData?.user?.id,
          //     token,
          //     app_name: APP_NAME,
          //   })?.unwrap();
          //   console.log('res', res);
          // }
        } else {
          console.log('Permission Denied');
        }
      } catch (error) {
        console.error('Error in permissions check or token retrieval:', error);
      }
    };

    const sendFcmTokenToServer = async (token: string) => {
      // console.log('FCM Token:', token);
      try {
        if (!token) return;
        console.log('Sending FCM token to server:', token);
        const userDeviceName = getDeviceName();
        const getBrandName = getBrand();

        const body = {
          appName: APP_NAME,
          fcmToken: token,
          deviceName: userDeviceName || 'Unknown Device',
          brand: getBrandName || 'Unknown Brand',
        };

        const URL = apiUrl?.pushService;
        const config = {
          url: URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: body,
        };

        const res = await axios(config);
        console.log('Response from server:', res.data);
      } catch (error) {
        console.error('Error sending FCM token to server:', error);
      }
    };

    //sent userWiseToken: /mobile_firebase_token/
    //     api/mobile_firebase_token/
    // user,
    // token,

    // app_name

    const showNotification = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      // notif?.current?.show({
      //   appTitle: 'Samarabiz',
      //   timeText: moment(remoteMessage?.sentTime).format('hh:mm A'),
      //   title: remoteMessage?.notification?.title,
      //   body: remoteMessage?.notification?.body,
      //   slideOutTime: 9000,
      // });
      // playSound();
      // Alert.alert(
      //   remoteMessage?.notification?.title || 'New Task Assigned',
      //   remoteMessage?.notification?.body,
      //   [
      //     // {
      //     //   text: 'Cancel',
      //     //   onPress: () => console.log('Cancel Pressed'),
      //     //   style: 'cancel',
      //     // },
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         // Handle the OK button press
      //         console.log('OK Pressed');
      //         stopSound();
      //       },
      //     },
      //   ],
      // );

      setNewNotification(remoteMessage);
    };

    //
    const handleInitialNotification = async () => {
      const remoteMessage = await messaging().getInitialNotification();
      // if (remoteMessage && loginUserData?.user?.id) {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        showNotification(remoteMessage);
      }
    };

    const handleBackgroundNotification = async (remoteMessage: any) => {
      console.log('Message handled in the background:', remoteMessage);
      showNotification(remoteMessage);
    }; //background means - when app is closed

    const handleForegroundNotification = (remoteMessage: any) => {
      console.log(
        'A new FCM message arrived in foreground:',
        JSON.stringify(remoteMessage),
      );
      showNotification(remoteMessage);
    };
    //forground means - when app is open

    const subscribeToNotifications = async () => {
      try {
        await messaging().subscribeToTopic('all');
        console.log('Subscribed to topic: all');
      } catch (error) {
        console.error('Error subscribing to topic:', error);
      }
    };

    const initializeMessaging = async () => {
      await checkAndRequestPermissions();
      await handleInitialNotification();
      await subscribeToNotifications();

      messaging().onNotificationOpenedApp(remoteMessage => {
        // if (remoteMessage && loginUserData?.user?.id) {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
          );
          showNotification(remoteMessage);
        }
      });

      messaging().setBackgroundMessageHandler(handleBackgroundNotification);

      const unsubscribe = messaging().onMessage(handleForegroundNotification);

      // Token refresh listener
      const tokenRefreshUnsubscribe = messaging().onTokenRefresh(async () => {
        const refreshedToken = await messaging().getToken();
        if (refreshedToken) {
          sendFcmTokenToServer(refreshedToken);
        }
      });

      // Return the unsubscribe function from onMessage for cleanup
      return () => {
        unsubscribe();
        tokenRefreshUnsubscribe();
      };
    };

    // Call initializeMessaging and ensure it returns a cleanup function
    const setup = async () => {
      const unsubscribe = await initializeMessaging();
      return unsubscribe;
    };

    let unsubscribe: () => void;
    setup().then(fn => {
      unsubscribe = fn;
    });

    // Cleanup by calling unsubscribe if it exists
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        messaging,
        newNotification,
        setNewNotification,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
