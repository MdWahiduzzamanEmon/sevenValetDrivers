/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../Utils/CustomTextInput/CustomTextInput';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {APP_NAME, SCREEN_HEIGHT} from '../../config';
import {useLoginMutation} from '../../Store/feature/Auth/authApiSlice';
import {useAppDispatch, useAppSelector} from '../../Store/Store';
import {
  setUser,
  setRememberMe,
  setSavedCredentials,
} from '../../Store/feature/Auth/authSlice';
import CustomOTPInput from '../../Utils/CustomOTPInput/CustomOTPInput';
import {useAlert} from '../../Utils/CustomAlert/AlertContext';
import {useTranslation} from 'react-i18next';
import {NetworkStatusContext} from '../../Provider/NetworkStatusProvider/NetworkStatusProvider';
import {Avatar} from 'react-native-paper';
import theme from '../../Theme/theme';

const SignInScreen = () => {
  const networkContext = useContext(NetworkStatusContext);
  const isConnected = networkContext?.isConnected;

  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [login, {isLoading}] = useLoginMutation();
  const dispatch = useAppDispatch();
  const {rememberMe, savedCredentials} = useAppSelector(
    state => state.authSlice,
  );
  const {showAlert} = useAlert();

  useEffect(() => {
    if (savedCredentials) {
      setUserId(savedCredentials.driverId);
      setPassword(savedCredentials.passcode);
    }
  }, [savedCredentials]);

  const handleRememberMe = (value: boolean) => {
    dispatch(setRememberMe(value));
    if (value) {
      dispatch(setSavedCredentials({driverId: userId, passcode: password}));
    } else {
      dispatch(setSavedCredentials(null));
    }
  };

  const onSignIn = async () => {
    if (!userId || !password) {
      showAlert('Error', 'Please enter username and password', 'error');
      return;
    }

    if (password.length !== 4) {
      showAlert('Error', 'Password must be 4 digits', 'error');
      return;
    }

    try {
      const response = await login({
        driverId: userId,
        passcode: password,
      }).unwrap();
      // console.log(response);
      if (response?.result?.success) {
        console.log('response?.result?.data', response?.result?.data);
        dispatch(setUser(response?.result?.data));
        if (rememberMe) {
          dispatch(setSavedCredentials({driverId: userId, passcode: password}));
        }
        navigation.navigate('Home' as never);
      } else {
        showAlert(
          'Login Failed',
          response.error?.message ||
            'Please enter correct username and password',
          'error',
        );
      }
    } catch (error: any) {
      console.log('error', error);
      if (
        error?.status === 'FETCH_ERROR' ||
        error?.name === 'ApiError' ||
        error?.message?.toLowerCase().includes('network') ||
        error?.originalStatus === 0
      ) {
        showAlert(
          'No Internet Connection!',
          'Please check your internet connection and try again.',
          'error',
        );
      } else {
        showAlert('Error', 'An unexpected error occurred', 'error');
      }
    }
  };

  // const goToSignUp = () => {
  //   navigation.navigate('driver-register' as never);
  // };

  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //     backgroundColor: '#000',
    //     borderWidth: 1,
    //     borderColor: 'gray',
    //   }}>
    // {/* <StatusBar
    //   animated={true}
    //   backgroundColor="transparent"
    //   barStyle="light-content"
    //   showHideTransition="fade"
    //   hidden={false}
    // /> */}
    <Container>
      <View
        style={{
          padding: 16,
          alignItems: 'flex-start',
        }}>
        <TextWrapper style={{fontSize: 18}}>{t('sign_in')}</TextWrapper>
        <TextWrapper style={{fontSize: 14, color: 'gray'}}>
          {t('sign_in_description')}
        </TextWrapper>
      </View>

      <View style={styles.logoContainer}>
        <TextWrapper style={styles.logoText}>
          {APP_NAME?.split(' ')[0]}
        </TextWrapper>
        <TextWrapper style={styles.smallLogoText}>
          {APP_NAME?.split(' ')[1]} {APP_NAME?.split(' ')[2]}
        </TextWrapper>
      </View>

      {/* //isConnected */}
      {!isConnected && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Avatar.Icon
            icon="wifi-off"
            size={Math.min(SCREEN_HEIGHT * 0.1, 80)}
            backgroundColor={theme.colors.red}
            // style={styles.avatar}
          />
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 16,
          marginTop: isConnected ? 100 : 0,
          flex: 1,
          justifyContent: 'flex-start',
          gap: 8,
          // borderWidth: 1,
          // borderColor: 'gray',
          // borderRadius: 10,
          // backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <CustomTextInput
          label={t('id')}
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
          // maxLength={10}
        />
        <CustomOTPInput
          label={t('password')}
          length={4}
          value={password}
          onChange={setPassword}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => handleRememberMe(!rememberMe)}
            style={{
              height: 20,
              width: 20,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#fff',
              marginRight: 8,
              backgroundColor: rememberMe ? '#fff' : 'transparent',
            }}
          />
          <TextWrapper
            onPress={() => handleRememberMe(!rememberMe)}
            style={{color: '#fff'}}>
            {t('remember_me')}
          </TextWrapper>
        </View>

        <CustomButton
          label={t('sign_in')}
          onPress={onSignIn}
          loading={isLoading}
        />

        {/* <TouchableOpacity onPress={goToSignUp} style={{marginTop: 16}}>
          <TextWrapper style={{color: 'white', textAlign: 'center'}}>
            Don't have an account? Sign Up
          </TextWrapper>
        </TouchableOpacity> */}
      </View>
    </Container>
    // </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  smallLogoText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
});
