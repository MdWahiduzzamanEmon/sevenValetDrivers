import React from 'react';
import {useTheme} from 'react-native-paper';
import {Text} from 'react-native-paper';

const TextWrapper = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const theme = useTheme();
  return (
    <Text
      {...props}
      style={{
        color: theme.colors.text,
        ...props.style,
      }}>
      {children}
    </Text>
  );
};

export default TextWrapper;
