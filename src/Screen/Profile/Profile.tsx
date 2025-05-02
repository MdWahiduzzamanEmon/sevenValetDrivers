import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import CustomDropdown from '../../Utils/CustomDropdown/CustomDropdown';
import CustomTextInput from '../../Utils/CustomTextInput/CustomTextInput';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import { PADDING_SCREEN_HORIZONTAL } from '../../config';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Profile = ({route}: any) => {
  const title = route?.name || 'Profile';
  const [selectLanguage, setSelectLanguage] = useState('en');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPasswordSection(prev => !prev);
  };

  const handleChangePassword = () => {
    // Add validation or API call here
    console.log('Changing password:', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, marginTop: 20}}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <TextWrapper style={styles.header}>{title}</TextWrapper>

          <CustomDropdown
            label="Language"
            value={selectLanguage}
            options={[
              {label: 'English', value: 'en'},
              {label: 'French', value: 'fr'},
              {label: 'Spanish', value: 'es'},
              {label: 'German', value: 'de'},
              {label: 'Italian', value: 'it'},
            ]}
            onSelect={value => setSelectLanguage(value)}
          />

          <TouchableOpacity
            onPress={togglePasswordSection}
            style={styles.collapseHeader}>
            <TextWrapper style={styles.collapseHeaderText}>
              {showPasswordSection ? 'Hide' : 'Change Password'}
            </TextWrapper>
          </TouchableOpacity>

          {showPasswordSection && (
            <View style={styles.passwordSection}>
              <CustomTextInput
                label="Old Password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />
              <CustomTextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <CustomTextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}
          <CustomButton
            style={{marginTop: 16}}
            label="Update"
            onPress={handleChangePassword}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: PADDING_SCREEN_HORIZONTAL,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  collapseHeader: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3F3F3F',
    borderRadius: 8,
  },
  collapseHeaderText: {
    fontSize: 16,
    color: '#fff',
  },
  passwordSection: {
    marginTop: 16,
  },
});
