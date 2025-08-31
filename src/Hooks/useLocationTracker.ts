import {useRef, useCallback} from 'react';
import useLocation from './useLocation';

// Custom hook to manage location tracking with debouncing
export const useLocationTracker = () => {
  const {startTracking, stopTracking, isTracking, location} = useLocation();
  const lastCallTimeRef = useRef<number>(0);
  const isStartingRef = useRef<boolean>(false);

  // Minimum time between startTracking calls (in milliseconds)
  const DEBOUNCE_TIME = 2000;

  const debouncedStartTracking = useCallback(async () => {
    const now = Date.now();

    // Prevent rapid consecutive calls
    if (now - lastCallTimeRef.current < DEBOUNCE_TIME) {
      console.log('StartTracking debounced - too soon since last call');
      return;
    }

    // Prevent multiple simultaneous calls
    if (isStartingRef.current) {
      console.log('StartTracking already in progress');
      return;
    }

    // Don't start if already tracking
    if (isTracking) {
      console.log('Location tracking already active');
      return;
    }

    try {
      isStartingRef.current = true;
      lastCallTimeRef.current = now;

      await startTracking();
    } catch (error) {
      console.error('Error starting location tracking:', error);
    } finally {
      isStartingRef.current = false;
    }
  }, [startTracking, isTracking]);

  const safeStopTracking = useCallback(() => {
    if (isTracking) {
      stopTracking();
    }
  }, [stopTracking, isTracking]);

  return {
    startTracking: debouncedStartTracking,
    stopTracking: safeStopTracking,
    isTracking,
    location,
  };
};

export default useLocationTracker;
