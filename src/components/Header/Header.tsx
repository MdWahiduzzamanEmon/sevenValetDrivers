import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SCREEN_WIDTH} from '../../config';
import logout from '../../assets/logout.png';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Header = ({...props}) => {
  const navigate = useNavigation() as any;
  const onLogout = () => {
    // Handle logout logic here
    console.log('Logout pressed');
    navigate.navigate('Auth');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo or App Icon */}
      <Image
        source={require('../../assets/logo.png')} // update path to your logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Logout Icon */}
      <TouchableOpacity
        onPress={onLogout}
        activeOpacity={0.8}
        style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <Image
          source={logout}
          style={{width: 24, height: 24}} // adjust size as needed
          resizeMode="contain"
        />
        <TextWrapper
          style={{
            fontSize: 12,
            color: '#fff', // adjust color as needed
            textAlign: 'center',
          }}>
          Logout
        </TextWrapper>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#000', // your header background color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 70,
    height: 55,
  },
});
