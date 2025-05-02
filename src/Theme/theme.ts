import {MD3LightTheme as DefaultTheme} from 'react-native-paper';

const fontConfig = {
  custom: {
    //poppins
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    italic: {
      fontFamily: 'Poppins-Italic',
      fontWeight: 'normal',
    },
    boldItalic: {
      fontFamily: 'Poppins-BoldItalic',
      fontWeight: 'normal',
    },
    semiBold: {
      fontFamily: 'Poppins-SemiBold',
      fontWeight: 'normal',
    },
    extraBold: {
      fontFamily: 'Poppins-ExtraBold',
      fontWeight: 'normal',
    },
    extraLight: {
      fontFamily: 'Poppins-ExtraLight',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
  },
} as any;

const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac4',
    text: '#fff',
  },
} as any;

export default theme;
