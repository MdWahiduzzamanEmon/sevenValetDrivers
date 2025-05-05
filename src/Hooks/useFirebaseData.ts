//useFirebseData.ts

import {useContext} from 'react';
import {FirebaseContext} from '../Provider/FirebaseProvider/FirebaseProvider';

export const useFirebaseData = () => {
  //context hook
  return useContext(FirebaseContext);
};
