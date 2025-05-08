import React, {createContext, useState, ReactNode} from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import Geolocation, {
  GeolocationOptions,
} from '@react-native-community/geolocation';
import {
  UpdateLocationData,
  useUpdateDriverLocationMutation,
} from '../../Store/feature/globalApiSlice';
import {useAppSelector} from '../../Store/Store';

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
}

// Create Context
export const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

// Provider Props
interface ProviderProps {
  children: ReactNode;
}

export const LocationTrackerProvider = ({children}: ProviderProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Ask for permission (Android only)
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs location access to track your movements.',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
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
          return false;
        }

        return true;
      } catch (error) {
        console.warn('Permission error:', error);
        return false;
      }
    }

    return true; // iOS permission handled in Info.plist
  };

  //useUpdateLocationMutation
  const {user} = useAppSelector(state => state.authSlice) as any;

  const [updateDriverLocation] = useUpdateDriverLocationMutation();

  // Start location tracking
  const startTracking = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

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
          if (!user?.id) return;

          const data = {
            driverId: user?.id,
            latitude: latitude?.toString(),
            longitude: longitude?.toString(),
            speed: speed ?? 45,
            heading: heading ?? 120,
          } as UpdateLocationData;

          const res = await updateDriverLocation(data).unwrap();

          if (res?.result?.success) {
            console.log('Location updated successfully:', res);
          } else {
            console.error('Failed to update location:', res?.result?.message);
          }
        } catch (error) {
          console.error('Error updating location:', error);
        }
      },
      error => {
        console.error('Location Error:', error);
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
    }
  };

  return (
    <LocationContext.Provider value={{location, startTracking, stopTracking}}>
      {children}
    </LocationContext.Provider>
  );
};
