// Custom hook for keep awake functionality
import {useEffect, useRef} from 'react';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {AppState, AppStateStatus} from 'react-native';

export const useKeepAwake = () => {
  const isActiveRef = useRef(true);

  useEffect(() => {
    console.log('useKeepAwake: Initializing keep awake functionality');

    // Immediately activate keep awake
    const activateNow = () => {
      try {
        activateKeepAwake();
        console.log('useKeepAwake: Successfully activated keep awake');
      } catch (error) {
        console.error('useKeepAwake: Failed to activate keep awake:', error);
      }
    };

    activateNow();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        console.log('useKeepAwake: AppState changed to:', nextAppState);

        if (nextAppState === 'active') {
          isActiveRef.current = true;
          console.log(
            'useKeepAwake: App became active - activating keep awake',
          );
          activateNow();
        } else if (
          nextAppState === 'background' ||
          nextAppState === 'inactive'
        ) {
          isActiveRef.current = false;
          console.log(
            'useKeepAwake: App became inactive - deactivating keep awake',
          );
          try {
            deactivateKeepAwake();
            console.log('useKeepAwake: Successfully deactivated keep awake');
          } catch (error) {
            console.error(
              'useKeepAwake: Failed to deactivate keep awake:',
              error,
            );
          }
        }
      },
    );

    return () => {
      console.log('useKeepAwake: Cleanup - deactivating keep awake');
      try {
        deactivateKeepAwake();
        console.log('useKeepAwake: Cleanup successful');
      } catch (error) {
        console.error('useKeepAwake: Cleanup failed:', error);
      }
      subscription.remove();
    };
  }, []);

  // Additional effect to ensure keep awake is maintained
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActiveRef.current) {
        console.log('useKeepAwake: Periodic keep awake refresh');
        try {
          activateKeepAwake();
        } catch (error) {
          console.error('useKeepAwake: Periodic refresh failed:', error);
        }
      }
    }, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);
};
