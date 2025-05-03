import React from 'react';
import SuspenseComponent from '../../Provider/Suspense/Suspense';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import LandingPages from '../../../Pages/LandingPages/LandingPages';

const Stack = createNativeStackNavigator();

const Login = React.lazy(
  () => import('../../Screen/SignInScreen/SignInScreen'),
);

const Register = React.lazy(
  () => import('../../Screen/SignUpScreen/SignUpScreen'),
);

const LoginSuspense = (props: any) => {
  // console.log('props', props?.route?.name);
  return (
    <SuspenseComponent>
      <Login {...props} />
    </SuspenseComponent>
  );
};

const RegisterSuspense = (props: any) => {
  return (
    <SuspenseComponent>
      <Register {...props} />
    </SuspenseComponent>
  );
};

// const LandingPagesSuspense = (props: any) => {
//   return (
//     <SuspenseComponent>
//       <LandingPages {...props} />
//     </SuspenseComponent>
//   );
// };

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={'driver-login'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="driver-login" component={LoginSuspense} />
      <Stack.Screen name="driver-register" component={RegisterSuspense} />
      {/* <Stack.Screen
        name="landing_page"
        component={LandingPagesSuspense}
        options={{
          header: Header,
          headerShown: true,
        }} */}
      {/* /> */}
    </Stack.Navigator>
  );
}
