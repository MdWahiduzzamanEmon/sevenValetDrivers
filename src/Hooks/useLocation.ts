import {useContext} from 'react';
import {LocationContext} from '../Provider/LocationTrackerProvider/LocationTrackerProvider';

const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      'useLocation must be used within a LocationTrackerProvider',
    );
  }
  return context;
};

export default useLocation;
