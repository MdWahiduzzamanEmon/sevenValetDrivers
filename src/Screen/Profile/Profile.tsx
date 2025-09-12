import React, {useState, useEffect} from 'react';
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
import CustomButton from '../../Utils/CustomButton/CustomButton';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';
import {PARKING_OPTIONS} from '../../constant/parkingOptions';
import {LANGUAGES_LIST} from '../../constant';
import {useTranslation} from 'react-i18next';
import CustomDropdown from '../../Utils/CustomDropdown/CustomDropdown';
import CustomTextInput from '../../Utils/CustomTextInput/CustomTextInput';
import {useUpdateProfileMutation} from '../../Store/feature/Auth/authApiSlice';
import {useAlert} from '../../Utils/CustomAlert/AlertContext';
import {useAppSelector} from '../../Store/Store';
import {selectLanguageFullName} from '../../Utils/selectLanguageFullName';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Profile = () => {
  const {t, i18n} = useTranslation();
  const [selectedParking, setSelectedParking] = useState('club');
  const [selectLanguage, setSelectLanguage] = useState('en');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const {showAlert} = useAlert();

  // const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add state for password visibility
  // const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {user} = useAppSelector(state => state.authSlice);

  const [updateProfile, {isLoading}] = useUpdateProfileMutation();

  // Initialize form values from user data
  useEffect(() => {
    if (user) {
      // Set language from user data if available
      if (user.language) {
        setSelectLanguage(user.language);
      }
      // Set location from user data if available
      if (user.curLocation) {
        setSelectedParking(user.curLocation);
      }
    }
  }, [user]);

  const togglePasswordSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPasswordSection(prev => !prev);
  };

  // console.log('user', user);
  console.log('user structure:', JSON.stringify(user, null, 2));

  const handleChangePassword = async () => {
    // Validate inputs

    if (newPassword !== confirmPassword) {
      showAlert(t('error'), t('password_not_match'), 'error');
      return;
    }
    // console.log('user?.id', user?.id, 'curLocation:', selectedParking);
    // console.log('All user properties:', Object.keys(user || {}));

    // Check if we have a valid user ID
    const userId = user?.id || (user as any)?.driverId || (user as any)?.userId;
    console.log('Determined userId:', userId);

    if (!userId) {
      showAlert(t('error'), 'User ID not found. Please login again.', 'error');
      return;
    }

    // Prepare data for update
    try {
      const body = {
        recId: userId,
        language: selectLanguageFullName(selectLanguage),
        curLocation: selectedParking,
        ...(newPassword && {
          newPasscode: newPassword?.toString(),
        }),
      };

      const response = await updateProfile(body).unwrap();

      if (response?.result?.success) {
        const successMessage = newPassword
          ? t('password_updated')
          : t('current_location_updated');
        showAlert(t('success'), successMessage, 'success');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
      } else {
        showAlert(
          t('error'),
          response?.result?.message || t('update_failed'),
          'error',
        );
      }
    } catch (error: any) {
      console.log('Update profile error:', error);

      // Safely extract error message
      let errorMessage = t('update_failed');
      try {
        errorMessage =
          error?.data?.message ||
          error?.error?.message ||
          error?.message ||
          (typeof error === 'string' ? error : t('update_failed'));
      } catch (e) {
        console.log('Error parsing error message:', e);
        errorMessage = t('update_failed');
      }

      // Check for network errors safely
      const isNetworkError =
        error?.status === 'FETCH_ERROR' ||
        error?.originalStatus === 0 ||
        (error?.message &&
          typeof error.message === 'string' &&
          error.message.toLowerCase().includes('network'));

      if (isNetworkError) {
        showAlert(
          t('error'),
          t('no_internet_connection') ||
            'No Internet Connection! Please check your internet connection and try again.',
          'error',
        );
      } else {
        showAlert(t('error'), errorMessage, 'error');
      }
    }
  };

  const handleSelectParking = (value: string) => {
    setSelectedParking(value);
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
          <CustomDropdown
            label={t('Current Location')}
            value={selectedParking}
            options={PARKING_OPTIONS}
            onSelect={handleSelectParking}
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
              {/* <CustomTextInput
                label={t('old_password')}
                value={oldPassword}
                onChangeText={text => setOldPassword(text.trim())}
                secureTextEntry
                showPasswordToggle
                isPasswordVisible={showOldPassword}
                onTogglePassword={() => setShowOldPassword(!showOldPassword)}
              /> */}
              <CustomTextInput
                label={t('new_password')}
                value={newPassword}
                onChangeText={text => setNewPassword(text.trim())}
                secureTextEntry
                showPasswordToggle
                isPasswordVisible={showNewPassword}
                onTogglePassword={() => setShowNewPassword(!showNewPassword)}
              />
              <CustomTextInput
                label={t('confirm_password')}
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text.trim())}
                secureTextEntry
                showPasswordToggle
                isPasswordVisible={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </View>
          )}
          <CustomButton
            style={{marginTop: 16}}
            label={t('update')}
            onPress={handleChangePassword}
            loading={isLoading}
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
