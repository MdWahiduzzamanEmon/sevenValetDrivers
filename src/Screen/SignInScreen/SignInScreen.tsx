/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../Utils/CustomTextInput/CustomTextInput';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {APP_NAME} from '../../config';
import {useTranslation} from 'react-i18next';
import {useLoginMutation} from '../../Store/feature/Auth/authApiSlice';
import {useAppDispatch} from '../../Store/Store';
import {setUser} from '../../Store/feature/Auth/authSlice';

const SignInScreen = () => {
  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();
  const [login, {isLoading}] = useLoginMutation();
  const dispatch = useAppDispatch();
  // navigation.navigate('Home' as never); // Replace with your home screen name

  const onSignIn = async () => {
    if (!userId || !password) {
      Alert.alert('Please enter username and password');
      return;
    }

    try {
      const response = await login({
        driverId: userId,
        passcode: password,
      }).unwrap();
      console.log(response);
      if (response?.result?.success) {
        dispatch(setUser(response?.result?.data));
        navigation.navigate('Home' as never);
      } else {
        Alert.alert('Login Failed', JSON.stringify(response.error));
      }
    } catch (error) {
      console.log('error', error);
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

      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 100,
          flex: 1,
          justifyContent: 'flex-start',
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
        <CustomTextInput
          label={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => setRememberMe(prev => !prev)}
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
            onPress={() => setRememberMe(prev => !prev)}
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
