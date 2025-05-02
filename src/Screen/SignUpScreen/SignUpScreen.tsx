import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CustomTextInput from '../../Utils/CustomTextInput/CustomTextInput';
import CustomRadioGroup from '../../Utils/CustomRadioGroup/CustomRadioGroup';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {useNavigation} from '@react-navigation/native';
import {APP_NAME} from '../../config';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const navigation = useNavigation();

  const onConfirm = () => {
    // Handle signup logic
  };

  const goToSignIn = () => {
    // Navigate to Sign In screen
    navigation.navigate('driver-login' as never);
  };

  return (
    <Container>
      <View style={{padding: 16, alignItems: 'flex-start'}}>
        <TextWrapper style={{fontSize: 18}}>Sign Up</TextWrapper>
        <TextWrapper style={{fontSize: 14, color: 'gray'}}>
          Please fill in the details below to create an account.
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

      <View style={{padding: 16, flex: 1, justifyContent: 'center'}}>
        <ScrollView keyboardShouldPersistTaps="always">
          <CustomTextInput
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
          />
          <CustomTextInput
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
          />
          <CustomTextInput
            label="Mobile Number *"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
          <CustomTextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomRadioGroup
            value={gender}
            onValueChange={setGender}
            label="Gender *"
          />

          <CustomButton label="Confirm" onPress={onConfirm} />
          <CustomButton
            label="Cancel"
            onPress={() => {
              goToSignIn();
            }}
            mode="outlined"
          />
        </ScrollView>
      </View>
    </Container>
  );
};

export default SignUpScreen;

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
