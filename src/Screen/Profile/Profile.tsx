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
import CustomTextInput from '../../Utils/CustomTextInput/CustomTextInput';
import CustomButton from '../../Utils/CustomButton/CustomButton';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';
import {LANGUAGES_LIST} from '../../constant';
import {useTranslation} from 'react-i18next';
import CustomDropdown from '../../Utils/CustomDropdown/CustomDropdown';
// import i18n from '../../../i18n';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Profile = ({route}: any) => {
  const {t, i18n} = useTranslation();
  // const title = route?.name || 'Profile';
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

  const handleSelectLanguage = (value: string) => {
    i18n.changeLanguage(value);
    setSelectLanguage(value);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, marginTop: 20}}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <TextWrapper style={styles.header}>{t('profile')}</TextWrapper>

          <CustomDropdown
            label={t('select_language')}
            value={selectLanguage}
            options={LANGUAGES_LIST}
            onSelect={handleSelectLanguage}
          />

          <TouchableOpacity
            onPress={togglePasswordSection}
            style={styles.collapseHeader}>
            <TextWrapper style={styles.collapseHeaderText}>
              {showPasswordSection ? t('hide') : t('change_password')}
            </TextWrapper>
          </TouchableOpacity>

          {showPasswordSection && (
            <View style={styles.passwordSection}>
              <CustomTextInput
                label={t('old_password')}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />
              <CustomTextInput
                label={t('new_password')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <CustomTextInput
                label={t('confirm_password')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}
          <CustomButton
            style={{marginTop: 16}}
            label={t('update')}
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
