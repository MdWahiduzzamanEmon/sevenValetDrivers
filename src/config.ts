import {Dimensions} from 'react-native';
import theme from './Theme/theme';

export const GRADIENT_THEME_COLORS = ['#000000', '#000000', '#3c1e00'];
export const APP_NAME = 'SEVEN Valet';
export const FIREBASE_APP_NAME = 'SevenValet';

const {width, height} = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const PADDING_SCREEN_HORIZONTAL = 10;
export const BG_COLOR_BUTTON = theme.colors.primary;

export type TASK_TYPE = 'ParkIn' | 'ParkOut';
export const TASK_TYPES: TASK_TYPE[] = ['ParkIn', 'ParkOut'];
