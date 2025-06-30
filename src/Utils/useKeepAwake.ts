// Custom hook for keep awake functionality
import {useEffect, useRef} from 'react';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {AppState, AppStateStatus} from 'react-native';

export const useKeepAwake = (enabled: boolean = true) => {
  const isActiveRef = useRef(true);
  const enabledRef = useRef(enabled);

  // Update enabled ref when enabled prop changes
  useEffect(() => {
    enabledRef.current = enabled;

    if (!enabled) {
      try {
        deactivateKeepAwake();
      } catch (error) {
        console.error(
          'useKeepAwake: Failed to deactivate keep awake (disabled):',
          error,
        );
      }
    } else if (enabled && isActiveRef.current) {
      try {
        activateKeepAwake();
      } catch (error) {
        console.error(
          'useKeepAwake: Failed to activate keep awake (enabled):',
          error,
        );
      }
    }
  }, [enabled]);

  useEffect(() => {
    // Immediately activate keep awake if enabled
    const activateNow = () => {
      if (!enabledRef.current) {
        return;
      }

      try {
        activateKeepAwake();
      } catch (error) {
        console.error('useKeepAwake: Failed to activate keep awake:', error);
      }
    };

    if (enabledRef.current) {
      activateNow();
    }

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          isActiveRef.current = true;
          if (enabledRef.current) {
            activateNow();
          }
        } else if (
          nextAppState === 'background' ||
          nextAppState === 'inactive'
        ) {
          isActiveRef.current = false;
          try {
            deactivateKeepAwake();
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
      try {
        deactivateKeepAwake();
      } catch (error) {
        console.error('useKeepAwake: Cleanup failed:', error);
      }
      subscription.remove();
    };
  }, []);

  // Additional effect to ensure keep awake is maintained when enabled
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActiveRef.current && enabledRef.current) {
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
