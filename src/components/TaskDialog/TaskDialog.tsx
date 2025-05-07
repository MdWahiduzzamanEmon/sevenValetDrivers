import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type TaskDialogProps = {
  visible: boolean;
  taskType: string;
  onAccept: () => void;
  theme: {colors: {primary: string}};
};

export const TaskDialog: React.FC<TaskDialogProps> = ({
  visible,
  taskType,
  onAccept,
  theme,
}) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      pulse.value = withRepeat(
        withTiming(1.2, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    }
  }, [pulse, visible]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      pulse.value,
      [1, 1.2],
      ['#FFA500', theme.colors.primary],
    );

    return {
      borderColor,
      borderWidth: pulse.value > 1 ? 2 : 1,
    };
  });

  const pulsingStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: pulse.value}],
      backgroundColor: theme.colors.primary,
      borderRadius: 100,
      padding: 10,
      opacity: 0.8,
      marginBottom: 10,
    };
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialog,
            animatedBorderStyle,
            {
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: theme.colors.primary,
            },
          ]}>
          <Animated.View style={[pulsingStyle]}>
            <Avatar.Icon
              icon="car"
              size={SCREEN_HEIGHT * 0.1}
              backgroundColor={theme.colors.primary}
              style={{borderRadius: 100}}
            />
          </Animated.View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New </Text>
            <Text
              style={[
                styles.title,
                {color: theme.colors.primary, fontWeight: '700'},
              ]}>
              {taskType}
            </Text>
            <Text style={styles.title}> Task</Text>
          </View>
          <Text style={styles.subtitle}>
            {`You have a new ${taskType} task assigned.`}
          </Text>
          <Text style={styles.subtitle}>
            {`Please accept the task to proceed.`}
          </Text>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={onAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minWidth: '80%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
