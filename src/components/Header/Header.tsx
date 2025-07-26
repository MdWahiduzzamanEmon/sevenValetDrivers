/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SCREEN_WIDTH} from '../../config';
import logout from '../../assets/logout.png';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../Store/Store';
import {setLogout} from '../../Store/feature/Auth/authSlice';
import {useLogoutApiMutation} from '../../Store/feature/Auth/authApiSlice';

const Header = () => {
  const {t} = useTranslation();
  const navigate = useNavigation() as any;
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.authSlice);
  const [logoutApi] = useLogoutApiMutation();

  const onLogout = async () => {
    // Handle logout logic here
    // console.log('Logout pressed');
    // Call the logout API
    try {
      await logoutApi(user).unwrap();
      // console.log('Logout successful');
      dispatch(setLogout());
      navigate.navigate('Auth');
    } catch (error: any) {
      if (
        error?.status === 'FETCH_ERROR' ||
        error?.name === 'ApiError' ||
        error?.message?.toLowerCase().includes('network') ||
        error?.originalStatus === 0
      ) {
        // Optionally show alert here if needed
      } else {
        console.error('Logout failed', error);
      }
    }
  };
  return (
    <View style={styles.container}>
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
          {t('logout')}
        </TextWrapper>
      </TouchableOpacity>
    </View>
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
    width: 120,
    height: 55,
  },
});
