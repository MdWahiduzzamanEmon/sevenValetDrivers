import React, {createContext, useState, ReactNode, useEffect} from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  BackHandler,
  Linking,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation, {
  GeolocationOptions,
} from '@react-native-community/geolocation';
import {
  UpdateLocationData,
  useUpdateDriverLocationMutation,
} from '../../Store/feature/globalApiSlice';
import {useAppSelector} from '../../Store/Store';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

// Define types
interface LocationData {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  accuracy: number;
}

interface LocationContextType {
  location: LocationData | null;
  startTracking: () => void;
  stopTracking: () => void;
  permissionGranted: boolean | null;
  checkLocationPermission: () => Promise<boolean>;
  isTracking: boolean;
}

// Create Context
export const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

// Storage key for permission status
const LOCATION_PERMISSION_KEY = '@location_permission_granted';

// Provider Props
interface ProviderProps {
  children: ReactNode;
}

export const LocationTrackerProvider = ({children}: ProviderProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isRequestingPermission, setIsRequestingPermission] =
    useState<boolean>(false);

  // Check current permission status without requesting
  const checkLocationPermission = async (): Promise<boolean> => {
    try {
      // First check stored permission status
      const storedPermission = await AsyncStorage.getItem(
        LOCATION_PERMISSION_KEY,
      );

      if (Platform.OS === 'android') {
        const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        const granted = status === RESULTS.GRANTED;

        // Update stored permission if it changed
        if (storedPermission !== granted.toString()) {
          await AsyncStorage.setItem(
            LOCATION_PERMISSION_KEY,
            granted.toString(),
          );
        }

        setPermissionGranted(granted);
        return granted;
      } else {
        // For iOS, check using the react-native-permissions library
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        const granted = status === RESULTS.GRANTED;

        // Update stored permission if it changed
        if (storedPermission !== granted.toString()) {
          await AsyncStorage.setItem(
            LOCATION_PERMISSION_KEY,
            granted.toString(),
          );
        }

        setPermissionGranted(granted);
        return granted;
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  };

  // Request permission only if not already granted
  const requestLocationPermission = async (): Promise<boolean> => {
    // Prevent multiple simultaneous permission requests
    if (isRequestingPermission) {
      console.log('Permission request already in progress, waiting...');
      return false;
    }

    // First check if we already have permission
    const hasPermission = await checkLocationPermission();
    if (hasPermission) {
      return true;
    }

    // Only request if we don't have permission
    if (Platform.OS === 'android') {
      try {
        setIsRequestingPermission(true);

        // Check if permission was already denied and user said "Don't ask again"
        const currentStatus = await check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        if (currentStatus === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Location permission is permanently denied. Please enable it in Settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
          setIsRequestingPermission(false);
          return false;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs location access to track your movements.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            buttonNeutral: 'Ask Me Later',
          },
        );

        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissionGranted(isGranted);

        // Store the permission result
        await AsyncStorage.setItem(
          LOCATION_PERMISSION_KEY,
          isGranted.toString(),
        );

        if (!isGranted) {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this app.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Exit App',
                onPress: () => BackHandler.exitApp(),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
          setIsRequestingPermission(false);
          return false;
        }

        setIsRequestingPermission(false);
        return true;
      } catch (error) {
        console.warn('Permission error:', error);
        setPermissionGranted(false);
        setIsRequestingPermission(false);
        return false;
      }
    }

    return true; // iOS permission handled in Info.plist
  };

  //useUpdateLocationMutation
  const {user} = useAppSelector(state => state.authSlice) as any;

  const [updateDriverLocation] = useUpdateDriverLocationMutation();

  // Check permission status on mount
  useEffect(() => {
    let isMounted = true;

    const initializePermission = async () => {
      try {
        // Prevent multiple initialization calls
        if (!isMounted) {
          return;
        }

        // Load stored permission status first for quick UI update
        const storedPermission = await AsyncStorage.getItem(
          LOCATION_PERMISSION_KEY,
        );
        if (storedPermission !== null && isMounted) {
          setPermissionGranted(storedPermission === 'true');
        }

        // Then check actual permission status
        if (isMounted) {
          await checkLocationPermission();
        }
      } catch (error) {
        console.error('Error initializing permission status:', error);
      }
    };

    // Only initialize if permission hasn't been checked yet
    if (permissionGranted === null) {
      initializePermission();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to run only once on mount

  // Helper to check if location services are enabled (Android)
  const checkLocationServicesEnabled = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const isEnabled = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (isEnabled === RESULTS.BLOCKED || isEnabled === RESULTS.DENIED) {
          return false;
        }
        // Additional check: try to get current position to see if location is really enabled
        return new Promise(resolve => {
          Geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false),
            {enableHighAccuracy: true, timeout: 5000, maximumAge: 0},
          );
        });
      } catch (e) {
        return false;
      }
    }
    return true;
  };

  // Start location tracking
  const startTracking = async () => {
    // Don't start tracking if already tracking
    if (isTracking) {
      console.log('Location tracking is already active');
      return;
    }

    // Don't start if permission request is in progress
    if (isRequestingPermission) {
      console.log('Permission request in progress, cannot start tracking');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission not granted, cannot start tracking');
      return;
    }

    // Check if location services are enabled
    const isLocationEnabled = await checkLocationServicesEnabled();
    if (!isLocationEnabled) {
      Alert.alert(
        'Location Services Off',
        'Please enable location services (GPS) to use this feature.',
        [
          {
            text: 'Open Location Settings',
            onPress: () => Linking.openSettings(),
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: false},
      );
      return;
    }

    console.log('Starting location tracking...');
    setIsTracking(true);

    const options: GeolocationOptions = {
      enableHighAccuracy: true,
      distanceFilter: 1, // Report all movements
      timeout: 10000, // 10 seconds timeout for location request
      maximumAge: 0, // Do not use cached location
      interval: 2000, // Update every second
      fastestInterval: 1000, // Fastest interval for location updates
    };

    const id = Geolocation.watchPosition(
      async (position: any) => {
        const {latitude, longitude, speed, heading, accuracy} = position.coords;

        if (Platform.OS === 'ios' && accuracy > 100) {
          Alert.alert(
            'Low Accuracy',
            'Enable "Precise Location" in Settings for better results.',
          );
        }

        setLocation({
          latitude,
          longitude,
          speed: speed ?? null,
          heading: heading ?? null,
          accuracy,
        });
        // Update location in the backend
        try {
          if (!user?.id) {
            return;
          }

          if (!latitude || !longitude) {
            console.error('Invalid location data:', {latitude, longitude});
            return;
          }

          const data = {
            driverId: user?.id,
            latitude: latitude?.toString(),
            longitude: longitude?.toString(),
            speed: speed ?? 45,
            heading: heading ?? 120,
          } as UpdateLocationData;

          try {
            const res = await updateDriverLocation(data).unwrap();
            if (res?.result?.success) {
              console.log('Location updated successfully:', res);
            } else {
              console.error('Failed to update location:', res?.result?.message);
            }
          } catch (error: any) {
            if (
              error?.status === 'FETCH_ERROR' ||
              error?.name === 'ApiError' ||
              error?.message?.toLowerCase().includes('network') ||
              error?.originalStatus === 0
            ) {
              Alert.alert(
                'Network Error',
                'Failed to update location. Please check your internet connection.',
                [{text: 'OK'}],
                {cancelable: false},
              );
            } else {
              console.error('Error updating location:', error);
            }
          }
        } catch (error) {
          console.error('Error updating location:', error);
        }
      },
      error => {
        console.error('Location Error:', error);
        setIsTracking(false);
        Alert.alert('Location Error', error.message);
      },
      options,
    );

    setWatchId(id);
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  // Handle app state changes to re-check permissions
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Re-check permission when app becomes active
        setTimeout(async () => {
          try {
            await checkLocationPermission();
          } catch (error) {
            console.error('Error checking permission on app focus:', error);
          }
        }, 1000); // Delay to ensure app is fully active
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        startTracking,
        stopTracking,
        permissionGranted,
        checkLocationPermission,
        isTracking,
      }}>
      {children}
    </LocationContext.Provider>
  );
};
