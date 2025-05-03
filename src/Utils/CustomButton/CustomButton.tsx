import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  mode?: 'text' | 'outlined' | 'contained';
  [key: string]: any; // Allow additional props
  style?: ViewStyle;
  disabled?: boolean;
}

const CustomButton: React.FC<Props> = ({
  label,
  onPress,
  disabled,
  mode = 'contained',
  ...props
}) => {
  const backgroundColor = mode === 'contained' ? 'white' : 'transparent';
  const textColor = mode === 'contained' ? 'black' : 'white';
  const borderStyle =
    mode === 'outlined' ? {borderWidth: 1, borderColor: 'white'} : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
      style={[
        styles.button,
        {backgroundColor},
        borderStyle,
        props.style,
        {opacity: disabled ? 0.5 : 1},
      ]}>
      <Text style={[styles.label, {color: textColor}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  label: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  } as TextStyle,
});

export default CustomButton;
