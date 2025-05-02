import React from 'react';
import {TextInput, Text, View, StyleSheet, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const CustomTextInput: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {value && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    color: 'white',
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    color: 'white',
    fontSize: 16,
  },
});

export default CustomTextInput;
