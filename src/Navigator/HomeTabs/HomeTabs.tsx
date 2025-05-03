import React, {lazy} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import SuspenseComponent from '../../Provider/Suspense/Suspense';
import Ongoin from '../../assets/ongoing.png';
import asignedTask from '../../assets/completed_task.png';
import profileIcon from '../../assets/profile.png';
import pendingtask from '../../assets/pendingtask.png';
// import Pending from '../../Screen/Pending/Pending';

// Lazy-loaded screens
const OngoinTask = lazy(() => import('../../Screen/OngoinTask/OngoinTask'));
// const PendingTask = lazy(() => import('../../Screen/Pending/Pending'));
const AsignedTask = lazy(() => import('../../Screen/AsignedTask/AsignedTask'));
const Profile = lazy(() => import('../../Screen/Profile/Profile'));

// Tab Navigator
const Tab = createBottomTabNavigator();

// Icon paths
const icons = {
  home: Ongoin,
  pending: pendingtask,
  asigned: asignedTask,
  profile: profileIcon,
};

// Reusable screen wrapper with Suspense
const withSuspense = (Component: React.ComponentType<any>) => (props: any) =>
  (
    <SuspenseComponent>
      <Component {...props} />
    </SuspenseComponent>
  );

// Tab screen config array
const tabScreens = [
  {
    name: 'Ongoing',
    component: withSuspense(OngoinTask),
    icon: icons.home,
  },
  // {
  //   name: 'Pending',
  //   component: withSuspense(PendingTask),
  //   icon: icons.pending,
  // },
  {
    name: 'Asigned',
    component: withSuspense(AsignedTask),
    icon: icons.asigned,
  },
  {
    name: 'Profile',
    component: withSuspense(Profile),
    icon: icons.profile,
  },
];

// =========  render tab bar icon ========== //
const renderTabBarIcon = (routeName: string) => {
  const matchedTab = tabScreens.find(
    tabScreen => tabScreen?.name === routeName,
  );
  return (
    <Image source={matchedTab?.icon} style={styles.icon} resizeMode="contain" />
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Ongoing"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#fff',
        tabBarIcon: ({}) => renderTabBarIcon(route.name),
        tabBarButton: CustomTabBarButton, // 🧠 HERE
      })}>
      {tabScreens.map(({name, component}) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
};

export default HomeTabs;

const CustomTabBarButton = ({children, onPress, accessibilityState}: any) => {
  const isSelected = accessibilityState?.selected;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.customButton, isSelected ? styles.activeTab : null]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
  },
  icon: {
    width: 25,
    height: 25,
  },
  customButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#1e1e1e', // Change to your desired color
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
