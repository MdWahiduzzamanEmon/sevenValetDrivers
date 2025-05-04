import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs/HomeTabs';
import AuthNavigator from './AuthNavigator/AuthNavigator';
import Header from '../components/Header/Header';

const Stack = createNativeStackNavigator();

const ParentNavigator = () => {
  const letUserAuthenticate = true; // Replace with your authentication logic

  return (
    <Stack.Navigator
      initialRouteName={letUserAuthenticate ? 'Home' : 'Auth'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Home"
        component={HomeTabs}
        options={{
          headerShown: true,
          header: props => <Header {...props} />,
        }}
      />
      {/* <Stack.Screen name="Profile" component={EmptyScreen} /> */}
      {/* <Stack.Screen name="Settings" component={EmptyScreen} /> */}
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
