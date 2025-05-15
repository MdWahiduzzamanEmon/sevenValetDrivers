import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import TextWrapper from '../TextWrapper/TextWrapper';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  actionLabel?: string;
  onAction?: () => void;
}

const {width} = Dimensions.get('window');

const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
  type = 'info',
  actionLabel,
  onAction,
}: CustomAlertProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FFC107';
      default:
        return '#2196F3';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              borderTopColor: getTypeColor(),
            },
          ]}>
          <View style={styles.header}>
            <TextWrapper style={[styles.title, {color: getTypeColor()}]}>
              {title}
            </TextWrapper>
          </View>
          <View style={styles.content}>
            <TextWrapper style={styles.message}>{message}</TextWrapper>
          </View>
          <View style={styles.footer}>
            {actionLabel && onAction ? (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: getTypeColor()}]}
                onPress={() => {
                  onClose();
                  onAction();
                }}>
                <TextWrapper style={styles.buttonText}>
                  {actionLabel}
                </TextWrapper>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: getTypeColor()}]}
                onPress={onClose}>
                <TextWrapper style={styles.buttonText}>OK</TextWrapper>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderTopWidth: 4,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
