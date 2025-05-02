import React from 'react';
import {RadioButton} from 'react-native-paper';
import {View} from 'react-native';
import TextWrapper from '../TextWrapper/TextWrapper';
import {StyleSheet} from 'react-native';

interface Props {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}

const CustomRadioGroup: React.FC<Props> = ({label, value, onValueChange}) => {
  return (
    <View style={styles.container}>
      <TextWrapper style={{marginRight: 10, color: 'gray'}}>
        {label || 'Gender'}
      </TextWrapper>
      <View style={styles.row}>
        <RadioButton
          value="male"
          status={value === 'male' ? 'checked' : 'unchecked'}
          onPress={() => onValueChange('male')}
          color="white"
        />
        <TextWrapper>Male</TextWrapper>
        <RadioButton
          value="female"
          status={value === 'female' ? 'checked' : 'unchecked'}
          onPress={() => onValueChange('female')}
          color="white"
        />
        <TextWrapper>Female</TextWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomRadioGroup;
