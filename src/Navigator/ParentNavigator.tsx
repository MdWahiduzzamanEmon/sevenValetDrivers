import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs/HomeTabs';
import AuthNavigator from './AuthNavigator/AuthNavigator';
import Header from '../components/Header/Header';
import {useAppSelector} from '../Store/Store';

const Stack = createNativeStackNavigator();

const HomeHeader = () => <Header />;

const ParentNavigator = () => {
  // const letUserAuthenticate = false; // Replace with your authentication logic
  const {isAuthenticated} = useAppSelector(state => state.authSlice);
  const letUserAuthenticate = isAuthenticated;

  return (
    <Stack.Navigator
      initialRouteName={letUserAuthenticate ? 'Home' : 'Auth'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Home"
        component={HomeTabs}
        options={{
          headerShown: true,
          header: HomeHeader,
        }}
      />
      {/* <Stack.Screen name="Profile" component={EmptyScreen} /> */}
      {/* <Stack.Screen name="Settings" component={EmptyScreen} /> */}
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
